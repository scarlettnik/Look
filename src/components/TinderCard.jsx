import { useState, useEffect, useCallback } from 'react';
import { Heart, HeartOff, Save } from 'lucide-react';
import './ui/TinderCards.css';

const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.02;
const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.02;

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

        const moveOutWidth = document.body.clientWidth * 1.5;
        let transform = '';

        switch(direction) {
            case 'left':
                transform = `translate(-${moveOutWidth}px, -100px) rotate(-30deg)`;
                break;
            case 'right':
                transform = `translate(${moveOutWidth}px, -100px) rotate(30deg)`;
                break;
            case 'up':
                transform = `translate(0, -${document.body.clientHeight * 1.5}px) rotate(0deg)`;
                break;
        }

        card.style.transform = transform;
        card.style.opacity = '0';
        card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }, []);

    const handleSwipe = useCallback((direction, card) => {
        animateSwipe(direction, card.id);
        setSwipeProgress({ direction: null, opacity: 0 });

        setTimeout(() => {
            setCards(prev => prev.filter(c => c.id !== card.id));
            if(direction === 'up') setBasket(prev => [...prev, card]);
        }, 300);
    }, [animateSwipe]);

    const updateSwipeFeedback = useCallback((dx, dy) => {
        const swipeThreshold = window.innerWidth * HORIZONTAL_SWIPE_THRESHOLD_RATIO;
        const verticalThreshold = window.innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO;

        let direction = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy * 2)) {
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
                    size={40}
                    className="status-icon nope"
                    style={{
                        opacity: swipeProgress.direction === 'left' ? swipeProgress.opacity : 0,
                        transform: `scale(${0.8 + (swipeProgress.direction === 'left' ? swipeProgress.opacity * 0.7 : 0)})`
                    }}
                />
                <Heart
                    size={40}
                    className="status-icon love"
                    style={{
                        opacity: swipeProgress.direction === 'right' ? swipeProgress.opacity : 0,
                        transform: `scale(${0.8+ (swipeProgress.direction === 'right' ? swipeProgress.opacity * 0.7 : 0)})`
                    }}
                />
                <Save
                    size={40}
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
                        offset={index * 2}
                        verticalThreshold={VERTICAL_SWIPE_THRESHOLD_RATIO}
                        horizontalThreshold={HORIZONTAL_SWIPE_THRESHOLD_RATIO}
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
                    <HeartOff className="icon" />
                </button>
                <button onClick={() => cards[0] && handleSwipe('up', cards[0])}>
                    <Save className="icon" />
                </button>
                <button onClick={() => cards[0] && handleSwipe('right', cards[0])}>
                    <Heart className="icon" />
                </button>
            </div>
        </div>
    );
};

const TinderCard = ({ card, onSwipe, updateSwipeFeedback, zIndex, offset }) => {
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleStart = (clientX, clientY) => {
        setStartPos({ x: clientX, y: clientY });
        setIsDragging(true);
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;

        const deltaX = clientX - startPos.x;
        const deltaY = clientY - startPos.y;
        const rotate = deltaX * 0.15;

        setPosition({ x: deltaX, y: deltaY, rotate });
        updateSwipeFeedback(deltaX, deltaY);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const SWIPE_THRESHOLD = window.innerWidth * 0.1;
        const isHorizontal = Math.abs(position.x) > SWIPE_THRESHOLD;
        const isVerticalUp = position.y < -window.innerHeight * 0.1;

        if (isVerticalUp) {
            onSwipe('up', card);
        } else if (isHorizontal) {
            onSwipe(position.x > 0 ? 'right' : 'left', card);
        } else {
            setPosition({ x: 0, y: 0, rotate: 0 });
            updateSwipeFeedback(0, 0);
        }
    };

    useEffect(() => {
        const cardElement = document.getElementById(card.id);
        if (!cardElement) return;

        cardElement.style.transform = `
            translate(${position.x}px, ${position.y}px)
            rotate(${position.rotate}deg)
            scale(${1 - offset * 0.02})
            translateY(-${offset * 2}px)
        `;
        cardElement.style.opacity = 1 - offset * 0.1;
        cardElement.style.zIndex = zIndex;
    }, [position, card.id, zIndex, offset]);

    return (
        <div
            id={card.id}
            className={`tinder--card ${isDragging ? 'moving' : ''}`}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
        >
            <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
            </div>
        </div>
    );
};

export default TinderCards;