// components/onboarding/AboutStep.jsx
import React from 'react';
import styles from '../ui/OnboardingModal.module.css';

const AboutStep = ({ userData, onUpdate, onNext, onSkip }) => {
    const { gender, age } = userData;

    return (
        <div className={styles.onboardingStep}>
            <h2 className={styles.stepTitle}>Выберите пол и возраст</h2>

            <div className="gender-selection">
                <button
                    className={`gender-button ${gender === 'female' ? 'selected' : ''}`}
                    onClick={() => onUpdate({gender: 'female'})}
                >
                    Женщина
                </button>
                <button
                    className={`gender-button ${gender === 'male' ? 'selected' : ''}`}
                    onClick={() => onUpdate({gender: 'male'})}
                >
                    Мужчина
                </button>

            </div>

            <div className="age-slider">
                <label className="slider-label">Возраст: {age}</label>
                <input
                    type="range"
                    min="16"
                    max="80"
                    value={age}
                    onChange={(e) => onUpdate({ age: e.target.value })}
                    className="slider-input"
                />
            </div>

            <div className="onboarding-actions">
                <button
                    className="onboarding-button primary"
                    onClick={onNext}
                    disabled={!gender}
                >
                    Далее
                </button>
                <button
                    className="onboarding-button secondary"
                    onClick={onSkip}
                >
                    Пропустить регистрацию
                </button>
            </div>
        </div>
    );
};

export default AboutStep;