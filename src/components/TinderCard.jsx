import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ui/TinderCard.module.css';
import CustomSkeleton from "./utils/CustomSkeleton.jsx";

const TinderCard = ({
                        card,
                        onSwipe,
                        updateSwipeFeedback,
                        zIndex,
                        offset,
                        isTopCard,
                        swipeProgress,
                        swipeConfig,
                        setCardRef,
                        isOnboardingActive,
                        onSaveClick,
                    }) => {
    const cardRef = useRef(null);
    const navigate = useNavigate();

    // НОВОЕ: Состояние для управления видимостью карточки
    const [isReady, setIsReady] = useState(false);

    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const position = useRef({ x: 0, y: 0 });
    const animationFrame = useRef(null);

    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (cardRef.current) setCardRef(card.id, cardRef.current);
        return () => setCardRef(card.id, null);
    }, [card.id, setCardRef]);

    useEffect(() => {
        if (!cardRef.current) return;

        // Отключаем JS-анимацию на время "расстановки" карточек
        cardRef.current.style.transition = 'none';

        if (isTopCard) {
            // Устанавливаем верхнюю карту в центр
            cardRef.current.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        } else {
            // Остальные карты смещаем для эффекта стопки
            cardRef.current.style.transform = `translateY(${offset * 5}px) scale(${1 - offset * 0.03})`;
        }

        // НОВОЕ: После того как все стили применились, делаем карточку видимой
        // requestAnimationFrame гарантирует, что это произойдет после того, как браузер обработает стили выше
        requestAnimationFrame(() => {
            setIsReady(true);
        });

    }, [zIndex, offset, isTopCard]);

    const handleMove = useCallback((clientX, clientY) => {
        if (!isDragging.current || !isTopCard) return;

        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = requestAnimationFrame(() => {
            const deltaX = clientX - startPos.current.x;
            const deltaY = clientY - startPos.current.y;
            position.current = { x: deltaX, y: deltaY };
            const rotate = deltaX * 0.1;

            if (cardRef.current) {
                cardRef.current.style.willChange = 'transform';
                cardRef.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${rotate}deg)`;
            }
            updateSwipeFeedback(deltaX, deltaY);
        });
    }, [isTopCard, updateSwipeFeedback]);

    const handleEnd = useCallback(() => {
        if (!isDragging.current || !isTopCard) return;
        isDragging.current = false;
        if (cardRef.current) cardRef.current.style.willChange = 'auto';

        const { x, y } = position.current;
        const { innerWidth, innerHeight } = window;
        let direction = null;

        if (Math.abs(x) > innerWidth * swipeConfig.horizontal.threshold) {
            direction = x > 0 ? 'right' : 'left';
        } else if (y < -innerHeight * swipeConfig.verticalUp.threshold) {
            direction = 'up';
        }

        if (direction) {
            animateAndFinalizeSwipe(direction);
        } else {
            resetPosition();
        }
    }, [isTopCard, swipeConfig, onSwipe, card]);

    const handleStart = useCallback((clientX, clientY) => {
        if (!isTopCard) return;
        isDragging.current = true;
        startPos.current = { x: clientX, y: clientY };
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    }, [isTopCard]);

    const animateAndFinalizeSwipe = (direction) => {
        if (!cardRef.current) return;
        const { innerWidth, innerHeight } = window;
        let endX = 0, endY = 0, rotation = 0;
        const duration = 300;

        switch (direction) {
            case 'left': endX = -innerWidth; rotation = -20; break;
            case 'right': endX = innerWidth; rotation = 20; break;
            case 'up': endY = -innerHeight; break;
            default: break;
        }

        cardRef.current.style.transition = `transform ${duration}ms ease-out`;
        cardRef.current.style.transform = `translate3d(${endX}px, ${endY}px, 0) rotate(${rotation}deg)`;

        setTimeout(() => onSwipe(direction, card), duration);
    };

    const resetPosition = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transition = `transform 300ms cubic-bezier(0.23, 1, 0.32, 1)`;
        cardRef.current.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        updateSwipeFeedback(0, 0);
    };

    useEffect(() => {
        const currentCard = cardRef.current;
        if (!currentCard) return;
        const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
        const onMouseUp = () => handleEnd();
        const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
        currentCard.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            currentCard.removeEventListener('mousedown', onMouseDown);
        };
    }, [handleStart, handleMove, handleEnd]);

    return (
        <div
            ref={cardRef}
            id={card.id}
            className={`${styles.card} ${isOnboardingActive ? styles['card-onboarding'] : ''}`}
            // НОВОЕ: Управляем видимостью и zIndex через инлайн-стили
            style={{
                zIndex,
                opacity: isReady ? 1 : 0, // Карточка невидима, пока не готова
                transition: 'opacity 0.2s ease-in', // Плавное появление
            }}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
        >
            <div onClick={() => navigate(`/product/${card.id}`)}>
                {!imageLoaded && (
                    <CustomSkeleton style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, borderRadius: '8px' }} />
                )}
                <img
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    className={styles.cardImage}
                    src={card.image_urls[0]}
                    alt={card.name}
                />
            </div>

            {isTopCard && swipeProgress && (
                <>
                    <div className={`${styles.swipeFeedback} ${styles.swipeFeedbackRight}`} style={{ opacity: swipeProgress.direction === 'right' ? swipeProgress.opacity : 0 }}>
                        <img src="/subicons/darklike.svg" alt="Like" style={{ width: '80px' }} />
                    </div>
                    <div className={`${styles.swipeFeedback} ${styles.swipeFeedbackLeft}`} style={{ opacity: swipeProgress.direction === 'left' ? swipeProgress.opacity : 0 }}>
                        <img src="/subicons/darkdislike.svg" alt="Dislike" style={{ width: '80px' }} />
                    </div>
                </>
            )}

            <div className={styles.cardContent}>
                <div className={styles.cardBottom}>
                    <div className={styles.cardInfo}>
                        <div className={styles.productName}>{card?.name}</div>
                        <div className={styles.manufacturer}>{card?.brand}</div>
                        <div className={styles.priceRow}>
                            <div className={styles.price}>{card?.discount_price || card?.price} ₽</div>
                            <button className={styles.saveButton} onClick={(e) => { e.stopPropagation(); onSaveClick(card); }}>
                                <img
                                    src={card.is_contained_in_user_collections ? "/subicons/fullwhitebookmark.svg" : "/subicons/whitebookmark.svg"}
                                    alt={card.is_contained_in_user_collections ? "Сохранено" : "Сохранить"}
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