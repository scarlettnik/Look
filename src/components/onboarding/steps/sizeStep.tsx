import { useState } from 'react';
import styles from '../../ui/onboarding/onboardingModal.module.css';
import FullScreenButton from "../../shared/fullScreenButton";
import ButtonWrapper from "../../shared/buttonWrapper";
import SizeGrid from "../../profile/sizeControls/sizeGrid";
import ParamsTab from "../../profile/sizeControls/paramsTab";
import FitOptions from "../../profile/sizeControls/fitOptions";
import useIsKeyboardOpen from "../../../hooks/useIsKeyboardOpen";
import { UI_ICON_ASSETS } from "../../../lib/assets";

const SizeStep = ({ params, updateParam, onNext, onSkip, onBack }: any) => {
    const [activeTab, setActiveTab] = useState("size");

    const isKeyboardOpen = useIsKeyboardOpen();

    const handleNext = () => {
        onNext();
    };

    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button
                    className={`${styles.backButton} ${styles.topLayerButton}`}
                    onClick={onBack}
                >
                    <img src={UI_ICON_ASSETS.arrowLeftLight} alt="Назад"/>
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
            <div className={`${styles.paramsBlock} ${styles.sizeStepParamsBlock}`}>
                <div className={`${styles.tabContent} ${styles.sizeStepTabContent}`}>
                    {activeTab === "size" && (
                        <div className={styles.sizeStepPrimaryPanel}>
                            <SizeGrid
                                tone='muted'
                                params={params}
                                updateParam={updateParam}
                            />
                        </div>
                    )}

                    {activeTab === "params" && (
                        <div className={styles.sizeStepPrimaryPanel}>
                            <ParamsTab
                                compact={true}
                                params={params}
                                updateParam={updateParam}
                            />
                        </div>
                    )}

                    <div className={`${styles.fitOptionsWrapper} ${styles.fitOptionsWrapperWide} ${styles.sizeStepFitOptionsWrapper}`}>
                        <p className={styles.text}>Ношу одежду</p>
                        <FitOptions
                            params={params}
                            updateParam={(value) => updateParam('wearing_styles', value)}
                        />
                    </div>
                </div>
            </div>

            <ButtonWrapper className={styles.bottomActionsDock}>
                <div className={styles.actions}>
                    <FullScreenButton
                        variant='beige'
                        onClick={handleNext}
                    >
                        Далее
                    </FullScreenButton>
                    {!isKeyboardOpen &&
                        <button
                            className={styles.secondaryButton}
                            onClick={onSkip}
                        >
                            Пропустить
                        </button>
                    }
                </div>
            </ButtonWrapper>
        </div>
    );
};

export default SizeStep;
