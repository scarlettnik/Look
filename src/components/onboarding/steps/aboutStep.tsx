import {useEffect, useRef} from 'react';
import styles from '../../ui/onboarding/steps/aboutStep.module.css';
import FullScreenButton from "../../shared/fullScreenButton";
import ButtonWrapper from "../../shared/buttonWrapper";
import titleStyle from '../../ui/onboarding/onboardingModal.module.css'
import { UI_ICON_ASSETS } from '../../../lib/assets';

const AboutStep = ({ age, onUpdate, onNext, onSkip, onBack }: any) => {
    const sliderRef = useRef<any>(null);
    const handleBack = (e) => {
        e.stopPropagation();
        onBack();
    };

    useEffect(() => {
        if (sliderRef.current) {
            const sliderWidth = sliderRef.current.offsetWidth * 0.96;
            const min = 16;
            const max = 80;
            const thumbSize = 20;

            const ratio = (age - min) / (max - min);

            const position = ratio * (sliderWidth - thumbSize) + (thumbSize / 2);

            sliderRef.current.style.setProperty('--age-indicator-left', `${position}px`);
        }
    }, [age]);

    return (
        <div className={styles.container}>
            <div className={titleStyle.stepHeader}>
                <button
                    className={`${titleStyle.backButton} ${titleStyle.topLayerButton}`}
                    onClick={handleBack}
                >
                    <img src={UI_ICON_ASSETS.arrowLeftLight} alt="Назад"/>
                </button>
                <p className={titleStyle.stepTitle}>Выберите пол и возраст</p>
            </div>

            <div className={styles.centeredContent}>
                <div className={styles.genderContainer}>
                    <button
                        className={`${styles.genderOption} ${styles.selected}`}
                        onClick={() => onUpdate('gender', 'female')}
                    >
                        Девушка
                    </button>
                    <button
                        className={`${styles.genderOption}`}
                        onClick={() => onUpdate('gender', 'male')}
                        disabled={true}
                    >
                        Парень*
                    </button>
                    <p className={styles.helperText}>
                        *В разработке
                    </p>
                </div>

                <div className={styles.sliderWrapper} ref={sliderRef}>
                    <input
                        type="range"
                        min="16"
                        max="80"
                        value={age}
                        onChange={(e) => onUpdate('age', Number(e.target.value))}
                        className={styles.ageSlider}
                    />
                    <div
                        className={styles.ageValue}
                    >
                        {age}
                    </div>
                </div>
            </div>

            <ButtonWrapper className={titleStyle.bottomActionsDock}>
                <div className={styles.actions}>
                    <FullScreenButton
                        variant='beige'
                        className={styles.primaryButton}
                        onClick={onNext}
                    >
                        Далее
                    </FullScreenButton>
                        <button
                            className={styles.secondaryButton}
                            onClick={onSkip}
                        >
                            Пропустить
                        </button>
                </div>
            </ButtonWrapper>
        </div>
    );
};

export default AboutStep;
