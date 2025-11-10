import { useEffect, useState } from 'react';
import styles from '../../ui/onboarding/onboardingModal.module.css';
import CustomCheckbox from "../../shared/customCheckbox";
import FullScreenButton from "../../shared/fullScreenButton";
import CustomSkeleton from "../../shared/customSkeleton";
import {CLOTH_STYLES} from "../../../constants";
import { PLACEHOLDER_ASSETS, UI_ICON_ASSETS } from "../../../lib/assets";
import ButtonWrapper from "../../shared/buttonWrapper";

const StylesStep = ({ selectedStyles, onUpdate, onNext, onSkip, onBack }: any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
            setIsLoading(false);
        }, 300);

        CLOTH_STYLES.forEach(style => {
            const img = new Image();
            img.src = style.url;
            img.onload = img.onerror = () => undefined;
        });

        return () => clearTimeout(timer);
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
                    <button
                            className={`${styles.backButton} ${styles.topLayerButton}`}
                            onClick={onBack}>
                        <img src={UI_ICON_ASSETS.arrowLeftLight} alt="Назад" />
                    </button>
                    <p className={styles.stepTitle}>Выберите стили</p>
                </div>

                <div className={styles.scrollContainer}>
                    <div className={styles.styleGrid}>
                        {Array.from({ length: Math.min(6, CLOTH_STYLES.length) }).map((_, index) => (
                            <CustomSkeleton
                                key={index}
                                className={`${styles.styleCard} ${styles.styleCardSkeleton}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.onboardingActions}>
                    <ButtonWrapper>
                        <FullScreenButton
                            variant='beige'
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

    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button className={`${styles.backButton} ${styles.topLayerButton}`} onClick={onBack}>
                    <img src={UI_ICON_ASSETS.arrowLeftLight} alt="Назад" />
                </button>
                <p className={styles.stepTitle}>Выберите стили</p>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.styleGrid}>
                    {CLOTH_STYLES.map(style => (
                        <div
                            key={style.id}
                            className={`${styles.styleCard} ${(!selectedStyles.includes(style.name) ? '' : styles.selected)}`}
                            onClick={() => handleCardClick(style.name)}
                        >
                            <div className={styles.styleImageWrapper}>
                                <img
                                    src={style.url}
                                    alt={style.name}
                                    className={styles.styleImage}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src = PLACEHOLDER_ASSETS.stylePreview;
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
                        variant='beige'
                        className={`${styles.onboardingButton} ${styles.primary}`}
                        onClick={onNext}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Вперед'}
                    </FullScreenButton>
                    <button
                        className={styles.secondaryButton}
                        onClick={onSkip}
                        disabled={isLoading}
                    >
                        Пропустить
                    </button>
                </ButtonWrapper>
            </div>
        </div>
    );
};

export default StylesStep;
