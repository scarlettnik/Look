import { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/providers/storeContext';
import {
    INITIAL_CARDS_COUNT,
    SWIPE_CONFIG,
} from '../../../constants';
import useVisualViewportMetrics from '../../../hooks/useVisualViewportMetrics';
import { apiSendJson } from '../../../lib/apiClient';
import {
    DEFAULT_SWIPE_FEEDBACK,
    getSimulatedSwipeParams,
    getSwipeAnimationDuration,
    getSwipeFeedback,
    getSwipeFlyoutTransform,
    getSwipeInteractionType,
    getViewportSize,
    type SwipeDirection,
    type SwipeFeedback,
    type SwipeGestureDirection,
} from '../../../lib/swipeMotion';
import type { ProductCard } from '../../../types/domain';

import SaveToCollectionModal from '../../collections/saveToCollectionsModal';
import Sidebar from '../../navigation/sidebar';
import { FilterBar } from '../filters/filterBar';
import {
    toLocalCatalogFilters,
    type LocalCatalogFilters,
} from '../filters/filterTypes';
import styles from '../../ui/catalog/cards/tinderCards.module.css';

import CardsEmptyState from './cardsEmptyState';
import CardsStage from './cardsStage';
import { Onboarding } from './onboarding';
import SearchHeaderMain from './searchHeaderMain';

const sendProductInteraction = async (
    productId: ProductCard['id'],
    direction: SwipeDirection,
) => {
    try {
        await apiSendJson(`/v1/interaction/product/${productId}`, 'PUT', {
            interaction_type: getSwipeInteractionType(direction),
        });
    } catch (error) {
        console.error('Error sending interaction:', error);
    }
};

const TinderCards = observer(() => {
    const store = useStore();
    const { authStore, catalogStore, popularStore } = store;
    const currentFilters = catalogStore.getCurrentFilters();

    const [swipeProgress, setSwipeProgress] = useState<SwipeFeedback>(DEFAULT_SWIPE_FEEDBACK);
    const [topCardPosition, setTopCardPosition] = useState({ x: 0, y: 0 });
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [undoButtonHighlight, setUndoButtonHighlight] = useState(false);
    const [saveHighlight, setSaveHighlight] = useState(false);
    const [popularHighlight, setPopularHighlight] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
    const [filters, setFilters] = useState<LocalCatalogFilters>(() => (
        toLocalCatalogFilters(currentFilters)
    ));

    const showOnboarding = authStore.hasLoaded && !authStore.preferences?.complete_onboarding;
    const nonTopSwipeProgress = DEFAULT_SWIPE_FEEDBACK;
    const cardRefs = useRef<Record<string, HTMLElement>>({});
    const cardsRef = useRef<ProductCard[]>(catalogStore.cards || []);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stableViewportHeightRef = useRef(0);
    const viewportMetrics = useVisualViewportMetrics();

    useEffect(() => {
        if (catalogStore.isAddingCards) {
            setSwipeProgress(DEFAULT_SWIPE_FEEDBACK);
            setTopCardPosition({ x: 0, y: 0 });
        }
    }, [catalogStore.isAddingCards]);

    useEffect(() => {
        if (showOnboarding) {
            setOnboardingStep(1);
        }
    }, [showOnboarding]);

    useEffect(() => {
        if (
            catalogStore.cards?.length <= INITIAL_CARDS_COUNT
            && catalogStore.hasMore
            && !catalogStore.isFetching
        ) {
            void catalogStore.fetchCards();
        }
    }, [catalogStore, catalogStore.cards?.length, catalogStore.hasMore, catalogStore.isFetching]);

    useEffect(() => {
        if (authStore.user) {
            void popularStore.fetchPersonalTrends();
        }
    }, [authStore.user, popularStore]);

    useEffect(() => {
        if (catalogStore.cards !== cardsRef.current) {
            setImagesLoaded(false);
            cardsRef.current = catalogStore.cards;
        }

        if (!catalogStore.isLoading && catalogStore.cards?.length > 0 && !imagesLoaded) {
            const imageElements = document.querySelectorAll<HTMLImageElement>('.tinder-card-image');

            if (imageElements.length === 0) {
                setImagesLoaded(true);
                return;
            }

            let loadedCount = 0;
            const handleImageLoad = () => {
                loadedCount += 1;
                if (loadedCount === imageElements.length) {
                    setImagesLoaded(true);
                }
            };

            imageElements.forEach((imageElement) => {
                if (imageElement.complete) {
                    handleImageLoad();
                } else {
                    imageElement.addEventListener('load', handleImageLoad);
                    imageElement.addEventListener('error', handleImageLoad);
                }
            });

            return () => {
                imageElements.forEach((imageElement) => {
                    imageElement.removeEventListener('load', handleImageLoad);
                    imageElement.removeEventListener('error', handleImageLoad);
                });
            };
        }

        return undefined;
    }, [catalogStore.isLoading, catalogStore.cards, imagesLoaded]);

    const syncCardsViewportHeight = useCallback(() => {
        const containerElement = containerRef.current;
        if (!containerElement) {
            return;
        }

        const nextHeight = stableViewportHeightRef.current || viewportMetrics.height || window.innerHeight;
        containerElement.style.setProperty('--cards-viewport-height', `${nextHeight}px`);
    }, [viewportMetrics.height]);

    useEffect(() => {
        if (viewportMetrics.height <= 0) {
            return;
        }

        if (!isSearchActive || stableViewportHeightRef.current === 0) {
            stableViewportHeightRef.current = viewportMetrics.height;
        }

        syncCardsViewportHeight();
    }, [isSearchActive, syncCardsViewportHeight, viewportMetrics.height]);

    const refreshCardsRendering = useCallback(() => {
        const containerElement = containerRef.current;
        const cardElements = Object.values(cardRefs.current);

        if (containerElement) {
            void containerElement.getBoundingClientRect();
            syncCardsViewportHeight();
        }

        cardElements.forEach((cardElement) => {
            const currentTransform = cardElement.style.transform || 'translate3d(0, 0, 0)';
            const currentOpacity = cardElement.style.opacity || '1';

            cardElement.style.willChange = 'transform, opacity';
            cardElement.style.transform = currentTransform;
            cardElement.style.setProperty('-webkit-transform', currentTransform);
            cardElement.style.opacity = currentOpacity;

            cardElement.querySelectorAll<HTMLElement>('[data-card-layer]').forEach((layer) => {
                void layer.getBoundingClientRect();
            });

            void cardElement.offsetHeight;
        });
    }, [syncCardsViewportHeight]);

    useEffect(() => {
        let animationFrameId = 0;
        let restoreTimer = 0;

        const scheduleRefresh = () => {
            animationFrameId = window.requestAnimationFrame(() => {
                refreshCardsRendering();
                restoreTimer = window.setTimeout(refreshCardsRendering, 140);
            });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                scheduleRefresh();
            }
        };

        window.addEventListener('pageshow', scheduleRefresh);
        window.addEventListener('focus', scheduleRefresh);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.clearTimeout(restoreTimer);
            window.removeEventListener('pageshow', scheduleRefresh);
            window.removeEventListener('focus', scheduleRefresh);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refreshCardsRendering]);

    useEffect(() => {
        if (catalogStore.isLoading) {
            return undefined;
        }

        let animationFrameId = 0;
        animationFrameId = window.requestAnimationFrame(() => {
            refreshCardsRendering();
        });

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [catalogStore.isLoading, catalogStore.cards, refreshCardsRendering]);

    const handleSaveSuccess = useCallback((productId: ProductCard['id'], isSaved: boolean) => {
        catalogStore.updateProductCollectionStatus(productId, isSaved);
        popularStore.updateProductCollectionStatus(productId, isSaved);
    }, [catalogStore, popularStore]);

    const handleOpenSaveModal = useCallback((product: ProductCard) => {
        setSelectedProduct(product);
        setIsSaveModalOpen(true);
    }, []);

    const handleCloseSaveModal = useCallback(() => {
        setIsSaveModalOpen(false);
        setSelectedProduct(null);
    }, []);

    const handleSwipe = useCallback((direction: SwipeGestureDirection, card: ProductCard) => {
        if (direction === 'down') {
            return;
        }

        void sendProductInteraction(card.id, direction);

        const duration = getSwipeAnimationDuration(direction);
        const cardElement = document.getElementById(String(card.id));

        if (cardElement) {
            cardElement.style.transition = `transform ${duration}ms linear`;
            cardElement.style.willChange = 'transform';
            cardElement.style.transform = getSwipeFlyoutTransform(
                direction,
                getViewportSize(),
                SWIPE_CONFIG,
            );
        }

        setSwipeProgress(DEFAULT_SWIPE_FEEDBACK);
        setTimeout(() => {
            catalogStore.handleSwipe(direction, card);
        }, duration);
    }, [catalogStore]);

    const updateSwipeFeedback = useCallback((dx: number, dy: number) => {
        setSwipeProgress(getSwipeFeedback(dx, dy, getViewportSize()));
        setTopCardPosition({ x: dx, y: dy });
    }, []);

    const setCardRef = useCallback((id: ProductCard['id'], ref: HTMLElement | null) => {
        const key = String(id);

        if (ref) {
            cardRefs.current[key] = ref;
            return;
        }

        delete cardRefs.current[key];
    }, []);

    const handleSaveChanges = async () => {
        try {
            await authStore.savePreferences({ complete_onboarding: true });
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const simulateSwipe = useCallback((direction: SwipeGestureDirection) => {
        if (!catalogStore.cards?.length || isAnimating) {
            return;
        }

        const cardId = catalogStore.cards[0].id;
        const cardRef = cardRefs.current[String(cardId)];
        if (!cardRef) {
            return;
        }

        setIsAnimating(true);
        const swipeParams = getSimulatedSwipeParams(
            direction,
            getViewportSize(),
            SWIPE_CONFIG,
        );

        const originalTransition = cardRef.style.transition;
        const originalZIndex = cardRef.style.zIndex;
        const originalWillChange = cardRef.style.willChange;

        cardRef.style.transition = `transform ${SWIPE_CONFIG.horizontal.animationDuration}ms ease-out`;
        cardRef.style.willChange = 'transform';
        cardRef.style.transform = `translate3d(${swipeParams.x}px, ${swipeParams.y}px, 0) rotate(${swipeParams.rotation}deg)`;
        cardRef.style.zIndex = '10000';

        setTimeout(() => {
            setIsAnimating(false);
            cardRef.style.transition = originalTransition;
            cardRef.style.zIndex = originalZIndex;
            cardRef.style.willChange = originalWillChange;
        }, SWIPE_CONFIG.horizontal.animationDuration);
    }, [catalogStore.cards, isAnimating]);

    return (
        <>
            <div ref={containerRef} className={styles.container}>
                <div className={styles.topControls}>
                    <SearchHeaderMain
                        isSearchActive={isSearchActive}
                        onSearchActiveChange={setIsSearchActive}
                        onSearch={(searchRequest) => {
                            void catalogStore.fetchCardsWithSearch(searchRequest);
                        }}
                        onClearSearch={() => {
                            void catalogStore.resetSearch();
                        }}
                    />
                    <FilterBar
                        onUndo={() => catalogStore.undoSwipe()}
                        undoHighlight={undoButtonHighlight}
                        filters={filters}
                        setFilters={setFilters}
                        catalogStore={catalogStore}
                    />
                </div>

                <div className={styles.cardsContainer}>
                    <CardsStage
                        cards={catalogStore.cards || []}
                        isLoading={catalogStore.isLoading}
                        swipeConfig={SWIPE_CONFIG}
                        swipeProgress={swipeProgress}
                        nonTopSwipeProgress={nonTopSwipeProgress}
                        topCardPosition={topCardPosition}
                        handleSwipe={handleSwipe}
                        updateSwipeFeedback={updateSwipeFeedback}
                        setCardRef={setCardRef}
                        showOnboarding={showOnboarding}
                        onSaveClick={handleOpenSaveModal}
                    />

                    {!catalogStore.isLoading && catalogStore.cards?.length === 0 && (
                        <CardsEmptyState collections={popularStore.personalTrendCollections} />
                    )}
                </div>

                <Sidebar
                    highlightSave={saveHighlight}
                    highlightPopular={popularHighlight}
                    onboarding={!authStore.preferences?.complete_onboarding}
                />
                <Onboarding
                    showOnboarding={showOnboarding}
                    onboardingStep={onboardingStep}
                    setOnboardingStep={setOnboardingStep}
                    simulateSwipe={simulateSwipe}
                    isAnimating={isAnimating}
                    handleSaveChanges={handleSaveChanges}
                    setUndoButtonHighlight={setUndoButtonHighlight}
                    setSaveHighlight={setSaveHighlight}
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
