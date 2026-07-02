import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getBoundedRotation,
    getGestureVelocity,
    getStackedDragTransform,
    getSwipeDirectionFromGesture,
    getSwipeReleaseTransform,
    getViewportSize,
    type DragPosition,
    type Point,
    type SwipeConfig,
    type SwipeDirection,
    type SwipeFeedback,
} from '../../../lib/swipeMotion';
import { UI_ICON_ASSETS } from '../../../lib/assets';
import type { ProductCard } from '../../../types/domain';

import CustomSkeleton from '../../shared/customSkeleton';
import styles from '../../ui/catalog/cards/tinderCard.module.css';

type TinderCardProps = {
    card: ProductCard;
    onSwipe: (direction: SwipeDirection, card: ProductCard) => void;
    updateSwipeFeedback: (dx: number, dy: number) => void;
    zIndex: number;
    offset: number;
    isTopCard: boolean;
    topCardPosition?: Point | null;
    swipeProgress: SwipeFeedback;
    setCardRef: (id: ProductCard['id'], ref: HTMLElement | null) => void;
    isOnboardingActive: boolean;
    swipeConfig: SwipeConfig;
    onSaveClick: (card: ProductCard) => void;
    isDimmed?: boolean;
};

const INITIAL_POSITION: DragPosition = {
    x: 0,
    y: 0,
    rotate: 0,
};

const INITIAL_CARD_STYLE: CSSProperties = {
    transform: 'translate(0,0) rotate(0deg)',
    opacity: 1,
};

const ENTERING_CARD_STYLE: CSSProperties = {
    transform: 'translate(0,20px) rotate(0deg)',
    opacity: 0,
};

const ACTIVE_CARD_STYLE: CSSProperties = {
    transform: 'translate(0,0) rotate(0deg)',
    opacity: 1,
    transition: 'all 300ms ease-out',
};

const RESET_CARD_TRANSFORM = 'translate3d(0, 0, 0) rotate(0deg)';

const applyDomStyle = (
    element: HTMLElement,
    style: CSSProperties | undefined,
) => {
    if (!style) {
        return;
    }

    Object.entries(style).forEach(([styleKey, styleValue]) => {
        if (styleValue == null) {
            return;
        }

        (element.style as unknown as Record<string, string>)[styleKey] = String(styleValue);
    });
};

const TinderCard = ({
    card,
    onSwipe,
    updateSwipeFeedback,
    zIndex,
    offset,
    isTopCard,
    topCardPosition,
    swipeProgress,
    setCardRef,
    isOnboardingActive,
    swipeConfig,
    onSaveClick,
    isDimmed = false,
}: TinderCardProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [localStyle, setLocalStyle] = useState<CSSProperties>(INITIAL_CARD_STYLE);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const likeFeedbackRef = useRef<HTMLDivElement | null>(null);
    const dislikeFeedbackRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationFrame = useRef<number | null>(null);
    const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTime = useRef(0);
    const startPosition = useRef<Point>({ x: 0, y: 0 });
    const currentPosition = useRef<DragPosition>(INITIAL_POSITION);

    const navigate = useNavigate();
    const primaryImageUrl = card.image_urls?.[0] ?? '';
    const displayPrice = card.discount_price ?? card.price;

    useEffect(() => {
        return () => {
            if (animationFrame.current != null) {
                window.cancelAnimationFrame(animationFrame.current);
            }

            if (releaseTimer.current != null) {
                window.clearTimeout(releaseTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!card._pending) {
            return;
        }

        setLocalStyle(ENTERING_CARD_STYLE);

        const animationFrameId = window.requestAnimationFrame(() => {
            setLocalStyle(ACTIVE_CARD_STYLE);
        });

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [card._key, card._pending]);

    useEffect(() => {
        if (cardRef.current) {
            setCardRef(card.id, cardRef.current);
        }

        return () => setCardRef(card.id, null);
    }, [card.id, setCardRef]);

    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.style.zIndex = String(zIndex);
        }
    }, [zIndex]);

    useEffect(() => {
        setImageLoaded(Boolean(imageRef.current?.complete));
    }, [primaryImageUrl]);

    useEffect(() => {
        if (cardRef.current) {
            applyDomStyle(cardRef.current, localStyle);
        }
    }, [localStyle]);

    useEffect(() => {
        if (!cardRef.current) {
            return;
        }

        cardRef.current.style.opacity = isDimmed
            ? '0'
            : String(localStyle.opacity ?? 1);
        cardRef.current.style.pointerEvents = isDimmed ? 'none' : 'auto';
    }, [isDimmed, localStyle.opacity]);

    useEffect(() => {
        if (cardRef.current) {
            applyDomStyle(cardRef.current, card.style);
        }
    }, [card.style]);

    useEffect(() => {
        if (!isTopCard) {
            return;
        }

        if (likeFeedbackRef.current) {
            const isLikeVisible = swipeProgress.direction === 'right';
            likeFeedbackRef.current.style.opacity = isLikeVisible
                ? String(swipeProgress.opacity)
                : '0';
            likeFeedbackRef.current.style.transform =
                `translateY(-50%) scale(${isLikeVisible ? 0.8 + swipeProgress.opacity * 0.4 : 1})`;
        }

        if (dislikeFeedbackRef.current) {
            const isDislikeVisible = swipeProgress.direction === 'left';
            dislikeFeedbackRef.current.style.opacity = isDislikeVisible
                ? String(swipeProgress.opacity)
                : '0';
            dislikeFeedbackRef.current.style.transform =
                `translateY(-50%) scale(${isDislikeVisible ? 0.8 + swipeProgress.opacity * 0.4 : 1})`;
        }
    }, [isTopCard, swipeProgress]);

    const handleStart = (clientX: number, clientY: number) => {
        startPosition.current = { x: clientX, y: clientY };
        startTime.current = Date.now();
        currentPosition.current = INITIAL_POSITION;
        setIsDragging(true);

        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) {
            return;
        }

        if (animationFrame.current != null) {
            window.cancelAnimationFrame(animationFrame.current);
        }

        animationFrame.current = window.requestAnimationFrame(() => {
            const delta = {
                x: clientX - startPosition.current.x,
                y: clientY - startPosition.current.y,
            };
            const rotate = getBoundedRotation(delta.x, swipeConfig);
            currentPosition.current = {
                ...delta,
                rotate,
            };

            if (cardRef.current) {
                cardRef.current.style.transform = getStackedDragTransform({
                    delta,
                    rotate,
                    offset,
                    topCardPosition,
                    viewport: getViewportSize(),
                });
            }

            if (isTopCard) {
                updateSwipeFeedback(delta.x, delta.y);
            }
        });
    };

    const resetPosition = () => {
        if (!cardRef.current) {
            return;
        }

        cardRef.current.style.transition =
            `transform ${swipeConfig.horizontal.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        cardRef.current.style.transform = RESET_CARD_TRANSFORM;

        const onTransitionEnd = () => {
            cardRef.current?.removeEventListener('transitionend', onTransitionEnd);
            currentPosition.current = INITIAL_POSITION;

            if (isTopCard) {
                updateSwipeFeedback(0, 0);
            }
        };

        cardRef.current.addEventListener('transitionend', onTransitionEnd);
    };

    const animateSwipe = (direction: SwipeDirection) => {
        if (!cardRef.current) {
            return;
        }

        cardRef.current.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';
        cardRef.current.style.transform = getSwipeReleaseTransform(direction);

        releaseTimer.current = window.setTimeout(() => {
            onSwipe(direction, card);
        }, 50);
    };

    const handleEnd = () => {
        if (!isDragging) {
            return;
        }

        setIsDragging(false);

        if (animationFrame.current != null) {
            window.cancelAnimationFrame(animationFrame.current);
            animationFrame.current = null;
        }

        const position = currentPosition.current;
        const velocity = getGestureVelocity(
            position,
            Date.now() - startTime.current,
            swipeConfig,
        );
        const direction = getSwipeDirectionFromGesture(
            position,
            velocity,
            getViewportSize(),
            swipeConfig,
        );

        if (direction) {
            animateSwipe(direction);
            return;
        }

        resetPosition();
    };

    return (
        <div
            ref={cardRef}
            id={String(card.id)}
            className={`${styles.card} 
            ${isDragging ? styles.moving : ''} 
            ${isOnboardingActive ? styles['card-onboarding'] : ''}`}
            onTouchStart={(event) => {
                const touch = event.touches[0];

                if (touch) {
                    handleStart(touch.clientX, touch.clientY);
                }
            }}
            onTouchMove={(event) => {
                const touch = event.touches[0];

                if (touch) {
                    handleMove(touch.clientX, touch.clientY);
                }
            }}
            onTouchEnd={handleEnd}
            onMouseDown={(event) => handleStart(event.clientX, event.clientY)}
            onMouseMove={(event) => handleMove(event.clientX, event.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
        >
            <div onClick={() => navigate(`/product/${card.id}`)}>
                {!imageLoaded && (
                    <CustomSkeleton
                        className={styles.cardImageSkeleton}
                    />
                )}
                <img
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    ref={imageRef}
                    data-card-layer
                    className={`${styles.cardImage} tinder-card-image`}
                    src={primaryImageUrl}
                    alt={card.name ?? ''}
                />
            </div>
            <div className={styles.cardOverlay} data-card-layer />

            {isTopCard && (
                <>
                    <div className={`${styles.swipeFeedback} ${styles.swipeFeedbackLeft}`} />
                    <div className={`${styles.swipeFeedback} ${styles.swipeFeedbackRight}`} />
                    <div
                        ref={likeFeedbackRef}
                        className={`${styles.swipeFeedback} ${styles.swipeFeedbackLeft}`}
                    >
                        <img src={UI_ICON_ASSETS.likeDark} alt="Save" className={styles.feedbackIcon} />
                    </div>
                    <div
                        ref={dislikeFeedbackRef}
                        className={`${styles.swipeFeedback} ${styles.swipeFeedbackRight}`}
                    >
                        <img src={UI_ICON_ASSETS.dislikeDark} alt="Close" className={styles.feedbackIcon} />
                    </div>
                </>
            )}
            <div className={styles.cardContent} data-card-layer>
                <div className={styles.cardBottom}>
                    <div className={styles.cardInfo}>
                        <div className={styles.productName}>{card.name}</div>
                        <div className={styles.manufacturer}>{card.brand}</div>
                        <div className={styles.priceRow}>
                            <div className={styles.price}>
                                {displayPrice != null ? `${displayPrice} ₽` : ''}
                            </div>
                            <button
                                type="button"
                                className={styles.saveButton}
                                data-card-layer
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onSaveClick(card);
                                }}
                            >
                                <img
                                    src={card.is_contained_in_user_collections
                                        ? UI_ICON_ASSETS.bookmarkWhiteFilled
                                        : UI_ICON_ASSETS.bookmarkWhite}
                                    alt={card.is_contained_in_user_collections ? 'Сохранено' : 'Сохранить'}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TinderCard;
