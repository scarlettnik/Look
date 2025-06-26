// components/OnboardingModal.jsx
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../provider/StoreContext.jsx';
import { useAuth } from '../provider/AuthProvider.jsx';
import WelcomeStep from './onboarding/WelcomeStep';
import AboutStep from './onboarding/AboutStep';
import StylesStep from './onboarding/StylesStep';
import SizeStep from './onboarding/SizeStep';
import styles from './ui/OnboardingModal.module.css'

const OnboardingModal = observer(() => {
    const store = useStore();
    const auth = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        gender: 'female',
        age: 25,
        styles: [],
        size: ''
    });
    const [isClosed, setIsClosed] = useState(false);
    const updateUserData = (data) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 5));
    };

    const skipOnboarding = () => {
        store.onboarding.setOnboardingCompleted(true);
        setIsClosed(true);
    };

    if (store.onboarding.onboardingCompleted || isClosed) return null;
    
    return (
        <div className={styles.onboardingModal}>
            <div className={styles.onboardingBackGround}/>
            <img className={styles.logo} src='/logo.svg' alt='/logo.png'/>
            <div className={styles.onboardingContent}>

                {currentStep === 1 && (
                    <WelcomeStep
                        userName={auth.data?.first_name}
                        userSername = {auth.data?.last_name}
                        onNext={nextStep}
                    />
                )}

                {currentStep === 2 && (
                    <AboutStep
                        userData={userData}
                        onUpdate={updateUserData}
                        onNext={nextStep}
                        onSkip={skipOnboarding}
                    />
                )}

                {currentStep === 3 && (
                    <StylesStep
                        selectedStyles={userData.styles}
                        onUpdate={updateUserData}
                        onNext={nextStep}
                        onSkip={skipOnboarding}
                    />
                )}

                {currentStep === 4 && (
                    <SizeStep
                        selectedSize={userData.size}
                        onUpdate={updateUserData}
                        onNext={nextStep}
                        onSkip={skipOnboarding}
                    />
                )}
            </div>
        </div>
    );
});

export default OnboardingModal;