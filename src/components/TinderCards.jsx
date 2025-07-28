import { useState, useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './ui/TinderCards.module.css';
import Sidebar from './Sidebar';
import TinderCard from "./TinderCard.jsx";
import { SearchHeader } from "./utils/SearchHeaderMain.jsx";
import { FilterBar } from "./utils/FilterBar.jsx";
import { useStore } from "../provider/StoreContext.jsx";

const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.05;
const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.05;
const ANIMATION_DURATION = 2000;
const INITIAL_CARDS_COUNT = 3;
const SKELETON_COUNT = 3;

const TinderCards = observer(() => {
    const [swipeProgress, setSwipeProgress] = useState({ direction: null, opacity: 0 });
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const store = useStore();
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const containerRef = useRef(null);

    const showOnboarding = !store?.authStore?.data?.preferences?.complete_onboarding;

    useEffect(() => {
        if (showOnboarding) {
            setOnboardingStep(1);
        }
    }, [showOnboarding]);

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

    useEffect(() => {
        if (store?.catalogStore?.cards?.length <= INITIAL_CARDS_COUNT &&
            store.catalogStore.hasMore &&
            !store.catalogStore.isFetching) {
            store.catalogStore.fetchCards();
        }
    }, [store?.catalogStore.cards?.length]);

    const animateSwipe = useCallback((direction, cardId) => {
        const card = document.getElementById(cardId);
        if (!card) return;

        const { innerWidth, innerHeight } = window;
        const rotation = direction === 'right' ? 25 : -25;

        card.style.transition = `all ${ANIMATION_DURATION}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;

        switch(direction) {
            case 'left':
                card.style.transform = `translate(-${innerWidth * 2}px, 0) rotate(${rotation}deg)`;
                break;
            case 'right':
                card.style.transform = `translate(${innerWidth * 2}px, 0) rotate(${rotation}deg)`;
                break;
            case 'up':
                card.style.transform = `translate(0, -${innerHeight * 2}px) rotate(0deg)`;
                break;
            case 'down':
                return;
        }

        card.style.opacity = '0';
    }, []);

    const handleSwipe = useCallback((direction, card) => {
        if (direction === 'down') return;

        animateSwipe(direction, card.id);
        setSwipeProgress({ direction: null, opacity: 0 });

        setTimeout(() => {
            store.catalogStore.handleSwipe(direction, card);
        }, 50);
    }, [animateSwipe, ANIMATION_DURATION]);

    const updateSwipeFeedback = useCallback((dx, dy) => {
        const swipeThreshold = window.innerWidth * HORIZONTAL_SWIPE_THRESHOLD_RATIO;
        const verticalThreshold = window.innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO;

        let direction = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy * 1.5)) {
            direction = dx > 0 ? 'right' : 'left';
            opacity = Math.min(Math.abs(dx) / swipeThreshold, 1);
        } else if (dy < -verticalThreshold) {
            direction = 'up';
            opacity = Math.min(Math.abs(dy) / verticalThreshold, 1);
        }

        setSwipeProgress({ direction, opacity });
    }, []);


    const [undoButtonHighlight, setUndoButtonHighlight] = useState(false);
    const [saveHighlight, setsaveHighlight] = useState(false);
    const [popularHighlight, setPopularHighlight] = useState(false);


    const [isOnboardingActive, setIsOnboardingActive] = useState(false);

    const cardRefs = useRef({});

    const setCardRef = useCallback((id, ref) => {
        if (ref) {
            cardRefs.current[id] = ref;
        } else {
            delete cardRefs.current[id];
        }
    }, []);

    const [isAnimating, setIsAnimating] = useState(false); // Добавляем состояние для отслеживания анимации

    const simulateSwipe = useCallback((direction) => {
        if (!store.catalogStore.cards?.length || isAnimating) return;

        const cardId = store.catalogStore.cards[0].id;
        const cardRef = cardRefs.current[cardId];
        if (!cardRef) return;

        setIsOnboardingActive(true);
        setIsAnimating(true); // Устанавливаем флаг анимации

        const computedStyle = window.getComputedStyle(cardRef);
        const originalStyles = {
            transform: computedStyle.transform,
            transition: computedStyle.transition,
            opacity: computedStyle.opacity,
            zIndex: computedStyle.zIndex
        };

        const params = {
            left: { endX: -window.innerWidth * 0.7, endY: 0, rotation: -15 },
            right: { endX: window.innerWidth * 0.7, endY: 0, rotation: 15 },
            up: { endX: window.innerWidth * 0.5, endY: -window.innerHeight * 0.5, rotation: 5 }
        }[direction];

        // Анимация движения вперед
        cardRef.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out';
        cardRef.style.transform = `translate(${params.endX}px, ${params.endY}px) rotate(${params.rotation}deg)`;
        cardRef.style.zIndex = '10000';

        // Задержка в крайней точке (1 секунда)
        setTimeout(() => {
            // Возврат к исходному положению
            cardRef.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out';
            cardRef.style.transform = originalStyles.transform;
            cardRef.style.opacity = originalStyles.opacity;

            // Восстановление стилей после возврата
            setTimeout(() => {
                cardRef.style.transition = originalStyles.transition;
                cardRef.style.zIndex = originalStyles.zIndex;
                setIsOnboardingActive(false);
                setIsAnimating(false); // Сбрасываем флаг анимации
            }, 500);
        }, 1000);
    }, [store.catalogStore.cards, isAnimating]);

    const handleNextOnboardingStep = () => {
        if (isAnimating) return;
        switch(onboardingStep) {
            case 1:
                setOnboardingStep(2);
                simulateSwipe('left');
                break;
            case 2:
                setOnboardingStep(3);
                simulateSwipe('right');
                break;
            case 3:
                setOnboardingStep(4);
                simulateSwipe('up');
                setUndoButtonHighlight(true);
                break;
            case 4:
                setOnboardingStep(5);
                setUndoButtonHighlight(false);
                setsaveHighlight(true)
                break;
            case 5:
                setOnboardingStep(6);
                setsaveHighlight(false)
                setPopularHighlight(true)
                break;
            case 6:
                setOnboardingStep(0);
                setPopularHighlight(false)
                break;
            default:
                setOnboardingStep(onboardingStep + 1);
        }
    };

    const renderOnboardingStep = () => {
        switch(onboardingStep) {
            case 1:
                return (
                    <>
                        <p className={styles.onboardingText}>
                            Привет! За пару кликов расскажем, как тут все устроено :)
                            Открыть карточку с деталями можно кликнув на нее.
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>
                                1/6
                            </p>
                            <button className={styles.onboardingButton} onClick={handleNextOnboardingStep}>
                                Далее
                            </button>
                        </div>

                    </>
                );
            case 2:
                return (
                    <>
                        <p className={styles.onboardingText}>
                            При свайпе влево карточка пропадает из ленты и подобные стили показываются реже
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>
                                2/6
                            </p>
                            <button className={styles.onboardingButton} onClick={handleNextOnboardingStep}>
                                Далее
                            </button>
                        </div>

                    </>
                );
            case 3:
                return (
                    <>
                        <p className={styles.onboardingText}>
                            При свайпе вправо карточка попадает в подборку и подобные стили показываются чаще
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>
                                3/6
                            </p>
                            <button className={styles.onboardingButton} onClick={handleNextOnboardingStep}>
                                Далее
                            </button>
                        </div>

                    </>
                );
            case 4:
                return (
                    <>
                        <p className={styles.onboardingText}>
                            При свайпе вверх появляетсяновая карточка. Предыдущую можно найти, кликнув на иконку «Назад»
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>
                                4/6
                            </p>
                            <button className={styles.onboardingButton} onClick={handleNextOnboardingStep}>
                                Далее
                            </button>
                        </div>

                    </>
                );
            case 5:
                return (
                    <>
                        <p className={styles.onboardingText}>
                            Здесь можно найти все сохраненные карточки и создать свои подборки
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>
                                5/6
                            </p>
                            <button className={styles.onboardingButton} onClick={handleNextOnboardingStep}>
                                Далее
                            </button>
                        </div>

                    </>
                );
            case 6:
                return (
                    <>
                        <p className={styles.onboardingText}>
                            А тут найти подборки по стилям и направлениям. При нажатии на фото из подборки откроется карточка товара.                         </p>
                        <div className={styles.onboardingBlock}>
                            <p>
                                6/6
                            </p>
                            <button className={styles.onboardingButton} onClick={handleNextOnboardingStep}>
                                Go on
                            </button>
                        </div>

                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>

        <div className={styles.container} style={{ height: `${containerHeight}px` }} ref={containerRef}>
            <SearchHeader
                onSearch={(searchRequest) => {
                    console.log('Search request:', searchRequest);
                    store.catalogStore.fetchCardsWithSearch(searchRequest);
                }}
                onClearSearch={() => store.catalogStore.resetSearch()}
            />
            <FilterBar
                onUndo={store.catalogStore.undoSwipe}
                undoDisabled={store.catalogStore.swipeHistory?.length === 0}
                highlightUndo={undoButtonHighlight}
            />

            <div className={styles.cardsContainer}>
                {store.catalogStore.loading && Array(SKELETON_COUNT).fill(0).map((_, i) => (
                    <div
                        key={`skeleton-${i}`}
                        className={styles.skeleton}
                        style={{ zIndex: SKELETON_COUNT - i }}
                    />
                ))}

                {!store.catalogStore.loading && store?.catalogStore?.cards?.map((card, index) => (
                    <TinderCard
                        key={card._key}
                        card={card}
                        onSwipe={handleSwipe}
                        updateSwipeFeedback={updateSwipeFeedback}
                        zIndex={store.catalogStore.cards.length - index}
                        offset={index}
                        isExpanded={expandedCardId === card.id}
                        onExpand={() => setExpandedCardId(card.id)}
                        onCollapse={() => setExpandedCardId(null)}
                        isPending={card._pending}
                        swipeProgress={index === 0 ? swipeProgress : { direction: null, opacity: 0 }}
                        isTopCard={index === 0}
                        setCardRef={setCardRef}
                        isOnboardingActive={isOnboardingActive && index === 0}
                    />
                ))}

                {!store.catalogStore.loading && store.catalogStore.cards?.length === 0 && (
                    <div className={styles.emptyState}>
                        <h2>No more cards!</h2>
                    </div>
                )}
            </div>
            <Sidebar
                highlightSave={saveHighlight}
                highlightPopular={popularHighlight}
                onboarding ={onboardingStep > 0}

            />
            {showOnboarding && onboardingStep > 0 && (
                <div className={styles.onboardingOverlay}>
                    <div className={styles.onboardingContent}>
                        {renderOnboardingStep()}
                    </div>
                </div>
            )}
        </div>

            </>
    );
});

export default TinderCards;