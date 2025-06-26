// components/onboarding/SizeStep.jsx
import React from 'react';
import styles from '../ui/OnboardingModal.module.css';


const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const SizeStep = ({ selectedSize, onUpdate, onNext, onSkip }) => {
    return (
        <div className="onboarding-step">
            <h2 className="step-title">Ваш размер</h2>
            <p className="step-description">Выберите наиболее подходящий размер одежды</p>

            <div className="size-grid">
                {sizes.map(size => (
                    <button
                        key={size}
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => onUpdate({ size })}
                    >
                        {size}
                    </button>
                ))}
            </div>

            <div className="onboarding-actions">
                <button
                    className="onboarding-button primary"
                    onClick={onNext}
                    disabled={!selectedSize}
                >
                    Завершить
                </button>
                <button
                    className="onboarding-button secondary"
                    onClick={onSkip}
                >
                    Пропустить
                </button>
            </div>
        </div>
    );
};

export default SizeStep;