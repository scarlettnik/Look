import {
    HORIZONTAL_SWIPE_THRESHOLD_RATIO,
    SWIPE_CONFIG,
    VERTICAL_SWIPE_THRESHOLD_RATIO,
} from '../constants';

export type SwipeConfig = typeof SWIPE_CONFIG;
export type SwipeDirection = 'left' | 'right' | 'up';
export type SwipeGestureDirection = SwipeDirection | 'down';

export type SwipeFeedback = {
    direction: SwipeDirection | null;
    opacity: number;
};

export type Point = {
    x: number;
    y: number;
};

export type DragPosition = Point & {
    rotate: number;
};

export type ViewportSize = {
    width: number;
    height: number;
};

export type SimulatedSwipeParams = Point & {
    rotation: number;
};

export const DEFAULT_SWIPE_FEEDBACK: SwipeFeedback = {
    direction: null,
    opacity: 0,
};

export const getViewportSize = (): ViewportSize => ({
    width: window.innerWidth,
    height: window.innerHeight,
});

const clamp = (value: number, min: number, max: number) => (
    Math.min(Math.max(value, min), max)
);

const safeThreshold = (value: number) => Math.max(value, 1);

export const getSwipeAnimationDuration = (
    direction: SwipeGestureDirection,
    config: SwipeConfig = SWIPE_CONFIG,
) => (
    direction === 'up'
        ? config.verticalUp.animationDuration
        : config.horizontal.animationDuration
);

export const getSwipeInteractionType = (direction: SwipeDirection) => (
    direction === 'right' ? 'like' : 'dislike'
);

export const getSwipeFeedback = (
    dx: number,
    dy: number,
    viewport: ViewportSize,
): SwipeFeedback => {
    const horizontalThreshold = safeThreshold(
        viewport.width * HORIZONTAL_SWIPE_THRESHOLD_RATIO,
    );
    const verticalThreshold = safeThreshold(
        viewport.height * VERTICAL_SWIPE_THRESHOLD_RATIO,
    );

    if (Math.abs(dx) > Math.abs(dy * 1.5)) {
        return {
            direction: dx > 0 ? 'right' : 'left',
            opacity: clamp(Math.abs(dx) / horizontalThreshold, 0, 1),
        };
    }

    if (dy < -verticalThreshold) {
        return {
            direction: 'up',
            opacity: clamp(Math.abs(dy) / verticalThreshold, 0, 1),
        };
    }

    return DEFAULT_SWIPE_FEEDBACK;
};

export const getBoundedRotation = (
    deltaX: number,
    config: SwipeConfig = SWIPE_CONFIG,
) => clamp(
    deltaX * 0.1,
    -config.horizontal.rotationAngle,
    config.horizontal.rotationAngle,
);

export const getGestureVelocity = (
    position: Point,
    deltaTimeMs: number,
    config: SwipeConfig = SWIPE_CONFIG,
): Point => {
    const elapsed = deltaTimeMs || 1;

    return {
        x: (position.x / elapsed)
            * config.physics.power
            * config.horizontal.speedMultiplier,
        y: (position.y / elapsed)
            * config.physics.power
            * (position.y < 0 ? config.verticalUp.speedMultiplier : 0),
    };
};

export const getSwipeDirectionFromGesture = (
    position: Point,
    velocity: Point,
    viewport: ViewportSize,
    config: SwipeConfig = SWIPE_CONFIG,
): SwipeDirection | null => {
    const isHorizontalFast = Math.abs(velocity.x) > config.physics.velocityThreshold;

    if (
        Math.abs(position.x) > viewport.width * config.horizontal.threshold
        || isHorizontalFast
    ) {
        return velocity.x > 0 ? 'right' : 'left';
    }

    if (
        position.y < -viewport.height * config.verticalUp.threshold
        || velocity.y < -config.physics.velocityThreshold
    ) {
        return 'up';
    }

    return null;
};

export const getStackedDragTransform = ({
    delta,
    rotate,
    offset,
    topCardPosition,
    viewport,
}: {
    delta: Point;
    rotate: number;
    offset: number;
    topCardPosition?: Point | null;
    viewport: ViewportSize;
}) => {
    let scale = 1 - Math.max(0, offset) * 0.03;
    let translateY = 0;
    let translateX = 0;

    if (offset > 0 && topCardPosition) {
        const progress = clamp(
            Math.max(
                Math.abs(topCardPosition.x) / safeThreshold(viewport.width * 0.5),
                Math.abs(topCardPosition.y) / safeThreshold(viewport.height * 0.5),
            ),
            0,
            1,
        );
        const influenceFactor = 1 - (offset - 1) * 0.3;

        if (influenceFactor > 0) {
            scale += 0.03 * progress * influenceFactor;
            translateY += -5 * progress * influenceFactor;

            if (topCardPosition.x !== 0) {
                const direction = topCardPosition.x > 0 ? 1 : -1;
                translateX = direction * 5 * progress * influenceFactor;
            }
        }
    }

    return `translate3d(${delta.x + translateX}px, ${delta.y + translateY}px, 0) rotate(${rotate}deg) scale(${scale})`;
};

export const getSwipeReleaseTransform = (direction: SwipeDirection) => {
    switch (direction) {
        case 'left':
            return 'translate3d(-100vw, 0, 0) rotate(-30deg)';
        case 'right':
            return 'translate3d(100vw, 0, 0) rotate(30deg)';
        case 'up':
            return 'translate3d(0, -100vh, 0)';
        default:
            return 'translate3d(0, 0, 0) rotate(0deg)';
    }
};

export const getSwipeFlyoutTransform = (
    direction: SwipeDirection,
    viewport: ViewportSize,
    config: SwipeConfig = SWIPE_CONFIG,
) => {
    const rotation = direction === 'right'
        ? config.horizontal.rotationAngle
        : -config.horizontal.rotationAngle;

    switch (direction) {
        case 'left':
            return `translate3d(-${viewport.width * 2}px, 0, 0) rotate(${rotation}deg)`;
        case 'right':
            return `translate3d(${viewport.width * 2}px, 0, 0) rotate(${rotation}deg)`;
        case 'up':
            return `translate3d(0, -${viewport.height * 2}px, 0) rotate(0deg)`;
        default:
            return 'translate3d(0, 0, 0) rotate(0deg)';
    }
};

export const getSimulatedSwipeParams = (
    direction: SwipeGestureDirection,
    viewport: ViewportSize,
    config: SwipeConfig = SWIPE_CONFIG,
): SimulatedSwipeParams => {
    const params: Record<SwipeGestureDirection, SimulatedSwipeParams> = {
        left: {
            x: -viewport.width * 0.7,
            y: 0,
            rotation: -config.horizontal.rotationAngle,
        },
        right: {
            x: viewport.width * 0.7,
            y: 0,
            rotation: config.horizontal.rotationAngle,
        },
        up: {
            x: viewport.width * 0.3,
            y: -viewport.height * 0.4,
            rotation: 5,
        },
        down: {
            x: 0,
            y: 0,
            rotation: 0,
        },
    };

    return params[direction];
};
