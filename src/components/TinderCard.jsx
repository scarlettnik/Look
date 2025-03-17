import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, HeartOff, Save } from 'lucide-react';
import './ui/TinderCards.css';

const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.15;
const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.15;

const TinderCards = () => {
    const [cards, setCards] = useState([
        {
            id: 1,
            title: 'Demo card 1',
            text: 'This is a demo for Tinder like swipe cards',
        },
        {
            id: 2,
            title: 'Demo card 2',
            text: 'This is a demo for Tinder like swipe cards',
        },
        {
            id: 3,
            title: 'Demo card 3',
            text: 'This is a demo for Tinder like swipe cards',
        },
        {
            id: 4,
            title: 'Demo card 4',
            text: 'This is a demo for Tinder like swipe cards',
        },
        {
            id: 5,
            title: 'Demo card 5',
            text: 'This is a demo for Tinder like swipe cards',
        }
    ]);

    const [basket, setBasket] = useState([]);
    const [swipeProgress, setSwipeProgress] = useState({
        direction: null,
        opacity: 0
    });

    const animateSwipe = useCallback((direction, cardId) => {
        const card = document.getElementById(cardId);
        if (!card) return;

        const { innerWidth, innerHeight } = window;
        const rotation = direction === 'right' ? 25 : -25;

        card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';

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
        }, 600);
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

    return (
        <div className="tinder">
            <div className="tinder--status">
                <HeartOff
                    className="status-icon nope"
                    style={{
                        opacity: swipeProgress.direction === 'left' ? swipeProgress.opacity : 0,
                        transform: `scale(${0.8 + (swipeProgress.direction === 'left' ? swipeProgress.opacity * 0.7 : 0)})`
                    }}
                />
                <Heart
                    className="status-icon love"
                    style={{
                        opacity: swipeProgress.direction === 'right' ? swipeProgress.opacity : 0,
                        transform: `scale(${0.8 + (swipeProgress.direction === 'right' ? swipeProgress.opacity * 0.7 : 0)})`
                    }}
                />
                <Save
                    className="status-icon basket"
                    style={{
                        opacity: swipeProgress.direction === 'up' ? swipeProgress.opacity : 0,
                        transform: `scale(${0.8 + (swipeProgress.direction === 'up' ? swipeProgress.opacity * 0.7 : 0)})`
                    }}
                />
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
                <button onClick={() => cards[0] && handleSwipe('left', cards[0])}>
                    <HeartOff className="icon" size={24} />
                </button>
                <button onClick={() => cards[0] && handleSwipe('up', cards[0])}>
                    <Save className="icon" size={24} />
                </button>
                <button onClick={() => cards[0] && handleSwipe('right', cards[0])}>
                    <Heart className="icon" size={24} />
                </button>
            </div>
        </div>
    );
};

const TinderCard = ({ card, onSwipe, updateSwipeFeedback, zIndex, offset }) => {
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const animationFrame = useRef(null);
    const cardRef = useRef(null);

    const handleStart = (clientX, clientY) => {
        setStartPos({ x: clientX, y: clientY });
        setIsDragging(true);
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

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        cancelAnimationFrame(animationFrame.current);

        const { innerWidth, innerHeight } = window;
        const isHorizontal = Math.abs(position.x) > innerWidth * 0.1;
        const isVertical = Math.abs(position.y) > innerHeight * 0.1;

        if (isVertical && position.y < 0) {
            onSwipe('up', card);
        } else if (isHorizontal) {
            onSwipe(position.x > 0 ? 'right' : 'left', card);
        } else {
            resetPosition();
        }
    };

    const resetPosition = () => {
        if (cardRef.current) {
            cardRef.current.style.transition = 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
            setPosition({ x: 0, y: 0, rotate: 0 });
            updateSwipeFeedback(0, 0);
        }
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
            onTouchStart={(e) => {
                e.preventDefault();
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
                e.preventDefault();
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={(e) => {
                e.preventDefault();
                handleEnd();
            }}
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

export default TinderCards;