import {
  getBoundedRotation,
  getGestureVelocity,
  getSimulatedSwipeParams,
  getStackedDragTransform,
  getSwipeAnimationDuration,
  getSwipeDirectionFromGesture,
  getSwipeFeedback,
  getSwipeFlyoutTransform,
  getSwipeInteractionType,
} from '../swipeMotion';

jest.mock('../../constants', () => ({
  HORIZONTAL_SWIPE_THRESHOLD_RATIO: 0.2,
  VERTICAL_SWIPE_THRESHOLD_RATIO: 0.2,
  SWIPE_CONFIG: {
    horizontal: {
      threshold: 0.15,
      speedMultiplier: 0.8,
      rotationAngle: 15,
      animationDuration: 800,
    },
    verticalUp: {
      threshold: 0.1,
      speedMultiplier: 1.2,
      animationDuration: 1500,
    },
    verticalDown: {
      threshold: 1000000000000000000,
      speedMultiplier: 0.2,
      animationDuration: 5000,
    },
    physics: {
      velocityThreshold: 0.9,
      power: 0.2,
      deceleration: 0.95,
    },
  },
}));

const viewport = {
  width: 1000,
  height: 800,
};

describe('swipeMotion', () => {
  it('calculates progressive swipe feedback from viewport thresholds', () => {
    expect(getSwipeFeedback(100, 10, viewport)).toEqual({
      direction: 'right',
      opacity: 0.5,
    });

    expect(getSwipeFeedback(-300, 20, viewport)).toEqual({
      direction: 'left',
      opacity: 1,
    });

    expect(getSwipeFeedback(10, -240, viewport)).toEqual({
      direction: 'up',
      opacity: 1,
    });

    expect(getSwipeFeedback(10, -80, viewport)).toEqual({
      direction: null,
      opacity: 0,
    });
  });

  it('resolves release direction from drag distance and velocity', () => {
    expect(
      getSwipeDirectionFromGesture(
        { x: 180, y: 0 },
        { x: 0.1, y: 0 },
        viewport,
      ),
    ).toBe('right');

    expect(
      getSwipeDirectionFromGesture(
        { x: 0, y: -120 },
        { x: 0, y: -0.1 },
        viewport,
      ),
    ).toBe('up');

    expect(
      getSwipeDirectionFromGesture(
        { x: 20, y: 20 },
        { x: 0.1, y: 0 },
        viewport,
      ),
    ).toBeNull();
  });

  it('keeps animation and interaction policy in one place', () => {
    expect(getSwipeAnimationDuration('up')).toBe(1500);
    expect(getSwipeAnimationDuration('left')).toBe(800);
    expect(getSwipeInteractionType('right')).toBe('like');
    expect(getSwipeInteractionType('up')).toBe('dislike');
  });

  it('builds transforms for drag, release, and onboarding simulation', () => {
    expect(getBoundedRotation(500)).toBe(15);
    expect(getGestureVelocity({ x: 100, y: -100 }, 100)).toEqual({
      x: 0.16000000000000003,
      y: -0.24,
    });
    expect(
      getStackedDragTransform({
        delta: { x: 20, y: 10 },
        rotate: 5,
        offset: 1,
        topCardPosition: { x: 250, y: 0 },
        viewport,
      }),
    ).toBe('translate3d(22.5px, 7.5px, 0) rotate(5deg) scale(0.985)');
    expect(getSwipeFlyoutTransform('right', viewport)).toBe(
      'translate3d(2000px, 0, 0) rotate(15deg)',
    );
    expect(getSimulatedSwipeParams('up', viewport)).toEqual({
      x: 300,
      y: -320,
      rotation: 5,
    });
  });
});
