import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { useAuth, useStore } from '../../app/providers/storeContext';
import { BRAND_ASSETS, ONBOARDING_ASSETS } from '../../lib/assets';
import { createPreferencesDraft } from '../../lib/preferences';

import AboutStep from './steps/aboutStep';
import Precompute from './steps/precompute';
import SizeStep from './steps/sizeStep';
import StylesStep from './steps/stylesStep';
import WelcomeStep from './steps/welcomeStep';
import styles from '../ui/onboarding/onboardingModal.module.css';

const OnboardingModal = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStore();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasUserEdits, setHasUserEdits] = useState(false);
  const [draftPreferences, setDraftPreferences] = useState(() =>
    createPreferencesDraft(authStore.preferences),
  );

  useEffect(() => {
    if (!hasUserEdits) {
      setDraftPreferences(createPreferencesDraft(authStore.preferences));
    }
  }, [authStore.preferences, hasUserEdits]);

  const persistPreferences = async () => {
    await authStore.savePreferences({
      clothing_size: draftPreferences.clothing_size,
      size_parameters: draftPreferences.size_parameters,
      wearing_styles: draftPreferences.wearing_styles,
      gender: draftPreferences.gender,
      age: draftPreferences.age,
      styles: draftPreferences.styles,
    });
  };

  const updateParam = (field, value) => {
    setHasUserEdits(true);

    if (['breast', 'waist', 'hip'].includes(field)) {
      setDraftPreferences((previousState) => ({
        ...previousState,
        size_parameters: {
          ...previousState.size_parameters,
          [field]: value,
        },
      }));
      return;
    }

    if (field === 'wearing_styles' || field === 'styles') {
      setDraftPreferences((previousState) => {
        const currentArray = previousState[field];
        const nextArray = currentArray.includes(value)
          ? currentArray.filter((currentValue) => currentValue !== value)
          : [...currentArray, value];

        return {
          ...previousState,
          [field]: nextArray,
        };
      });
      return;
    }

    setDraftPreferences((previousState) => ({
      ...previousState,
      [field]: value,
    }));
  };

  const goToNextStep = () => {
    if (authStore.preferences?.complete_onboarding) {
      navigate('/cards');
      return;
    }

    setCurrentStep((previousStep) => Math.min(previousStep + 1, 5));
  };

  const goBack = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 1));
  };

  const finishOnboarding = async () => {
    try {
      await persistPreferences();
      navigate('/cards');
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
    }
  };

  return (
    <div className={styles.onboardingModal}>
      <div className={styles.onboardingBackGround} aria-hidden="true">
        <img
          className={styles.onboardingBackGroundImage}
          src={ONBOARDING_ASSETS.backgroundImage}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className={styles.onboardingBackGroundOverlay} />
      </div>
      <img
        className={styles.logo}
        src={BRAND_ASSETS.logo}
        alt="Look"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className={styles.onboardingContent}>
        {currentStep === 1 && (
          <WelcomeStep
            userName={user?.first_name}
            userSername={user?.last_name}
            onNext={goToNextStep}
          />
        )}

        {currentStep === 2 && (
          <AboutStep
            age={draftPreferences.age}
            onUpdate={updateParam}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onSkip={finishOnboarding}
          />
        )}

        {currentStep === 3 && (
          <StylesStep
            selectedStyles={draftPreferences.styles}
            onUpdate={updateParam}
            onBack={goBack}
            onNext={() => setCurrentStep(4)}
            onSkip={finishOnboarding}
          />
        )}

        {currentStep === 4 && (
          <SizeStep
            params={draftPreferences}
            updateParam={updateParam}
            onNext={() => setCurrentStep(5)}
            onSkip={finishOnboarding}
            onBack={goBack}
          />
        )}

        {currentStep === 5 && (
          <Precompute
            params={draftPreferences}
            updateParam={updateParam}
            onNext={finishOnboarding}
            onSkip={finishOnboarding}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
});

export default OnboardingModal;
