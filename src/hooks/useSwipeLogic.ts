import {
    useCallback,
    type Dispatch,
    type SetStateAction,
} from 'react';

import {
    getSwipeAnimationDuration,
    getSwipeFeedback,
    getViewportSize,
    type SwipeDirection,
    type SwipeFeedback,
} from '../lib/swipeMotion';

type Card = {
    id: number | string;
};

export const useSwipeLogic = (
    animateSwipe: (direction: SwipeDirection, cardId: Card['id']) => void,
    setCards: Dispatch<SetStateAction<Card[]>>,
    setBasket: Dispatch<SetStateAction<Card[]>>,
    setSwipeProgress: Dispatch<SetStateAction<SwipeFeedback>>,
    setTopCardPosition?: Dispatch<SetStateAction<{ x: number; y: number }>>
) => {
    const handleSwipe = useCallback((direction: SwipeDirection, card: Card) => {
        animateSwipe(direction, card.id);

        setTimeout(() => {
            setCards((previousCards) => previousCards.filter((currentCard) => currentCard.id !== card.id));

            if (direction === 'up') {
                setBasket((previousBasket) => [...previousBasket, card]);
            }
        }, getSwipeAnimationDuration(direction));
    }, [animateSwipe, setBasket, setCards]);

    const updateSwipeFeedback = useCallback((dx: number, dy: number) => {
        setSwipeProgress(getSwipeFeedback(dx, dy, getViewportSize()));
        setTopCardPosition?.({ x: dx, y: dy });
    }, [setSwipeProgress, setTopCardPosition]);

    return { handleSwipe, updateSwipeFeedback };
};
