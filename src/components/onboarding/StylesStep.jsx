import React from 'react';
import styles from '../ui/OnboardingModal.module.css';
import CustomCheckbox from "../CustomCheckbox";
import FullScreenButton from "../FullScrinButton.jsx";

const ClothStyles = [
    { id: 1, name: "Классический", url: '/public/styleReference.png' },
    { id: 2, name: "Спортивный", url: '/public/styleReference.png' },
    { id: 3, name: "Повседневный", url: '/public/styleReference.png' },
    { id: 4, name: "Деловой", url: '/public/styleReference.png' },
    { id: 5, name: "Уличный", url: '/public/styleReference.png' },
    { id: 6, name: "Вечерний", url: '/public/styleReference.png' },
];

const StylesStep = ({ selectedStyles, onUpdate, onNext, onSkip, onBack }) => {
    const handleStyleToggle = (styleId) => {
        const newStyles = selectedStyles.includes(styleId)
            ? selectedStyles.filter(id => id !== styleId)
            : [...selectedStyles, styleId];
        onUpdate({ styles: newStyles });
    };

    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button
                    className={styles.backButton}
                    onClick={onBack}
                >
                    <img src='/subicons/whitearrowleft.svg' alt="Назад"/>
                </button>
                <p className={styles.stepTitle}>Выберите стили</p>
            </div>
            <div className={styles.scrollContainer}>
                <div className={styles.styleGrid}>
                    {ClothStyles.map(style => (
                        <div
                            key={style.id}
                            className={`${styles.styleCard} ${selectedStyles.includes(style.id) ? styles.selected : ''}`}
                        >
                            <img src={style.url} alt={style.name} className={styles.styleImage}/>
                            <div className={styles.styleContent}>
                                <CustomCheckbox
                                    checked={selectedStyles.includes(style.id)}
                                    onChange={() => handleStyleToggle(style.id)}
                                />
                                <span className={styles.styleName}>{style.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.onboardingActions}>
                <FullScreenButton
                    color='var(--beige)'
                    textColor='var(--black)'
                    className={`${styles.onboardingButton} ${styles.primary}`}
                    onClick={onNext}
                >
                    Вперед
                </FullScreenButton>
                <button
                    className={styles.secondaryButton}
                    onClick={onSkip}
                >
                    Пропустить
                </button>
            </div>
        </div>
    );
};

export default StylesStep;