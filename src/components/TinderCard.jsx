import { useState, useEffect, useCallback, useRef } from 'react';
import {CornerUpLeft, Heart, HeartOff, Save} from 'lucide-react';
import './ui/TinderCards.css';
import {Link, useNavigate, useLocation} from "react-router-dom";
import Sidebar from './Sidebar';
import {useAuth} from "../provider/AuthProvider.jsx";

const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.05;
const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.05;
const VERTICAL_SWIPE_DOWN_THRESHOLD_RATIO = 0.08; // Новый порог для свайпа вниз
const VELOCITY_THRESHOLD = 0.5;
const ANIMATION_DURATION = 800;
const SWIPE_POWER = 0.6;
const ANIMATE_SCROLL = 100;
const authToken = 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';


const TinderCards = () => {
    const [cards, setCards] = useState([]);
    const [basket, setBasket] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [swipeProgress, setSwipeProgress] = useState({ direction: null, opacity: 0 });
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [swipeHistory, setSwipeHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { data } = useAuth();

    const fetchCards = useCallback(async () => {
        if (!hasMore || isFetching) return;

        try {
            setIsFetching(true);
            const response = await fetch(`https://marlin-darling-pipefish.ngrok-free.app/v1/catalog/feed`, {
                method: 'GET',
                headers: {
                    "ngrok-skip-browser-warning": true,
                    'Content-Type': 'application/json',
                    'Authorization': `tma ${authToken}`
                },

            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newCards = await response.json();
            setHasMore(newCards.length > 0);

            setCards(prev => [
                ...prev,
                ...newCards.filter(card =>
                    !prev.some(existing => existing.id === card.id)
                )
            ]);
            setPage(p => p + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }, [page, hasMore, isFetching]);

    useEffect(() => {
        if (data) fetchCards();
    }, [data]);

    useEffect(() => {
        if (cards.length <= 3 && hasMore && !isFetching) {
            fetchCards();
        }
    }, [cards.length, hasMore, isFetching, fetchCards]);


    console.log(cards)
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
            case 'down':
                card.style.transform = `translate(0, ${innerHeight * 2}px) rotate(0deg)`;
                break;
        }

        card.style.opacity = '0';
    }, []);

    const animateReturn = useCallback((cardId) => {
        const card = document.getElementById(cardId);
        if (!card) return;

        card.style.transition = `all ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        card.style.transform = 'translate(0, 0) rotate(0deg)';
        card.style.opacity = '1';
    }, []);

    const undoSwipe = useCallback(() => {
        if (swipeHistory.length === 0) return;

        const lastAction = swipeHistory[0];
        setSwipeHistory(prev => prev.slice(1));

        // Возвращаем карточку в начало списка
        setCards(prev => [lastAction.card, ...prev]);

        // Убираем из корзины если нужно
        if (lastAction.direction === 'up') {
            setBasket(prev => prev.filter(c => c.id !== lastAction.card.id));
        }

        // Анимация возврата
        animateReturn(lastAction.card.id);
    }, [swipeHistory, animateReturn]);

    const handleSwipe = useCallback((direction, card) => {
        animateSwipe(direction, card.id);
        setSwipeProgress({ direction: null, opacity: 0 });
        setSwipeHistory(prev => [{ direction, card }, ...prev]);

        setTimeout(() => {
            setCards(prev => prev.filter(c => c.id !== card.id));
            if (direction === 'up') setBasket(prev => [...prev, card]);
        }, ANIMATE_SCROLL);
    }, [animateSwipe]);

    const updateSwipeFeedback = useCallback((dx, dy) => {
        const swipeThreshold = window.innerWidth * HORIZONTAL_SWIPE_THRESHOLD_RATIO;
        const verticalThreshold = window.innerHeight * VERTICAL_SWIPE_THRESHOLD_RATIO;
        const verticalDownThreshold = window.innerHeight * VERTICAL_SWIPE_DOWN_THRESHOLD_RATIO;

        let direction = null;
        let opacity = 0;

        if (Math.abs(dx) > Math.abs(dy * 1.5)) {
            direction = dx > 0 ? 'right' : 'left';
            opacity = Math.min(Math.abs(dx) / swipeThreshold, 1);
        } else if (dy < -verticalThreshold) {
            direction = 'up';
            opacity = Math.min(Math.abs(dy) / verticalThreshold, 1);
        } else if (dy > verticalDownThreshold) {
            direction = 'down';
            opacity = Math.min(dy / verticalDownThreshold, 1);
        }

        setSwipeProgress({ direction, opacity });
    }, []);

    const handleButtonSwipe = (direction) => {
        if (!cards[0]) return;

        const card = cards[0];
        const cardElement = document.getElementById(card.id);
        if (cardElement) {
            cardElement.style.transition = `all ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        }
        handleSwipe(direction, card);
    };

    if (loading) return <div className="loading">Загрузка карточек...</div>;
    // if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="tinder">
            <button
                className="undo-button"
                onClick={undoSwipe}
                disabled={swipeHistory.length === 0}
            >
                <CornerUpLeft style={{backgroundColor:'white'}} className="undo-icon" size={24}/>
            </button>
            <div className="tinder--status">
                <HeartOff className="status-icon nope" style={getIconStyle('left', swipeProgress)}/>
                <Heart className="status-icon love" style={getIconStyle('right', swipeProgress)}/>
                <Save className="status-icon basket" style={getIconStyle('up', swipeProgress)}/>
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
                        isExpanded={expandedCardId === card.id}
                        onExpand={() => setExpandedCardId(card.id)}
                        onCollapse={() => setExpandedCardId(null)}
                    />
                ))}
                {cards.length === 0 && (
                    <div className="empty-state">
                        <h2>No more cards!</h2>
                    </div>
                )}
            </div>

            <div className="tinder--buttons" style={{display: expandedCardId ? 'none' : 'flex'}}>
                <button onClick={() => handleButtonSwipe('left')}>
                    <HeartOff className="icon" size={24}/>
                </button>
                <button onClick={() => handleButtonSwipe('up')}>
                    <Save className="icon" size={24}/>
                </button>
                <button onClick={() => handleButtonSwipe('right')}>
                    <Heart className="icon" size={24}/>
                </button>
            </div>
            <Sidebar/>
        </div>
    );
};

const TinderCard = ({card, onExpand, onCollapse, onSwipe, updateSwipeFeedback, zIndex, offset}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const animationFrame = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const startTime = useRef(0);

    const navigate = useNavigate()
    const location = useLocation();

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

    const handleExpandCard = useCallback(() => {
        onExpand();
        navigate(location.pathname, {
            state: { expandedCard: card.id },
            replace: false
        });
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
        const cardElement = cardRef.current;
        if (cardElement) {
            const rect = cardElement.getBoundingClientRect();
            cardElement.style.transform = `
                translate(${window.innerWidth/2 - rect.left - rect.width/2}px, 
                        ${window.innerHeight/2 - rect.top - rect.height/2}px)
                scale(${window.innerWidth / rect.width * 0.95})
            `;
            cardElement.style.zIndex = 1000;
        }
    }, [onExpand, navigate, card.id, location.pathname]);

    const handleCollapseCard = useCallback(() => {
        onCollapse();
        setIsExpanded(false);
        const cardElement = cardRef.current;
        if (cardElement) {
            cardElement.style.transform = 'translate(0, 0) scale(1)';
            cardElement.style.zIndex = zIndex;
        }
        console.log('tap')
    }, [onCollapse, navigate, zIndex]);

    const handleClose = useCallback(() => {
        handleCollapseCard();
        setIsExpanded(false);
    }, [handleCollapseCard]);

    useEffect(() => {
        if (!isExpanded) return;

        const handlePopState = (event) => {
            if (!event.state?.expandedCard) {
                handleClose();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isExpanded, handleClose]);



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

        const isVerticalDown =
            projectedPosition.y > innerHeight * VERTICAL_SWIPE_DOWN_THRESHOLD_RATIO ||
            velocity.y > VELOCITY_THRESHOLD;

        const dynamicDuration = Math.min(
            ANIMATION_DURATION,
            ANIMATION_DURATION / (Math.abs(velocity.x) + Math.abs(velocity.y) + 0.1)
        );

        if (isVerticalDown) {
            handleExpandCard();
            resetPosition(dynamicDuration);
        } else if (isVerticalUp) {
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


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isExpanded && cardRef.current && !cardRef.current.contains(e.target)) {
                handleCollapseCard();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, handleCollapseCard]);

    return (
        <div
            ref={cardRef}
            id={card.id}
            className={`tinder--card ${isDragging ? 'moving' : ''} ${isExpanded ? 'expanded' : ''}`}
            onTouchStart={(e) => !isExpanded && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => !isExpanded && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={!isExpanded ? handleEnd : undefined}
            onMouseDown={(e) => !isExpanded && handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => !isExpanded && handleMove(e.clientX, e.clientY)}
            onMouseUp={!isExpanded ? handleEnd : undefined}
            onMouseLeave={!isExpanded ? handleEnd : undefined}
        >
            <div
                className="card-content"
                ref={contentRef}
                style={{ height: isExpanded ? contentHeight : 'auto' }}
            >
                <h3>{card?.name}</h3>
                <p>{card.description}</p>

                {isExpanded && (
                    <div className="detailed-content">
                        <h4>Подробная информация</h4>
                        <p>{card.details}</p>
                        <Link
                            to={`/product/${card.id}`}
                            className="details-link"
                        >
                            Полные характеристики
                        </Link>
                        <button
                            className="close-button"
                            onClick={handleCollapseCard}
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const getIconStyle = (direction, swipeProgress) => ({
    opacity: swipeProgress.direction === direction ? swipeProgress.opacity : 0,
    transform: `scale(${0.8 + (swipeProgress.direction === direction ? swipeProgress.opacity * 0.9 : 0)})`,
    transition: 'all 0.2s ease-out'
});

export default TinderCards;