import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, HeartOff, Save } from 'lucide-react';
import './ui/TinderCards.css';
import {useNavigate} from "react-router-dom";

const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.05;
const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.05;
const VELOCITY_THRESHOLD = 0.5;
const ANIMATION_DURATION = 800;
const SWIPE_POWER = 0.6;

const TinderCards = () => {
    const [cards, setCards] = useState([
        { id: 1, title: 'Demo card 1', text: 'This is a demo for Tinder like swipe cards' },
        { id: 2, title: 'Demo card 2', text: 'This is a demo for Tinder like swipe cards' },
        { id: 3, title: 'Demo card 3', text: 'This is a demo for Tinder like swipe cards' },
        { id: 4, title: 'Demo card 4', text: 'This is a demo for Tinder like swipe cards' },
        { id: 5, title: 'Demo card 5', text: 'This is a demo for Tinder like swipe cards' }
    ]);
    const navigate = useNavigate();
    const [basket, setBasket] = useState([]);
    const [swipeProgress, setSwipeProgress] = useState({ direction: null, opacity: 0 });

    const animateSwipe = useCallback((direction, cardId) => {
        const card = document.getElementById(cardId);
        if (!card) return;

        const { innerWidth, innerHeight } = window;
        const rotation = direction === 'right' ? 25 : -25;

        card.style.transition = `all ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

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
        }

        card.style.opacity = '0';
    }, []);

    const handleSwipe = useCallback((direction, card) => {
        animateSwipe(direction, card.id);
        setSwipeProgress({ direction: null, opacity: 0 });

        setTimeout(() => {
            setCards(prev => prev.filter(c => c.id !== card.id));
            if(direction === 'up') setBasket(prev => [...prev, card]);
        }, ANIMATION_DURATION);
    }, [animateSwipe]);

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

    const handleButtonSwipe = (direction) => {
        if (!cards[0]) return;

        const card = cards[0];
        const cardElement = document.getElementById(card.id);
        if (cardElement) {
            cardElement.style.transition = `all ${ANIMATION_DURATION}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        }
        handleSwipe(direction, card);
    };

    return (
        <div className="tinder">
            <div className="tinder--status">
                <HeartOff className="status-icon nope" style={getIconStyle('left', swipeProgress)} />
                <Heart className="status-icon love" style={getIconStyle('right', swipeProgress)} />
                <Save className="status-icon basket" style={getIconStyle('up', swipeProgress)} />
            </div>

            <div className="tinder--cards">
                {cards.map((card, index) => (
                    <TinderCard
                        key={card.id}
                        card={card}
                        onSwipe={handleSwipe}
                        updateSwipeFeedback={updateSwipeFeedback}
                        zIndex={cards.length - index}
                        offset={index}
                    />
                ))}
                {cards.length === 0 && (
                    <div className="empty-state">
                        <h2>No more cards!</h2>
                    </div>
                )}
            </div>

            <div className="tinder--buttons">
                <button onClick={() => handleButtonSwipe('left')}>
                    <HeartOff className="icon" size={24} />
                </button>
                <button onClick={() => handleButtonSwipe('up')}>
                    <Save className="icon" size={24} />
                </button>
                <button onClick={() => handleButtonSwipe('right')}>
                    <Heart className="icon" size={24} />
                </button>
            </div>
            <button onClick={() => navigate('/profile')}></button>
        </div>
    );
};

const TinderCard = ({ card, onSwipe, updateSwipeFeedback, zIndex, offset }) => {
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const animationFrame = useRef(null);
    const cardRef = useRef(null);
    const startTime = useRef(0);

    const handleStart = (clientX, clientY) => {
        setStartPos({ x: clientX, y: clientY });
        setIsDragging(true);
        startTime.current = Date.now();
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
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


    const handleEnd = () => {
        if (!isDragging) return;
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

        const dynamicDuration = Math.min(
            ANIMATION_DURATION,
            ANIMATION_DURATION / (Math.abs(velocity.x) + Math.abs(velocity.y) + 0.1)
        );

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
        cardElement.style.opacity = 1 - offset * 0.15;
        cardElement.style.zIndex = zIndex;
    }, [position, zIndex, offset]);

    return (
        <div
            ref={cardRef}
            id={card.id}
            className={`tinder--card ${isDragging ? 'moving' : ''}`}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
        >
            <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
            </div>
        </div>
    );
};

const getIconStyle = (direction, swipeProgress) => ({
    opacity: swipeProgress.direction === direction ? swipeProgress.opacity : 0,
    transform: `scale(${0.8 + (swipeProgress.direction === direction ? swipeProgress.opacity * 0.7 : 0)})`,
    transition: 'all 0.2s ease-out'
});

export default TinderCards;