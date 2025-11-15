import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../../app/providers/storeContext';
import styles from '../../ui/onboarding/onboardingModal.module.css';
import welcomeStyle from '../../ui/onboarding/steps/welcomeStyle.module.css';
import {ANIMATION_PARAMS, START_CARDS} from "../../../constants";
import { preloadImages } from "../../../lib/assetPreloader";
import { ONBOARDING_ASSETS } from "../../../lib/assets";

const WelcomeStep = ({ userName, userSername, onNext }: any) => {
    const { authStore } = useStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const cardsRef = useRef<any[]>([]);
    const animationRef = useRef<any>(null);
    const cards = START_CARDS;

    const easeInOut = useCallback((t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, []);
    const easeOut = useCallback((t) => 1 - Math.pow(1 - t, 3), []);

    const loadStarterCards = useCallback(async () => {
        await preloadImages(cards.map((card) => card.image));
        setImagesLoaded(true);
    }, [cards]);

    useEffect(() => {
        void loadStarterCards();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [loadStarterCards]);

    const animateResist = useCallback((cardElement) => {
        const {
            maxTranslate,
            maxRotate,
            swipeDuration,
            holdDuration,
            returnDuration,
            totalDuration
        } = ANIMATION_PARAMS.resist;

        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const cycleTime = elapsed % totalDuration;

            if (cycleTime < swipeDuration) {
                const progress = cycleTime / swipeDuration;
                const easeProgress = easeOut(progress);
                const translateX = easeProgress * maxTranslate;
                const rotate = easeProgress * maxRotate;
                cardElement.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`;
            }
            else if (cycleTime < swipeDuration + holdDuration) {
                cardElement.style.transform = `translateX(${maxTranslate}px) rotate(${maxRotate}deg)`;
            }
            else if (cycleTime < swipeDuration + holdDuration + returnDuration) {
                const returnProgress = (cycleTime - swipeDuration - holdDuration) / returnDuration;
                const easeProgress = easeInOut(returnProgress);
                const translateX = maxTranslate - easeProgress * maxTranslate;
                const rotate = maxRotate - easeProgress * maxRotate;
                cardElement.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`;
            }
            else {
                cardElement.style.transform = 'translateX(0) rotate(0)';
            }
            cardElement.style.transition = 'none';

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [easeInOut, easeOut]);

    const startAutoSwipe = useCallback(() => {
        if (currentIndex >= cards.length) return;

        const currentCard = cards[currentIndex];
        const cardElement = cardsRef.current[currentIndex];
        if (!cardElement) return;

        if (currentCard.direction === 'resist') {
            animateResist(cardElement);
            return;
        }

        const { swipeDistance, duration, maxRotate } = ANIMATION_PARAMS.regular;
        const direction = currentCard.direction === 'left' ? -1 : 1;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            if (progress < 1) {
                const easeProgress = easeInOut(progress);
                const translateX = easeProgress * swipeDistance * direction;
                const rotate = easeProgress * maxRotate * direction;

                cardElement.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`;
                cardElement.style.opacity = '1';
                cardElement.style.transition = 'none';

                animationRef.current = requestAnimationFrame(animate);
            } else {
                cardElement.style.display = 'none';
                setCurrentIndex(prev => prev + 1);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [animateResist, cards, currentIndex, easeInOut]);

    useEffect(() => {
        if (imagesLoaded) {
            startAutoSwipe();
        }
    }, [imagesLoaded, startAutoSwipe]);

    const getStackClassName = (index) => welcomeStyle[`stackLevel${cards.length - index}`] ?? '';
    const getCardStateClassName = (card, index) => {
        if (index >= currentIndex || card.direction === 'resist') {
            return '';
        }

        return card.direction === 'left' ? welcomeStyle.cardSwipedLeft : welcomeStyle.cardSwipedRight;
    };

    return (
        <div className={`${styles.onboardingStep} ${welcomeStyle.onboardingStep}`}>
            <p className={welcomeStyle.onBoardingTitle}>
                Добро пожаловать{userName && ','} <br/>
                {userName ? `${userName} ${userSername}!` : 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ'}
            </p>

            <div className={welcomeStyle.cardsContainer}>
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        ref={el => cardsRef.current[index] = el}
                        className={`${welcomeStyle.card} ${getStackClassName(index)} ${getCardStateClassName(card, index)}`.trim()}
                    >
                        <img
                            src={card.image}
                            alt={`Card ${index + 1}`}
                            className={welcomeStyle.cardImage}
                            loading="eager"
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            decoding="async"
                        />
                    </div>
                ))}
            </div>

            <button
                className={welcomeStyle.starterButton}
                onClick={onNext}
                disabled={!authStore.user}
            >
                <div className={welcomeStyle.starterButtonContent}>
                    Начать <img className={welcomeStyle.starterButtonIcon} src={ONBOARDING_ASSETS.continueArrow} alt="Arrow" loading="eager" decoding="async" />
                </div>
            </button>
            <div className={welcomeStyle.attempContainer}>
                <p className={welcomeStyle.attemp}>
                    Фото стилей и подписи к ним на текущем экране являются вымышленными и носят иллюстративный характер
                </p>
            </div>
        </div>
    );
};

export default WelcomeStep;
