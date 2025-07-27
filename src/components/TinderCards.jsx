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
    const store = useStore();
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const containerRef = useRef(null);

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

        card.classList.add('swiping-out');

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

    return (
        <div className={styles.container} style={{ height: `${containerHeight}px` }} ref={containerRef}>
            <SearchHeader
                onSearch={(searchRequest) => {
                    console.log('Search request:', searchRequest);
                    store.catalogStore.fetchCardsWithSearch(searchRequest);
                }}
                onClearSearch={() => store.catalogStore.resetSearch()}

            />            <FilterBar
                onUndo={store.catalogStore.undoSwipe}
                undoDisabled={store.catalogStore.swipeHistory?.length === 0}
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
                    />
                ))}


                {!store.catalogStore.loading && store.catalogStore.cards?.length === 0 && (
                    <div className={styles.emptyState}>
                        <h2>No more cards!</h2>
                    </div>
                )}
            </div>
            <Sidebar/>
        </div>
    );
});

export default TinderCards;