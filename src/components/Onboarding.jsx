import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './ui/TinderCards.module.css';
import { observer } from 'mobx-react-lite';

export const Onboarding = observer(({
                                        showOnboarding = true,
                                        onboardingStep,
                                        setOnboardingStep,
                                        simulateSwipe,
                                        isAnimating,
                                        handleSaveChanges,
                                        setUndoButtonHighlight,
                                        setsaveHighlight,
                                        setPopularHighlight
                                    }) => {
    const processingRef = useRef(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // debug: посмотреть что рендерится
        // console.log('Onboarding mount. showOnboarding=', showOnboarding, 'step=', onboardingStep);
    }, [showOnboarding, onboardingStep]);

    const handleNextOnboardingStep = useCallback(() => {
        if (processingRef.current) return;
        processingRef.current = true;
        setIsProcessing(true);

        // небольшой запас для анимаций — 1100ms / 1200ms в зависимости от шага
        const finishProcessingAfter = (ms = 1100) => {
            setTimeout(() => {
                processingRef.current = false;
                setIsProcessing(false);
            }, ms);
        };

        switch (onboardingStep) {
            case 1:
                setOnboardingStep(2);
                // запускаем свайп (без ожидания)
                simulateSwipe('left');
                finishProcessingAfter(1000);
                break;
            case 2:
                setOnboardingStep(3);
                simulateSwipe('right');
                finishProcessingAfter(1000);
                break;
            case 3:
                setOnboardingStep(4);
                simulateSwipe('up');
                setUndoButtonHighlight(true);
                finishProcessingAfter(1200);
                break;
            case 4:
                setOnboardingStep(5);
                setUndoButtonHighlight(false);
                setsaveHighlight(true);
                finishProcessingAfter(600);
                break;
            case 5:
                setOnboardingStep(6);
                setsaveHighlight(false);
                setPopularHighlight(true);
                finishProcessingAfter(600);
                break;
            case 6:
                setOnboardingStep(0);
                setPopularHighlight(false);
                // вызываем сохранение флага (родитель должен выключить showOnboarding)
                Promise.resolve()
                    .then(() => handleSaveChanges && handleSaveChanges())
                    .finally(() => finishProcessingAfter(500));
                break;
            default:
                setOnboardingStep(onboardingStep + 1);
                finishProcessingAfter(400);
        }
    }, [
        onboardingStep,
        setOnboardingStep,
        simulateSwipe,
        handleSaveChanges,
        setUndoButtonHighlight,
        setsaveHighlight,
        setPopularHighlight
    ]);

    // если компонент явно выключён — ничего не рендерим
    if (!showOnboarding || onboardingStep === 0) return null;

    const renderOnboardingStep = () => {
        switch (onboardingStep) {
            case 1:
                return (
                    <div className={styles.onboardingContent}>
                        <p className={styles.onboardingText}>
                            Привет! За пару кликов расскажем, как тут всё устроено.
                            Открыть карточку с деталями можно кликнув на неё.
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>1/6</p>
                            <button
                                className={styles.onboardingButton}
                                onClick={handleNextOnboardingStep}
                                disabled={isProcessing || isAnimating}
                            >
                                Далее
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.onboardingContent}>
                        <p className={styles.onboardingText}>
                            При свайпе влево карточка пропадает из ленты и подобные стили показываются реже.
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>2/6</p>
                            <button
                                className={styles.onboardingButton}
                                onClick={handleNextOnboardingStep}
                                disabled={isProcessing || isAnimating}
                            >
                                Далее
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <>
                        <img style={{position: 'fixed', left: '2vw', bottom: '220px', width: '30%', rotate: '-8deg'}} src='/arrow.svg' alt="arrow" />
                        <img
                            style={{
                                position: 'fixed',
                                right: '2vw',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '80px',
                                height: '80px',
                                zIndex: 1000001
                            }}
                            src='/subicons/darklike.svg'
                            alt="Лайк"
                        />
                        <div className={styles.onboardingContent}>
                            <p className={styles.onboardingText}>
                                При свайпе вправо карточка попадает в подборку и подобные стили показываются чаще.
                            </p>
                            <div className={styles.onboardingBlock}>
                                <p>3/6</p>
                                <button
                                    className={styles.onboardingButton}
                                    onClick={handleNextOnboardingStep}
                                    disabled={isProcessing || isAnimating}
                                >
                                    Далее
                                </button>
                            </div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <div className={styles.onboardingContent}>
                        <p className={styles.onboardingText}>
                            При свайпе вверх появляется новая карточка. Предыдущую можно найти, кликнув на иконку «Назад».
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>4/6</p>
                            <button
                                className={styles.onboardingButton}
                                onClick={handleNextOnboardingStep}
                                disabled={isProcessing || isAnimating}
                            >
                                Далее
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className={styles.onboardingContent}>
                        <p className={styles.onboardingText}>
                            Здесь можно найти все сохранённые карточки и создать свои подборки.
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>5/6</p>
                            <button
                                className={styles.onboardingButton}
                                onClick={handleNextOnboardingStep}
                                disabled={isProcessing || isAnimating}
                            >
                                Далее
                            </button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className={styles.onboardingContent}>
                        <p className={styles.onboardingText}>
                            А тут — подборки по стилям и направлениям. При нажатии на фото из подборки откроется карточка товара.
                        </p>
                        <div className={styles.onboardingBlock}>
                            <p>6/6</p>
                            <button
                                className={styles.onboardingButton}
                                onClick={handleNextOnboardingStep}
                                disabled={isProcessing || isAnimating}
                            >
                                Go on
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.onboardingOverlay} role="dialog" aria-modal="true">
            {renderOnboardingStep()}
        </div>
    );
});
