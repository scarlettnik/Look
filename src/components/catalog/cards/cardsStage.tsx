import { SKELETON_COUNT, SWIPE_CONFIG } from '../../../constants';
import type {
    Point,
    SwipeFeedback,
    SwipeGestureDirection,
} from '../../../lib/swipeMotion';
import type { ProductCard } from '../../../types/domain';

import CustomSkeleton from '../../shared/customSkeleton';
import styles from '../../ui/catalog/cards/tinderCards.module.css';

import TinderCard from './tinderCard';

type CardsStageProps = {
    cards: ProductCard[];
    isLoading: boolean;
    swipeConfig: typeof SWIPE_CONFIG;
    swipeProgress: SwipeFeedback;
    nonTopSwipeProgress: SwipeFeedback;
    topCardPosition: Point;
    handleSwipe: (direction: SwipeGestureDirection, card: ProductCard) => void;
    updateSwipeFeedback: (dx: number, dy: number) => void;
    setCardRef: (id: ProductCard['id'], ref: HTMLElement | null) => void;
    showOnboarding: boolean;
    onSaveClick: (product: ProductCard) => void;
};

const CardsStage = ({
    cards,
    isLoading,
    swipeConfig,
    swipeProgress,
    nonTopSwipeProgress,
    topCardPosition,
    handleSwipe,
    updateSwipeFeedback,
    setCardRef,
    showOnboarding,
    onSaveClick,
}: CardsStageProps) => {
    if (!isLoading && cards.length === 0) {
        return null;
    }

    return (
        <div className={styles.cardsStage}>
            {isLoading && Array(SKELETON_COUNT).fill(0).map((_, index) => (
                <CustomSkeleton
                    key={`skeleton-${index}`}
                    className={`${styles.cardSkeleton} ${styles[`cardSkeletonLayer${SKELETON_COUNT - index}`] ?? ''}`.trim()}
                />
            ))}

            {!isLoading && cards.map((card, index) => (
                <TinderCard
                    key={card._key}
                    card={card}
                    onSwipe={handleSwipe}
                    updateSwipeFeedback={updateSwipeFeedback}
                    zIndex={10000 - index}
                    offset={index}
                    swipeConfig={swipeConfig}
                    swipeProgress={index === 0 ? swipeProgress : nonTopSwipeProgress}
                    isTopCard={index === 0}
                    setCardRef={setCardRef}
                    isOnboardingActive={showOnboarding && index === 0}
                    onSaveClick={onSaveClick}
                    topCardPosition={index === 0 ? topCardPosition : null}
                />
            ))}
        </div>
    );
};

export default CardsStage;
