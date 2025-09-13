import { useState, useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './ui/TinderCards.module.css';
import Sidebar from './Sidebar';
import TinderCard from "./TinderCard.jsx";
import { FilterBar } from "./FilterBar.jsx";
import { useStore } from "../provider/StoreContext.jsx";
import {
    AUTH_TOKEN,
    INITIAL_CARDS_COUNT,
    SKELETON_COUNT,
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
    const [swipeProgress, setSwipeProgress] = useState({ direction: null, opacity: 0 });
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const store = useStore();
    const [containerHeight, setContainerHeight] = useState('100vh');
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const showOnboarding = !store?.authStore?.data?.preferences?.complete_onboarding;
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
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [undoButtonHighlight, setUndoButtonHighlight] = useState(false);
    const [saveHighlight, setSaveHighlight] = useState(false);
    const [popularHighlight, setPopularHighlight] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const cardRefs = useRef({});

    // Инициализация компонента
    useEffect(() => {
        const initializeComponent = async () => {
            // Установка высоты контейнера
            const setHeight = () => {
                const height = window.innerHeight;
                setContainerHeight(height);
                if (containerRef.current) {
                    containerRef.current.style.height = `${height}px`;
                }
            };

            setHeight();
            window.addEventListener('resize', setHeight);

            // Загрузка начальных данных
            if (store?.catalogStore?.cards?.length <= INITIAL_CARDS_COUNT &&
                store.catalogStore.hasMore &&
                !store.catalogStore.isFetching) {
                await store.catalogStore.fetchCards();
            }

            if (store?.authStore.data) {
                await store.popular.fetchCollections();
            }

            setIsInitialized(true);

            return () => {
                window.removeEventListener('resize', setHeight);
            };
        };

        initializeComponent();
    }, []);

    // Отслеживание состояния поиска
    useEffect(() => {
        setIsSearchActive(store?.catalogStore?.isSearching || false);
    }, [store?.catalogStore?.isSearching, store?.catalogStore?.currentSearchQuery]);

    // Обработчик успешного сохранения
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

    // Инициализация onboarding
    useEffect(() => {
        if (showOnboarding) {
            setOnboardingStep(1);
        }
    }, [showOnboarding]);

    // Модальное окно сохранения
    const handleOpenSaveModal = useCallback((product) => {
        setSelectedProduct(product);
        setIsSaveModalOpen(true);
    }, []);

    const handleCloseSaveModal = useCallback(() => {
        setIsSaveModalOpen(false);
        setSelectedProduct(null);
    }, []);

    // Отправка взаимодействия
    const sendInteraction = async (productId, action) => {
        try {
            await fetch(`https://api.lookvogue.ru/v1/interaction/product/${productId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `tma ${AUTH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    interaction_type: action
                })
            });
        } catch (error) {
            console.error('Error sending interaction:', error);
        }
    };

    // Обработка свайпа
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

            switch(direction) {
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
        }, duration/2);
    }, [store.catalogStore]);

    // Обновление feedback свайпа
    const updateSwipeFeedback = useCallback((dx, dy) => {
        const verticalThreshold = window.innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO;

        let direction = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy * 1.5)) {
            direction = dx > 0 ? 'right' : 'left';
            opacity = Math.min(1);
        } else if (dy < -verticalThreshold) {
            direction = 'up';
            opacity = Math.min(1);
        }

        setSwipeProgress({ direction, opacity });
        setTopCardPosition({ x: dx, y: dy });
    }, []);

    // Установка ref для карточек
    const setCardRef = useCallback((id, ref) => {
        if (ref) {
            cardRefs.current[id] = ref;
        } else {
            delete cardRefs.current[id];
        }
    }, []);

    // Завершение onboarding
    const handleSaveChanges = async () => {
        try {
            const response = await fetch('https://api.lookvogue.ru/v1/user', {
                method: 'PATCH',
                headers: {
                    "Authorization": `tma ${AUTH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    preferences: {
                        complete_onboarding: true
                    }
                })
            });

            if (response.ok) {
                runInAction(() => {
                    if (store.authStore.data) {
                        store.authStore.data.preferences = {
                            ...store.authStore.data.preferences,
                            complete_onboarding: true
                        };
                    }
                });
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    // Симуляция свайпа для onboarding
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

        cardRef.style.transition = 'transform 800ms ease-out';
        cardRef.style.willChange = 'transform';
        cardRef.style.transform = `translate3d(${params.endX}px, ${params.endY}px, 0) rotate(${params.rotation}deg)`;
        cardRef.style.zIndex = '10000';

        setTimeout(() => {
            cardRef.style.transition = 'transform 300ms ease-out';
            cardRef.style.transform = originalStyles.transform;

            setTimeout(() => {
                Object.assign(cardRef.style, originalStyles);
                setIsAnimating(false);
            }, 300);
        }, 800);
    }, [store.catalogStore.cards, isAnimating]);

    // Рендеринг карточек
    const renderCards = () => {
        if (store.catalogStore.loading || !isInitialized) {
            return Array(SKELETON_COUNT).fill(0).map((_, i) => (
                <CustomSkeleton
                    key={`skeleton-${i}`}
                    style={{
                        width: '92vw',
                        height: 'calc(100% - 80px - 2vh)',
                        position: 'absolute',
                        zIndex: SKELETON_COUNT - i,
                        borderRadius: '8px'
                    }}
                />
            ));
        }

        if (isSearchActive) {
            return Array(SKELETON_COUNT).fill(0).map((_, i) => (
                <CustomSkeleton
                    key={`search-skeleton-${i}`}
                    style={{
                        width: '92vw',
                        height: 'calc(100% - 80px - 2vh)',
                        position: 'absolute',
                        zIndex: SKELETON_COUNT - i,
                        borderRadius: '8px',
                        opacity: 0.7
                    }}
                />
            ));
        }

        if (store.catalogStore.cards?.length === 0) {
            return (
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
                                <img
                                    className={styles.collectionImg}
                                    src={item.cover_image_url}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                                <p className={styles.collectionTitle}>{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return store.catalogStore.cards.map((card, index) => (
            <TinderCard
                key={card.id || card._key || `card-${index}`}
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
                swipeProgress={index === 0 ? swipeProgress : {direction: null, opacity: 0}}
                isTopCard={index === 0}
                setCardRef={setCardRef}
                isOnboardingActive={showOnboarding && index === 0}
                onSaveClick={handleOpenSaveModal}
                topCardPosition={index === 0 ? topCardPosition : null}
            />
        ));
    };

    return (
        <>
            <div
                className={styles.container}
                style={{ height: containerHeight, overflow: 'hidden' }}
                ref={containerRef}
            >
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
                    onUndo={() => {
                        store.catalogStore.undoSwipe();
                    }}
                    undoHighlight={undoButtonHighlight}
                    filters={filters}
                    setFilters={setFilters}
                    catalogStore={store.catalogStore}
                />

                <div className={styles.cardsContainer}>
                    {renderCards()}
                </div>

                <Sidebar
                    highlightSave={saveHighlight}
                    highlightPopular={popularHighlight}
                    onboarding={!store?.authStore?.data?.preferences?.complete_onboarding}
                />

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
                    setSaveHighlight={setSaveHighlight}
                    popularHighlight={popularHighlight}
                    setPopularHighlight={setPopularHighlight}
                />
            </div>

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