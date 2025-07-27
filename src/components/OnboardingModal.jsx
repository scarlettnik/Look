import SizeStep from "./onboarding/SizeStep.jsx";
import StylesStep from "./onboarding/StylesStep.jsx";
import AboutStep from "./onboarding/AboutStep.jsx";
import WelcomeStep from "./onboarding/WelcomeStep.jsx";
import {useStore} from "../provider/StoreContext.jsx";
import {useAuth} from "../provider/AuthProvider.jsx";
import {useState} from "react";
import styles from './ui/OnboardingModal.module.css'
import {observer} from "mobx-react";
import {useNavigate} from "react-router-dom";

const OnboardingModal = observer(() => {
    const store = useStore();
    const auth = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        gender: 'female',
        age: 25,
        styles: [],
        size: {
            size: "",
            bust: 90,
            waist: 63,
            hip: 92,
            fit: "true",
        }
    });

    console.log(userData)
    const navigate = useNavigate()

    const [isClosed, setIsClosed] = useState(false);

    const updateUserData = (data) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };


    const skipOnboarding = () => {
        store.onboarding.setOnboardingCompleted(true);
        setIsClosed(true);
    };

    const completeOnboarding = () => {
        store.onboarding.setOnboardingCompleted(true);
        setIsClosed(true);
        navigate('/cards')
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
                        userSername={auth.data?.last_name}
                        onNext={nextStep}
                    />
                )}

                {currentStep === 2 && (
                    <AboutStep
                        userData={userData}
                        onUpdate={updateUserData}
                        onNext={nextStep}
                        onBack={prevStep}
                        onSkip={skipOnboarding}
                    />
                )}

                {currentStep === 3 && (
                    <StylesStep
                        selectedStyles={userData.styles}
                        onUpdate={updateUserData}
                        onBack={prevStep}
                        onNext={nextStep}
                        onSkip={skipOnboarding}
                    />
                )}

                {currentStep === 4 && (
                    <SizeStep
                        selectedSize={userData.size}
                        onUpdate={updateUserData}
                        onNext={completeOnboarding}
                        onSkip={skipOnboarding}
                        onBack={prevStep}

                    />
                )}
            </div>
        </div>
    );
});
export default OnboardingModal;