
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import SJTStep from '../components/onboarding/SJTStep';
import InterestsStep from '../components/onboarding/InterestsStep';
import { initializeProfile } from '../../core_logic/onboardingLogic';
import { sjtScenarios } from '../../assets/data/sjt_scenarios_data';

const OnboardingView: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [sjtAnswers, setSjtAnswers] = useState<Record<string, number>>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleComplete = async () => {
    try {
      await initializeProfile(
        primaryGoal,
        selectedInterests,
        {},  // Initial HC proficiency starts empty
        sjtAnswers,
        sjtScenarios
      );
      navigate('/profile');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {step === 0 && (
        <WelcomeStep
          onNext={() => setStep(1)}
          onPrimaryGoalChange={setPrimaryGoal}
          primaryGoal={primaryGoal}
        />
      )}
      
      {step === 1 && (
        <SJTStep
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          onAnswersChange={setSjtAnswers}
          answers={sjtAnswers}
        />
      )}
      
      {step === 2 && (
        <InterestsStep
          onNext={handleComplete}
          onBack={() => setStep(1)}
          onInterestsChange={setSelectedInterests}
          selectedInterests={selectedInterests}
        />
      )}
    </div>
  );
};

export default OnboardingView;
