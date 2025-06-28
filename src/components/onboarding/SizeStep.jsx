import React, { useState, useEffect } from 'react';
import styles from '../ui/OnboardingModal.module.css';
import FullScreenButton from "../FullScrinButton.jsx";
import SizeGrid from "../SizeGrid.jsx";
import ParamsTab from "../ParamsTab.jsx";
import FitOptions from "../FitOptions.jsx";

const SizeStep = ({ selectedSize, onUpdate, onNext, onSkip, onBack }) => {
    const [activeTab, setActiveTab] = useState("size");
    const [pendingSize, setPendingSize] = useState(selectedSize);

    useEffect(() => {
        setPendingSize(selectedSize);
    }, [selectedSize]);

    const handleNext = () => {
        onUpdate({ size: pendingSize });
        onNext();
    };

    const  UpdateParem = (field, value) => {
        setPendingSize(prev => ({ ...prev, [field]: value }))
    }

    const handleFitChange = (event) => {
        setPendingSize(prev => ({
            ...prev,
            fit: event.target.value
        }));
    };

    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button
                    className={styles.backButton}
                    onClick={onBack}
                >
                    <img src='/public/subicons/whiteArrowLeft.svg' alt="Назад"/>
                </button>
                <p className={styles.stepTitle}>Выберите размер или параметры</p>
            </div>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === "size" ? styles.active : ''}`}
                    onClick={() => setActiveTab("size")}
                >
                    Размер
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "params" ? styles.active : ''}`}
                    onClick={() => setActiveTab("params")}
                >
                    Параметры
                </button>
            </div>
            <div className={styles.paramsBlock}>
                <div className={styles.tabContent}>
                    {activeTab === "size" && (
                        <SizeGrid
                            color='var(--ultralight-gray)'
                            params={pendingSize}
                            updateParam={UpdateParem}
                        />
                    )}

                    {activeTab === "params" && (
                        <ParamsTab
                            params={pendingSize}
                            updateParam={UpdateParem}
                        />
                    )}

                    <div className={styles.fitOptionsWrapper}>
                        <p>Ношу одежду</p>
                        <FitOptions
                            params={pendingSize}
                            updateParam={handleFitChange}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <FullScreenButton
                    color='var(--beige)'
                    textColor='var(--black)'
                    onClick={handleNext}
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
        </div>
    );
};

export default SizeStep;