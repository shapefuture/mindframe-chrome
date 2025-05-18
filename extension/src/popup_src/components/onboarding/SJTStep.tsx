
import React, { useState } from 'react';
import type { SJTScenario } from '../../../core_logic/types';
import { sjtScenarios } from '../../../assets/data/sjt_scenarios_data';

interface SJTStepProps {
  onNext: () => void;
  onBack: () => void;
  onAnswersChange: (answers: Record<string, number>) => void;
  answers: Record<string, number>;
}

const SJTStep: React.FC<SJTStepProps> = ({ onNext, onBack, onAnswersChange, answers }) => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);

  const handleAnswer = (scenarioId: string, optionIndex: number) => {
    const newAnswers = { ...answers, [scenarioId]: optionIndex };
    onAnswersChange(newAnswers);
    
    if (currentScenario < sjtScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    }
  };

  const scenario = sjtScenarios[currentScenario];

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Scenario {currentScenario + 1} of {sjtScenarios.length}
      </h2>
      
      <div className="mb-6">
        <p className="mb-4">{scenario.scenarioText}</p>
        
        <div className="space-y-3">
          {scenario.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(scenario.id, index)}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 border rounded-lg"
        >
          Back
        </button>
        
        {currentScenario === sjtScenarios.length - 1 && (
          <button
            onClick={onNext}
            disabled={Object.keys(answers).length < sjtScenarios.length}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default SJTStep;
