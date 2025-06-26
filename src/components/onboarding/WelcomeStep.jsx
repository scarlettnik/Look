// components/onboarding/WelcomeStep.jsx
import React from 'react';
import styles from '../ui/OnboardingModal.module.css';
import welcomstyle from '../ui/welcomStyle.module.css'

const WelcomeStep = ({ userName, userSername, onNext }) => {
    return (
        <div className={styles.onboardingStep}>
            <p className={welcomstyle.onBoardingTitle}>Добро пожаловать{userName && ','} <br/> {userName} {userSername}!</p>
            <img className={welcomstyle.image} src='/starterscroller.png'/>
            <img className={welcomstyle.prevImage} src='/starterscroller2.png'/>
            <button
                className={welcomstyle.starterButton}
                onClick={onNext}
            >
                Начать
            </button>
        </div>
    );
};

export default WelcomeStep;