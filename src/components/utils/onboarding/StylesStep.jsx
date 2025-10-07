import React, { useEffect, useState } from 'react';
import styles from '../../ui/OnboardingModal.module.css';
import CustomCheckbox from "../CustomCheckbox.jsx";
import FullScreenButton from "../FullScrinButton.jsx";
import CustomSkeleton from "../CustomSkeleton.jsx";
import {CLOTH_STYLES} from "../../../constants.js";
import ButtonWrapper from "../ButtonWrapper.jsx";

const StylesStep = ({ selectedStyles, onUpdate, onNext, onSkip, onBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {

        setShowContent(true);
        setIsLoading(false);
        }, []);

    const handleStyleToggle = (styleName) => {
        onUpdate('styles', styleName);
    };

    const handleCardClick = (styleName) => {
        handleStyleToggle(styleName);
    };

    if (!showContent) {
        return (
            <div className={styles.onboardingStep}>
                <div className={styles.stepHeader}>
                    <button style={{zIndex: 9999}}
                            className={styles.backButton}
                            onClick={onBack}>
                        <img src='/subicons/whitearrowleft.svg' alt="Назад" />
                    </button>
                    <p className={styles.stepTitle}>Выберите стили</p>
                </div>

                <div className={styles.scrollContainer}>
                    <div className={styles.styleGrid}>
                        {Array.from({ length: Math.min(6, CLOTH_STYLES.length) }).map((_, index) => (
                            <CustomSkeleton
                                key={index}
                                className={styles.styleCard}
                                style={{ height: '200px' }}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.onboardingActions}>
                    <ButtonWrapper>
                        <FullScreenButton
                            color='var(--beige)'
                            textColor='var(--black)'
                            className={`${styles.onboardingButton} ${styles.primary}`}
                            disabled={true}
                        >
                            Загрузка...
                        </FullScreenButton>
                        <button className={styles.secondaryButton} disabled>
                            Пропустить
                        </button>
                    </ButtonWrapper>
                </div>
            </div>
        );
    }

    // --- Контент отображается немедленно ---
    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button style={{zIndex: 9999}} className={styles.backButton} onClick={onBack}>
                    <img src='/subicons/whitearrowleft.svg' alt="Назад" />
                </button>
                <p className={styles.stepTitle}>Выберите стили</p>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.styleGrid}>
                    {CLOTH_STYLES.map(style => (
                        <div
                            key={style.id}
                            className={`${styles.styleCard} ${selectedStyles.includes(style.name) ? styles.selected : ''}`}
                            onClick={() => handleCardClick(style.name)}
                        >
                            <div style={{height: '250px'}}>
                                <img
                                    src={style.url}
                                    alt={style.name}
                                    className={styles.styleImage}

                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-style.jpg';
                                    }}
                                />
                            </div>
                            <div className={styles.styleContent}>
                                <CustomCheckbox
                                    className={styles.styleCheckbox}
                                    checked={selectedStyles.includes(style.name)}
                                    onChange={() => handleStyleToggle(style.name)}
                                />
                                <span className={styles.styleName}>{style.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.onboardingActions}>
                <ButtonWrapper>
                    <FullScreenButton
                        color='var(--beige)'
                        textColor='var(--black)'
                        className={`${styles.onboardingButton} ${styles.primary}`}
                        onClick={onNext}
                        disabled={false}
                    >
                        Вперед
                    </FullScreenButton>
                    <button
                        className={styles.secondaryButton}
                        onClick={onSkip}
                        disabled={false}
                    >
                        Пропустить
                    </button>
                </ButtonWrapper>
            </div>
        </div>
    );
};

export default StylesStep;