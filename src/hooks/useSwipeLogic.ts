import { useCallback, type Dispatch, type SetStateAction } from 'react';
import {
    HORIZONTAL_SWIPE_THRESHOLD_RATIO,
    SWIPE_CONFIG,
    VERTICAL_SWIPE_THRESHOLD_RATIO
} from '../constants';

type SwipeDirection = 'left' | 'right' | 'up' | null;

type SwipeProgress = {
    direction: SwipeDirection;
    opacity: number;
};

type Card = {
    id: number | string;
};

export const useSwipeLogic = (
    animateSwipe: (direction: Exclude<SwipeDirection, null>, cardId: Card['id']) => void,
    setCards: Dispatch<SetStateAction<Card[]>>,
    setBasket: Dispatch<SetStateAction<Card[]>>,
    setSwipeProgress: Dispatch<SetStateAction<SwipeProgress>>,
    setTopCardPosition?: Dispatch<SetStateAction<{ x: number; y: number }>>
) => {
    const handleSwipe = useCallback((direction: Exclude<SwipeDirection, null>, card: Card) => {
        animateSwipe(direction, card.id);

        const animationDuration =
            direction === 'up'
                ? SWIPE_CONFIG.verticalUp.animationDuration
                : SWIPE_CONFIG.horizontal.animationDuration;

        setTimeout(() => {
            setCards((previousCards) => previousCards.filter((currentCard) => currentCard.id !== card.id));

            if (direction === 'up') {
                setBasket((previousBasket) => [...previousBasket, card]);
            }
        }, animationDuration);
    }, [animateSwipe, setBasket, setCards]);

    const updateSwipeFeedback = useCallback((dx: number, dy: number) => {
        const horizontalThreshold = window.innerWidth * HORIZONTAL_SWIPE_THRESHOLD_RATIO;
        const verticalThreshold = window.innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO;

        let direction: SwipeDirection = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy * 1.5)) {
            direction = dx > 0 ? 'right' : 'left';
            opacity = Math.min(Math.abs(dx) / horizontalThreshold, 1);
        } else if (dy < -verticalThreshold) {
            direction = 'up';
            opacity = Math.min(Math.abs(dy) / verticalThreshold, 1);
        }

        setSwipeProgress({ direction, opacity });
        setTopCardPosition?.({ x: dx, y: dy });
    }, [setSwipeProgress, setTopCardPosition]);

    return { handleSwipe, updateSwipeFeedback };
};
