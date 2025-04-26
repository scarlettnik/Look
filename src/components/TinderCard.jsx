import {useCallback, useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

const VELOCITY_THRESHOLD = 0.5;
const SWIPE_POWER = 0.6;
const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.05;
const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.05;
const VERTICAL_SWIPE_DOWN_THRESHOLD_RATIO = 0.08; // Новый порог для свайпа вниз
const ANIMATION_DURATION = 800;


const TinderCard = ({card, onExpand, onCollapse, onSwipe, updateSwipeFeedback, zIndex, offset, isPending}) => {
    const [isVisible, setIsVisible] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const animationFrame = useRef(null);
    const contentRef = useRef(null);
    const startTime = useRef(0);

    const location = useLocation();

    useEffect(() => {
        const isTopCard = offset === 0;
        const isCurrentlyExpanded = location.state?.expandedCard === card.id;

        // Запретить развертывание карточки, если она уже развернута
        if (isCurrentlyExpanded && !isExpanded) {
            setIsExpanded(false); // Не позволяйте открывать карточку на полный экран
        } else if (isTopCard && isCurrentlyExpanded) {
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    }, [location.state, card.id, offset, isExpanded]);


    useEffect(() => {
        const isTopCard = offset === 0;
        setIsExpanded(isTopCard && location.state?.expandedCard === card.id);
    }, [location.state, card.id, offset]);

    const handleStart = (clientX, clientY) => {
        setStartPos({ x: clientX, y: clientY });
        setIsDragging(true);
        startTime.current = Date.now();
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };


    const cardRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current) return;

        if (isPending) {
            // Инициализация анимации
            cardRef.current.style.transition = 'none';
            cardRef.current.style.opacity = '0';
            cardRef.current.style.transform = 'translateY(20px)';

// Запуск анимации после подготовки
            requestAnimationFrame(() => {
                cardRef.current.style.transition = `
                    opacity 300ms ease-out,
                    transform 300ms cubic-bezier(0.18, 0.89, 0.32, 1.28)
                `;
                cardRef.current.style.opacity = '1';
                cardRef.current.style.transform = 'translateY(0)';
            });
        }
    }, [isPending]);

    const resetPosition = (duration = ANIMATION_DURATION) => {
        if (cardRef.current) {
            const cardElement = cardRef.current;

            const currentTransform = cardElement.style.transform;
            const currentOpacity = cardElement.style.opacity;

            cardElement.style.transition = `all ${duration}ms cubic-bezier(0.23, 1, 0.32, 1)`;

            cardElement.style.transform = 'translate(0, 0) rotate(0deg)';
            cardElement.style.opacity = '1';

            const onTransitionEnd = () => {
                cardElement.removeEventListener('transitionend', onTransitionEnd);
                setPosition({ x: 0, y: 0, rotate: 0 });
                updateSwipeFeedback(0, 0);
                cardElement.style.transition = '';
            };

            cardElement.addEventListener('transitionend', onTransitionEnd);

            return () => {
                cardElement.removeEventListener('transitionend', onTransitionEnd);
                cardElement.style.transition = '';
                cardElement.style.transform = currentTransform;
                cardElement.style.opacity = currentOpacity;
            };
        }
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;

        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = requestAnimationFrame(() => {
            const deltaX = clientX - startPos.x;
            const deltaY = clientY - startPos.y;
            const rotate = Math.min(Math.max(deltaX * 0.1, -15), 15);

            setPosition({ x: deltaX, y: deltaY, rotate });
            updateSwipeFeedback(deltaX, deltaY);
        });
    };

    const handleEnd = () => {
        if (!isDragging || isExpanded) return;
        setIsDragging(false);
        cancelAnimationFrame(animationFrame.current);

        const { innerWidth, innerHeight } = window;
        const deltaTime = Date.now() - startTime.current;

        const velocity = {
            x: (position.x / (deltaTime || 1)) * SWIPE_POWER,
            y: (position.y / (deltaTime || 1)) * SWIPE_POWER
        };

        const projectedPosition = {
            x: position.x + velocity.x * 150,
            y: position.y + velocity.y * 150
        };

        const isHorizontal =
            Math.abs(projectedPosition.x) > innerWidth * HORIZONTAL_SWIPE_THRESHOLD_RATIO ||
            Math.abs(velocity.x) > VELOCITY_THRESHOLD;

        const isVerticalUp =
            projectedPosition.y < -innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO ||
            velocity.y < -VELOCITY_THRESHOLD;

        // Disable downward swipes
        const isVerticalDown = projectedPosition.y > innerHeight * VERTICAL_SWIPE_DOWN_THRESHOLD_RATIO || velocity.y > VELOCITY_THRESHOLD;

        const dynamicDuration = Math.min(
            ANIMATION_DURATION,
            ANIMATION_DURATION / (Math.abs(velocity.x) + Math.abs(velocity.y) + 0.1)
        );

        // Handle only up and horizontal swipes
        if (isVerticalUp) {
            animateWithVelocity('up', dynamicDuration);
        } else if (isHorizontal) {
            animateWithVelocity(velocity.x > 0 ? 'right' : 'left', dynamicDuration);
        } else {
            resetPosition(dynamicDuration);
        }
    };

    const animateWithVelocity = (direction, duration) => {
        if (cardRef.current) {
            const targetX = direction === 'right'
                ? window.innerWidth * 2
                : direction === 'left'
                    ? -window.innerWidth * 2
                    : 0;

            const targetY = direction === 'up' ? -window.innerHeight * 2 : 0;
            const rotation = direction === 'right' ? 25 : direction === 'left' ? -25 : 0;

            cardRef.current.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            cardRef.current.style.transform = `
                translate(${targetX}px, ${targetY}px)
                rotate(${rotation}deg)
            `;
            cardRef.current.style.opacity = '0';
        }

        setTimeout(() => {
            onSwipe(direction, card);
        }, 50);
    };

    useEffect(() => {
        const cardElement = cardRef.current;
        if (!cardElement) return;

        const scale = 1 - offset * 0.03;
        const translateY = -offset * 10;

        cardElement.style.transform = `
            translate(${position.x}px, ${position.y}px)
            rotate(${position.rotate}deg)
            scale(${scale})
            translateY(${translateY}px)
        `;
        cardElement.style.zIndex = zIndex;
    }, [position, zIndex, offset]);


    return (
        <div
            ref={cardRef}
            id={card.id}
            className={`tinder--card ${isDragging ? 'moving' : ''} ${isExpanded ? 'expanded' : ''} ${isVisible ? 'visible' : ''}`}
            onTouchStart={(e) => !isExpanded && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => !isExpanded && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={!isExpanded ? handleEnd : undefined}
            onMouseDown={(e) => !isExpanded && handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => !isExpanded && handleMove(e.clientX, e.clientY)}
            onMouseUp={!isExpanded ? handleEnd : undefined}
            onMouseLeave={!isExpanded ? handleEnd : undefined}

            style={{
                    backgroundImage: `url(${card.image_urls[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0,
                zIndex: zIndex,
                transform: `translate(${offset * 2}px, ${offset * 1}px) ${card.style?.transform || ''}`
                }}
        >

            <div
                className="card-content"
                ref={contentRef}

            >


            </div>

        </div>
    );
};
export default TinderCard