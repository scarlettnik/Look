import { act, renderHook } from '@testing-library/react';

import { useSwipeLogic } from '../useSwipeLogic';

jest.mock('../../constants', () => ({
  HORIZONTAL_SWIPE_THRESHOLD_RATIO: 0.2,
  VERTICAL_SWIPE_THRESHOLD_RATIO: 0.2,
  SWIPE_CONFIG: {
    horizontal: {
      animationDuration: 800,
    },
    verticalUp: {
      animationDuration: 1500,
    },
  },
}));

describe('useSwipeLogic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('animates an upward swipe and moves the card to the basket after animation', () => {
    const card = { id: 1 };
    let cards = [card, { id: 2 }];
    let basket: typeof cards = [];

    const animateSwipe = jest.fn();
    const setCards = jest.fn((updater) => {
      cards = updater(cards);
    });
    const setBasket = jest.fn((updater) => {
      basket = updater(basket);
    });
    const setSwipeProgress = jest.fn();

    const { result } = renderHook(() =>
      useSwipeLogic(animateSwipe, setCards, setBasket, setSwipeProgress),
    );

    act(() => {
      result.current.handleSwipe('up', card);
    });

    expect(animateSwipe).toHaveBeenCalledWith('up', 1);
    expect(cards).toHaveLength(2);

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(cards).toEqual([{ id: 2 }]);
    expect(basket).toEqual([card]);
  });

  it('reports horizontal and vertical swipe feedback with capped opacity', () => {
    const setSwipeProgress = jest.fn();
    const setTopCardPosition = jest.fn();

    const { result } = renderHook(() =>
      useSwipeLogic(
        jest.fn(),
        jest.fn(),
        jest.fn(),
        setSwipeProgress,
        setTopCardPosition,
      ),
    );

    act(() => {
      result.current.updateSwipeFeedback(300, 20);
    });

    expect(setSwipeProgress).toHaveBeenLastCalledWith({
      direction: 'right',
      opacity: 1,
    });
    expect(setTopCardPosition).toHaveBeenLastCalledWith({ x: 300, y: 20 });

    act(() => {
      result.current.updateSwipeFeedback(10, -240);
    });

    expect(setSwipeProgress).toHaveBeenLastCalledWith({
      direction: 'up',
      opacity: 1,
    });
  });
});
