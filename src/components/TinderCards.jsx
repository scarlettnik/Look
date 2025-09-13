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
    SWIPE_CONFIG,
    VERTICAL_SWIPE_THRESHOLD_RATIO
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

// --- Onboarding state ---
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(true); // по умолчанию показываем
    const [onboardingStep, setOnboardingStep] = useState(1);

    useEffect(() => {
        const complete = store?.authStore?.data?.preferences?.complete_onboarding;

        if (complete === false) {
            setIsOnboardingVisible(true);
            setOnboardingStep(1);
        } else if (complete === true) {
            setIsOnboardingVisible(false);
            setOnboardingStep(0);
        }
        // если complete === undefined → оставляем true (будет показываться)
    }, [store?.authStore?.data?.preferences?.complete_onboarding]);console.log("Onboarding visible:", isOnboardingVisible, store?.authStore?.data?.preferences?.complete_onboarding);


    console.log("Onboarding visible:", isOnboardingVisible, store?.authStore?.data?.preferences?.complete_onboarding);



    // --- UI state ---
    const [swipeProgress, setSwipeProgress] = useState({ direction: null, opacity: 0 });
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const containerRef = useRef(null);
    const [topCardPosition, setTopCardPosition] = useState({ x: 0, y: 0 });

    const [filters, setFilters] = useState(() => ({
        size: store?.catalogStore?.getCurrentFilters().sizes || [],
        brand: store?.catalogStore?.getCurrentFilters().brands || [],
        price: {
            min: store?.catalogStore?.getCurrentFilters().min_price || null,
            max: store?.catalogStore?.getCurrentFilters().max_price || null
        },
        type: store?.catalogStore?.getCurrentFilters().categories || []
    }));
    const [isSearchActive, setIsSearchActive] = useState(false);

    // --- Handle search state ---
    useEffect(() => {
        setIsSearchActive(store?.catalogStore?.isSearching || false);
    }, [store?.catalogStore?.isSearching, store?.catalogStore?.currentSearchQuery]);

    // --- Save modal ---
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
            store.popular.popular.forEach(item => {
                if (item.products) {
                    const product = item.products.find(p => p.id === productId);
                    if (product) {
                        product.is_contained_in_user_collections = isSaved;
                    }
                }
            });
        });
    }, [store]);

    // --- Resize handling ---
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const initialHeight = containerRef.current.getBoundingClientRect().height;
                setContainerHeight(initialHeight);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Auto fetch more cards ---
    useEffect(() => {
        if (store?.catalogStore?.cards?.length <= INITIAL_CARDS_COUNT &&
            store.catalogStore.hasMore &&
            !store.catalogStore.isFetching) {
            store.catalogStore.fetchCards();
        }
    }, [store?.catalogStore.cards?.length]);

    // --- Fetch collections ---
    useEffect(() => {
        if (store?.authStore.data) {
            store.popular.fetchCollections();
        }
    }, [store?.authStore.data]);

    // --- API interaction ---
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

    // --- Swipe handling ---
    const handleSwipe = useCallback((direction, card) => {
        if (direction === 'down') return;

        const action = direction === 'right' ? 'like' : 'dislike';
        sendInteraction(card.id, action);

        const duration = direction === 'up'
            ? SWIPE_CONFIG.verticalUp.animationDuration
            : SWIPE_CONFIG.horizontal.animationDuration;

        const cardElement = document.getElementById(card.id);
        if (cardElement) {
            const rotation = direction === 'right'
                ? SWIPE_CONFIG.horizontal.rotationAngle
                : -SWIPE_CONFIG.horizontal.rotationAngle;

            cardElement.style.transition = `transform ${duration}ms linear`;
            cardElement.style.willChange = 'transform';

            switch (direction) {
                case 'left':
                    cardElement.style.transform = `translate3d(-${window.innerWidth * 2}px, 0, 0) rotate(${rotation}deg)`;
                    break;
                case 'right':
                    cardElement.style.transform = `translate3d(${window.innerWidth * 2}px, 0, 0) rotate(${rotation}deg)`;
                    break;
                case 'up':
                    cardElement.style.transform = `translate3d(0, -${window.innerHeight * 2}px, 0) rotate(0deg)`;
                    break;
            }
        }

        setSwipeProgress({ direction: null, opacity: 0 });
        setTimeout(() => {
            store.catalogStore.handleSwipe(direction, card);
        }, duration / 2);
    }, [SWIPE_CONFIG, store.catalogStore]);

    const updateSwipeFeedback = useCallback((dx, dy) => {
        const verticalThreshold = window.innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO;
        let direction = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy * 1.5)) {
            direction = dx > 0 ? 'right' : 'left';
            opacity = 1;
        } else if (dy < -verticalThreshold) {
            direction = 'up';
            opacity = 1;
        }

        setSwipeProgress({ direction, opacity });
        setTopCardPosition({ x: dx, y: dy });
    }, []);

    // --- Onboarding swipe simulation ---
    const [undoButtonHighlight, setUndoButtonHighlight] = useState(false);
    const [saveHighlight, setsaveHighlight] = useState(false);
    const [popularHighlight, setPopularHighlight] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const cardRefs = useRef({});

    const setCardRef = useCallback((id, ref) => {
        if (ref) cardRefs.current[id] = ref;
        else delete cardRefs.current[id];
    }, []);

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

    // --- Ensure images loaded ---
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const cardsRef = useRef(store?.catalogStore?.cards || []);

    useEffect(() => {
        if (store?.catalogStore?.cards !== cardsRef.current) {
            setImagesLoaded(false);
            cardsRef.current = store?.catalogStore?.cards;
        }

        if (!store.catalogStore.loading && store?.catalogStore?.cards?.length > 0 && !imagesLoaded) {
            const imageElements = document.querySelectorAll('.tinder-card-image');
            if (imageElements.length === 0) {
                setImagesLoaded(true);
                return;
            }

            let loadedCount = 0;
            const handleImageLoad = () => {
                loadedCount++;
                if (loadedCount === imageElements.length) setImagesLoaded(true);
            };

            imageElements.forEach(img => {
                if (img.complete) handleImageLoad();
                else {
                    img.addEventListener('load', handleImageLoad);
                    img.addEventListener('error', handleImageLoad);
                }
            });

            return () => {
                imageElements.forEach(img => {
                    img.removeEventListener('load', handleImageLoad);
                    img.removeEventListener('error', handleImageLoad);
                });
            };
        }
    }, [store.catalogStore.loading, store?.catalogStore?.cards, imagesLoaded]);

    return (
        <>
            <div className={styles.container} style={{ height: `${containerHeight}px` }} ref={containerRef}>
                <SearchHeaderMain
                    onSearch={(searchRequest) => {
                        store.catalogStore.fetchCardsWithSearch(searchRequest);
                        setIsSearchActive(true);
                    }}
                    onClearSearch={() => {
                        store.catalogStore.resetSearch();
                        setIsSearchActive(false);
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
                    {(store.catalogStore.loading || isSearchActive) && Array(SKELETON_COUNT).fill(0).map((_, i) => (
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

                    {!store.catalogStore.loading && !isSearchActive && store?.catalogStore?.cards?.map((card, index) => (
                        <TinderCard
                            key={card._key}
                            card={card}
                            onSwipe={handleSwipe}
                            updateSwipeFeedback={updateSwipeFeedback}
                            zIndex={10000 - index}
                            offset={index}
                            swipeConfig={SWIPE_CONFIG}
                            isExpanded={expandedCardId === card.id}
                            onExpand={() => setExpandedCardId(card.id)}
                            onCollapse={() => setExpandedCardId(null)}
                            isPending={card._pending}
                            swipeProgress={index === 0 ? swipeProgress : { direction: null, opacity: 0 }}
                            isTopCard={index === 0}
                            setCardRef={setCardRef}
                            isOnboardingActive={isOnboardingVisible && index === 0}
                            onSaveClick={handleOpenSaveModal}
                            topCardPosition={index === 0 ? null : topCardPosition}
                            style={isSearchActive ? { opacity: 0, pointerEvents: 'none' } : {}}
                        />
                    ))}

                    {!store.catalogStore.loading && store.catalogStore.cards?.length === 0 && (
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
                    onboarding={isOnboardingVisible}
                />

                {isOnboardingVisible && (
                    <Onboarding
                        onboardingStep={onboardingStep}
                        setOnboardingStep={setOnboardingStep}
                        simulateSwipe={simulateSwipe}
                        isAnimating={isAnimating}
                        handleSaveChanges={() => {
                            fetch('https://api.lookvogue.ru/v1/user', {
                                method: 'PATCH',
                                headers: {
                                    "Authorization": `tma ${AUTH_TOKEN}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    preferences: { complete_onboarding: true }
                                })
                            }).then(() => {
                                runInAction(() => {
                                    if (store.authStore.data) {
                                        store.authStore.data.preferences = {
                                            ...store.authStore.data.preferences,
                                            complete_onboarding: true
                                        };
                                    }
                                });
                            });
                        }}
                        undoButtonHighlight={undoButtonHighlight}
                        setUndoButtonHighlight={setUndoButtonHighlight}
                        saveHighlight={saveHighlight}
                        setsaveHighlight={setsaveHighlight}
                        popularHighlight={popularHighlight}
                        setPopularHighlight={setPopularHighlight}
                    />
                )}
            </div>

            <SaveToCollectionModal
                isOpen={isSaveModalOpen}
                onClose={handleCloseSaveModal}
                productId={selectedProduct?.id}
                productName={selectedProduct?.name}
                productInCollection={selectedProduct?.is_contained_in_user_collections}
                onSaveSuccess={(isSaved) => {
                    if (selectedProduct) handleSaveSuccess(selectedProduct.id, isSaved);
                }}
            />
        </>
    );
});

export default TinderCards;
