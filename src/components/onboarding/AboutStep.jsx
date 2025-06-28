import React, {useEffect, useRef, useState} from 'react';
import styles from '../ui/aboutStep.module.css';
import FullScreenButton from "../FullScrinButton.jsx";
import titleStyle from '../ui/OnboardingModal.module.css'

const AboutStep = ({ userData, onUpdate, onNext, onSkip, onBack }) => {
    const { gender, age } = userData;
    const sliderRef = useRef(null);
    const [valuePosition, setValuePosition] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            const sliderWidth = sliderRef.current.offsetWidth;
            const min = 16;
            const max = 80;
            const thumbWidth = 20; // Ширина ползунка

            const ratio = (age - min) / (max - min);
            let position = ratio * (sliderWidth - thumbWidth);

            position = Math.max(thumbWidth/2, Math.min(position, sliderWidth - thumbWidth/2));

            setValuePosition(position);
        }
    }, [age]);

    return (
        <div className={styles.container}>
            <div className={titleStyle.stepHeader}>
                <button
                    className={titleStyle.backButton}
                    onClick={onBack}
                >
                    <img src='/public/subicons/whiteArrowLeft.svg' alt="Назад"/>
                </button>
                <p className={titleStyle.stepTitle}>Выберите пол и возрасты</p>
            </div>

            <div className={styles.genderContainer}>
                <button
                    className={`${styles.genderOption} ${gender === 'female' ? styles.selected : ''}`}
                    onClick={() => onUpdate({gender: 'female'})}
                >
                    Девушка
                </button>
                <button
                    className={`${styles.genderOption} ${gender === 'male' ? styles.selected : ''}`}
                    onClick={() => onUpdate({gender: 'male'})}
                    disabled={true}
                >
                    Пврень*
                </button>
                <p style={{fontSize: '8px', fontWeight: '400', color: 'var(--beige)'}}>
                    *В разработке
                </p>
            </div>

            <div className={styles.sliderWrapper} ref={sliderRef}>
                <input
                    type="range"
                    min="16"
                    max="80"
                    value={age}
                    onChange={(e) => onUpdate({age: e.target.value})}
                    className={styles.ageSlider}
                />
                <div
                    className={styles.ageValue}
                    style={{
                        left: `${age == 16 ? valuePosition : valuePosition + 10}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {age}
                </div>
            </div>


            <div className={styles.actions}>
                <FullScreenButton
                    color='var(--beige)'
                    textColor='var(--black)'
                    className={styles.primaryButton}
                    onClick={onNext}
                    disabled={!gender}
                >
                    Далее
                </FullScreenButton>
                <button
                    className={styles.secondaryButton}
                    onClick={onSkip}
                >
                    Войти без регистрации
                </button>
            </div>
        </div>
    );
};

export default AboutStep;
