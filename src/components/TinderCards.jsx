import { useState, useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './ui/TinderCards.module.css';
import Sidebar from './Sidebar';
import TinderCard from "./TinderCard.jsx";
import { FilterBar } from "./FilterBar.jsx";
import { useStore } from "../provider/StoreContext.jsx";
import {
    AUTH_TOKEN,
    INITIAL_CARDS_COUNT, SKELETON_COUNT,
    SWIPE_CONFIG
} from "../constants.js";
import { runInAction } from "mobx";
import { Onboarding } from "./Onboarding.jsx";
import SaveToCollectionModal from "./SaveToCollectionsModal.jsx";
import { useNavigate } from "react-router-dom";
import CustomSkeleton from "./utils/CustomSkeleton.jsx";
import SearchHeaderMain from "./SearchHeaderMain.jsx";

const TinderCards = observer(() => {
    const store = useStore();
    const navigate = useNavigate();

    const [swipeProgress, setSwipeProgress] = useState({ direction: null, opacity: 0 });
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const containerRef = useRef(null);
    const cardRefs = useRef({});

    const showOnboarding = !store?.authStore?.data?.preferences?.complete_onboarding;

    const [filters, setFilters] = useState(() => ({
        size: store?.catalogStore?.getCurrentFilters().sizes || [],
        brand: store?.catalogStore?.getCurrentFilters().brands || [],
        price: {
            min: store?.catalogStore?.getCurrentFilters().min_price || null,
            max: store?.catalogStore?.getCurrentFilters().max_price || null
        },
        type: store?.catalogStore?.getCurrentFilters().categories || []
    }));

    useEffect(() => {
        if (store?.catalogStore?.cards?.length <= INITIAL_CARDS_COUNT &&
            store.catalogStore.hasMore &&
            !store.catalogStore.isFetching) {
            store.catalogStore.fetchCards();
        }
    }, [store?.catalogStore?.cards?.length, store.catalogStore.hasMore, store.catalogStore.isFetching]);

    useEffect(() => {
        if (store?.authStore.data) {
            store.popular.fetchCollections();
        }
    }, [store?.authStore.data]);

    useEffect(() => {
        if (showOnboarding) {
            setOnboardingStep(1);
        }
    }, [showOnboarding]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.getBoundingClientRect().height);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sendInteraction = async (productId, action) => {
        try {
            await fetch(`https://api.lookvogue.ru/v1/interaction/product/${productId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `tma ${AUTH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ interaction_type: action })
            });
        } catch (error) {
            console.error('Error sending interaction:', error);
        }
    };

    const handleSwipe = useCallback((direction, card) => {
        if (direction === 'down') return;

        const action = direction === 'right' ? 'like' : 'dislike';
        sendInteraction(card.id, action);
        store.catalogStore.handleSwipe(direction, card);
        setSwipeProgress({ direction: null, opacity: 0 });
    }, [store.catalogStore]);

    const updateSwipeFeedback = useCallback((dx, dy) => {
        const horizontalThreshold = window.innerWidth * 0.2;
        let direction = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
            direction = dx > 0 ? 'right' : 'left';
            opacity = Math.min(Math.abs(dx) / horizontalThreshold, 1);
        }
        setSwipeProgress({ direction, opacity });
    }, []);

    const [undoButtonHighlight, setUndoButtonHighlight] = useState(false);
    const [saveHighlight, setSaveHighlight] = useState(false);
    const [popularHighlight, setPopularHighlight] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const setCardRef = useCallback((id, ref) => {
        if (ref) cardRefs.current[id] = ref;
        else delete cardRefs.current[id];
    }, []);

    const handleSaveChanges = async () => {
        try {
            const response = await fetch('https://api.lookvogue.ru/v1/user', {
                method: 'PATCH',
                headers: {
                    "Authorization": `tma ${AUTH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ preferences: { complete_onboarding: true } })
            });

            if (!response.ok) throw new Error('Update failed');

            runInAction(() => {
                if (store.authStore.data) {
                    store.authStore.data.preferences = {
                        ...store.authStore.data.preferences,
                        complete_onboarding: true
                    };
                }
            });

        } catch (error) {
            console.error('Update error:', error);
        }
    };

    // NOTE: This complex simulation logic remains as is, assuming it's correct for onboarding purposes.
    const simulateSwipe = useCallback((direction) => {
        if (!store.catalogStore.cards?.length || isAnimating) return;

        const cardId = store.catalogStore.cards[0].id;
        const cardRef = cardRefs.current[cardId];
        if (!cardRef) return;

        setIsAnimating(true);

        const params = {
            left: { endX: -window.innerWidth * 0.7, endY: 0, rotation: -15 },
            right: { endX: window.innerWidth * 0.7, endY: 0, rotation: 15 },
            up: { endX: window.innerWidth * 0.5, endY: -window.innerHeight * 0.5, rotation: 5 }
        }[direction];

        const originalStyles = {
            transform: cardRef.style.transform,
            transition: cardRef.style.transition,
            zIndex: cardRef.style.zIndex,
            willChange: cardRef.style.willChange
        };

        cardRef.style.transition = 'transform 800ms ease-out, opacity 800ms ease-out';
        cardRef.style.willChange = 'transform';
        cardRef.style.transform = `translate3d(${params.endX}px, ${params.endY}px, 0) rotate(${params.rotation}deg)`;
        cardRef.style.zIndex = '10000';

        setTimeout(() => {
            cardRef.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';
            cardRef.style.transform = originalStyles.transform;

            setTimeout(() => {
                cardRef.style.transition = originalStyles.transition;
                cardRef.style.zIndex = originalStyles.zIndex;
                cardRef.style.willChange = originalStyles.willChange;
                setIsAnimating(false);
            }, 300);
        }, 800);
    }, [store.catalogStore.cards, isAnimating]);

    const handleOpenSaveModal = useCallback((product) => {
        setSelectedProduct(product);
        setIsSaveModalOpen(true);
    }, []);

    const handleCloseSaveModal = useCallback(() => {
        setIsSaveModalOpen(false);
        setSelectedProduct(null);
    }, []);

    const handleSaveSuccess = useCallback((productId, isSaved) => {
        runInAction(() => {
            const card = store.catalogStore.cards.find(c => c.id === productId);
            if (card) {
                card.is_contained_in_user_collections = isSaved;
            }
        });
    }, [store.catalogStore.cards]);

    const isInitialLoading = store.catalogStore.isFetching && store.catalogStore.cards.length === 0;

    return (
        <>
            <div className={styles.container} style={{ height: `${containerHeight}px` }} ref={containerRef}>
                <SearchHeaderMain
                    onSearch={(searchRequest) => {
                        setIsSearchActive(true);
                        store.catalogStore.fetchCardsWithSearch(searchRequest);
                    }}
                    onClearSearch={() => {
                        setIsSearchActive(false);
                        store.catalogStore.resetSearch();
                    }}
                    isSearchActive={isSearchActive}
                    onSearchActiveChange={setIsSearchActive}
                />
                <FilterBar
                    onUndo={() => store.catalogStore.undoSwipe()}
                    undoHighlight={undoButtonHighlight}
                    filters={filters}
                    setFilters={setFilters}
                    catalogStore={store.catalogStore}
                />
                <div className={styles.cardsContainer}>
                    {isInitialLoading && Array(SKELETON_COUNT).fill(0).map((_, i) => (
                        <CustomSkeleton
                            key={`skeleton-${i}`}
                            style={{
                                width: '92vw',
                                height: 'calc(100% - 60px - 2vh)',
                                position: 'absolute',
                                zIndex: SKELETON_COUNT - i,
                                borderRadius: '8px'
                            }}
                        />
                    ))}
                    {!isInitialLoading && store.catalogStore.cards?.length > 0 && store.catalogStore.cards.map((card, index) => (
                        <TinderCard
                            key={card.id}
                            card={card}
                            onSwipe={handleSwipe}
                            updateSwipeFeedback={updateSwipeFeedback}
                            zIndex={store.catalogStore.cards.length - index}
                            offset={index}
                            swipeConfig={SWIPE_CONFIG}
                            isExpanded={expandedCardId === card.id}
                            onExpand={() => setExpandedCardId(card.id)}
                            onCollapse={() => setExpandedCardId(null)}
                            swipeProgress={index === 0 ? swipeProgress : null}
                            isTopCard={index === 0}
                            setCardRef={setCardRef}
                            isOnboardingActive={showOnboarding && index === 0}
                            onSaveClick={handleOpenSaveModal}
                        />
                    ))}
                    {!store.catalogStore.isFetching && store.catalogStore.cards?.length === 0 && (
                        <div className={styles.emptyState}>
                            <div className={styles.notCard}>
                                <p className={styles.notCardText}>Товары из ассортимента брендов закончились</p>
                            </div>
                            <p className={styles.notCardCatText}>Но можно посмотреть подборки</p>
                            <div className={styles.collectionsBlock}>
                                {(store?.popular?.collections || []).map((item) => (
                                    <div
                                        key={`${item.id}`}
                                        className={styles.collectionCard}
                                        onClick={() => navigate(`/trands/collection/${item.id}`)}
                                    >
                                        <img className={styles.collectionImg} src={item.cover_image_url} alt={item.name} />
                                        <p className={styles.collectionTitle}>{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <Sidebar
                    highlightSave={saveHighlight}
                    highlightPopular={popularHighlight}
                    onboarding={!store?.authStore?.data?.preferences?.complete_onboarding}
                />
            </div>

            <Onboarding
                showOnboarding={showOnboarding}
                onboardingStep={onboardingStep}
                setOnboardingStep={setOnboardingStep}
                simulateSwipe={simulateSwipe}
                isAnimating={isAnimating}
                handleSaveChanges={handleSaveChanges}
                undoButtonHighlight={undoButtonHighlight}
                setUndoButtonHighlight={setUndoButtonHighlight}
                saveHighlight={saveHighlight}
                setsaveHighlight={setSaveHighlight}
                popularHighlight={popularHighlight}
                setPopularHighlight={setPopularHighlight}
            />

            <SaveToCollectionModal
                isOpen={isSaveModalOpen}
                onClose={handleCloseSaveModal}
                productId={selectedProduct?.id}
                productName={selectedProduct?.name}
                productInCollection={selectedProduct?.is_contained_in_user_collections}
                onSaveSuccess={(isSaved) => {
                    if (selectedProduct) {
                        handleSaveSuccess(selectedProduct.id, isSaved);
                    }
                }}
            />
        </>
    );
});

export default TinderCards;