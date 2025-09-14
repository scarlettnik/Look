import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './ui/TinderCards.module.css';
import { observer } from 'mobx-react-lite';

// Создаем объект с данными для каждого шага онбординга.
// Это делает код чище и проще для изменений.
const ONBOARDING_STEPS = {
    1: {
        text: 'Привет! За пару кликов расскажем, как тут всё устроено. Открыть карточку с деталями можно кликнув на неё.',
        page: '1/6',
        swipe: 'left',
    },
    2: {
        text: 'При свайпе влево карточка пропадает из ленты и подобные стили показываются реже.',
        page: '2/6',
        swipe: 'right',
        images: [
            { src: '/arrowleft.svg', alt: 'arrow', style: { position: 'fixed', right: '2vw', bottom: '220px', width: '30%', rotate: '8deg' } },
            { src: '/subicons/darkdislike.svg', alt: 'Дизайк', style: { position: 'fixed', left: '2vw', top: '50%', transform: 'translateY(-50%)', width: '80px', height: '80px', zIndex: 1000001 } }
        ]
    },
    3: {
        text: 'При свайпе вправо карточка попадает в подборку и подобные стили показываются чаще.',
        page: '3/6',
        swipe: 'up',
        images: [
            { src: '/arrow.svg', alt: 'arrow', style: { position: 'fixed', left: '2vw', bottom: '220px', width: '30%', rotate: '-8deg' } },
            { src: '/subicons/darklike.svg', alt: 'Лайк', style: { position: 'fixed', right: '2vw', top: '50%', transform: 'translateY(-50%)', width: '80px', height: '80px', zIndex: 1000001 } }
        ],
    },
    4: {
        swipe: 'down',
        text: 'При свайпе вверх появляется новая карточка. Предыдущую можно найти, кликнув на иконку «Назад».',
        page: '4/6',
        images: [
            { src: '/arrowup.svg', alt: 'arrow', style: { position: 'fixed', left: '2vw', bottom: '220px', width: '20%', rotate: '-8deg' } },
        ]
    },
    5: {
        text: 'Здесь можно найти все сохранённые карточки и создать свои подборки.',
        page: '5/6',
    },
    6: {
        text: 'А тут — подборки по стилям и направлениям. При нажатии на фото из подборки откроется карточка товара.',
        page: '6/6',
    },
};

export const Onboarding = observer(({
                                        showOnboarding,
                                        onboardingStep,
                                        setOnboardingStep,
                                        simulateSwipe,
                                        isAnimating,
                                        handleSaveChanges,
                                        setUndoButtonHighlight,
                                        setsaveHighlight,
                                        setPopularHighlight
                                    }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleNextOnboardingStep = useCallback(async () => {
        if (isProcessing || isAnimating) return;
        setIsProcessing(true);

        const currentStepData = ONBOARDING_STEPS[onboardingStep];

        if (currentStepData?.swipe) {
            await simulateSwipe(currentStepData.swipe);
        }

        if (onboardingStep === 3) setUndoButtonHighlight(true);
        if (onboardingStep === 4) {
            setUndoButtonHighlight(false);
            setsaveHighlight(true);
        }
        if (onboardingStep === 5) {
            setsaveHighlight(false);
            setPopularHighlight(true);
        }

        const nextStep = onboardingStep + 1;

        if (nextStep in ONBOARDING_STEPS) {
            setOnboardingStep(nextStep);
        } else {
            setPopularHighlight(false);
            if (handleSaveChanges) {
                await handleSaveChanges();
            }
            setOnboardingStep(0);
        }

        setIsProcessing(false);
    }, [
        onboardingStep,
        isProcessing,
        isAnimating,
        simulateSwipe,
        setOnboardingStep,
        handleSaveChanges,
        setUndoButtonHighlight,
        setsaveHighlight,
        setPopularHighlight
    ]);

    if (!showOnboarding || onboardingStep === 0) return null;

    const currentStep = ONBOARDING_STEPS[onboardingStep];

    if (!currentStep) return null;

    return (
        <div className={styles.onboardingOverlay} role="dialog" aria-modal="true">
            {currentStep.images && currentStep.images.map((img, index) => (
                <img key={index} src={img.src} alt={img.alt} style={img.style} />
            ))}
            <div className={styles.onboardingContent}>
                <p className={styles.onboardingText}>{currentStep.text}</p>
                <div className={styles.onboardingBlock}>
                    <p>{currentStep.page}</p>
                    <button
                        className={styles.onboardingButton}
                        onClick={handleNextOnboardingStep}
                        // disabled={isProcessing || isAnimating}
                    >
                        {onboardingStep === 6 ? 'Go on' : 'Далее'}
                    </button>
                </div>
            </div>
        </div>
    );
});