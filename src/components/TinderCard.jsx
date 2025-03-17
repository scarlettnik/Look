import { useState, useEffect, useCallback } from 'react';
import './ui/TinderCards.css';

const TinderCards = () => {
    const [cards, setCards] = useState([
        { id: 1, title: 'Demo card 1', text: 'This is a demo for Tinder like swipe cards' },
        { id: 2, title: 'Demo card 2', text: 'This is a demo for Tinder like swipe cards' },
        { id: 3, title: 'Demo card 3', text: 'This is a demo for Tinder like swipe cards' },
        { id: 4, title: 'Demo card 4', text: 'This is a demo for Tinder like swipe cards' },
        { id: 5, title: 'Demo card 5', text: 'This is a demo for Tinder like swipe cards' },
    ]);
    const [basket, setBasket] = useState([]);
    const [lastDirection, setLastDirection] = useState();

    const swipe = useCallback((dir, id) => {
        setLastDirection(dir);
        setCards(prev => prev.filter(card => card.id !== id));
    }, []);

    const addToBasket = useCallback((item) => {
        setBasket(prev => [...prev, item]);
    }, []);

    const handleSwipe = (direction, card) => {
        if (direction === 'up') {
            addToBasket(card);
        }
        swipe(direction, card.id);
    };

    return (
        <div className="tinder">
            <div className="tinder--status">
                <i className="fa fa-remove"></i>
                <i className="fa fa-heart"></i>
            </div>

            <div className="tinder--cards">
                {cards.map((card) => (
                    <TinderCard
                        key={card.id}
                        card={card}
                        onSwipe={handleSwipe}
                        active={cards[0].id === card.id}
                    />
                ))}
                {cards.length === 0 && (
                    <div className="empty-state">
                        <h2>No more cards!</h2>
                    </div>
                )}
            </div>

            <div className="tinder--buttons">
                <button onClick={() => handleSwipe('left', cards[0])}>
                    <i className="fa fa-remove"></i>
                </button>
                <button onClick={() => handleSwipe('up', cards[0])}>
                    <i className="fa fa-shopping-basket"></i>
                </button>
                <button onClick={() => handleSwipe('right', cards[0])}>
                    <i className="fa fa-heart"></i>
                </button>
            </div>
        </div>
    );
};

const TinderCard = ({ card, onSwipe, active }) => {
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleStart = (clientX, clientY) => {
        setStartPos({ x: clientX, y: clientY });
        setIsDragging(true);
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging || !active) return;

        const deltaX = clientX - startPos.x;
        const deltaY = clientY - startPos.y;
        const angle = deltaX * 0.1;

        setPosition({
            x: deltaX,
            y: deltaY,
            rotate: angle,
        });
    };

    const handleEnd = () => {
        if (!isDragging || !active) return;
        setIsDragging(false);

        const threshold = window.innerWidth / 4;
        const upThreshold = window.innerHeight / 4;

        if (Math.abs(position.y) > upThreshold) {
            onSwipe('up', card);
        } else if (Math.abs(position.x) > threshold) {
            onSwipe(position.x > 0 ? 'right' : 'left', card);
        } else {
            setPosition({ x: 0, y: 0, rotate: 0 });
        }
    };

    useEffect(() => {
        if (!active) return;

        const cardStyle = {
            transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotate}deg)`,
            opacity: 1 - Math.abs(position.x) / 300,
            zIndex: 10,
        };

        if (Math.abs(position.x) > 300 || Math.abs(position.y) > 300) {
            cardStyle.opacity = 0;
            cardStyle.transition = 'all 0.3s ease-out';
            setTimeout(() => onSwipe(position.x > 0 ? 'right' : 'left', card), 300);
        }

        Object.assign(document.getElementById(card.id).style, cardStyle);
    }, [position, active, card, onSwipe]);

    return (
        <div
            id={card.id}
            className={`tinder--card ${isDragging ? 'moving' : ''}`}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
        >
            <h3>{card.title}</h3>
            <p>{card.text}</p>
        </div>
    );
};

export default TinderCards;