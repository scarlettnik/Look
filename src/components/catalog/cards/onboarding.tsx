import {useCallback, useState} from 'react';
import styles from '../../ui/catalog/cards/tinderCards.module.css';
import { observer } from 'mobx-react-lite';
import {ONBOARDING_STEPS} from "../../../constants";

export const Onboarding = observer(({
                                        showOnboarding,
                                        onboardingStep,
                                        setOnboardingStep,
                                        simulateSwipe,
                                        isAnimating,
                                        handleSaveChanges,
                                        setUndoButtonHighlight,
                                        setSaveHighlight,
                                        setPopularHighlight
                                    }: any) => {
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
            setSaveHighlight(true);
        }
        if (onboardingStep === 5) {
            setSaveHighlight(false);
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
        setSaveHighlight,
        setPopularHighlight
    ]);

    if (!showOnboarding || onboardingStep === 0) return null;

    const currentStep = ONBOARDING_STEPS[onboardingStep];

    if (!currentStep) return null;

    return (
        <div className={styles.onboardingOverlay} role="dialog" aria-modal="true">
            {currentStep.images && currentStep.images.map((img, index) => (
                <img key={index} src={img.src} alt={img.alt} className={styles[img.className] ?? ''} />
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
