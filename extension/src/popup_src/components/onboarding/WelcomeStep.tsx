
import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
  onPrimaryGoalChange: (goal: string) => void;
  primaryGoal: string;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onPrimaryGoalChange, primaryGoal }) => {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to MINDFRAME OS</h1>
      <p className="mb-6 text-gray-600">
        Your personal cognitive evolution companion. Let's start by understanding your primary goal.
      </p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          What's your primary goal for using MINDFRAME OS?
        </label>
        <select
          value={primaryGoal}
          onChange={(e) => onPrimaryGoalChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select a goal...</option>
          <option value="improve_thinking">Improve Critical Thinking</option>
          <option value="better_decisions">Make Better Decisions</option>
          <option value="reduce_biases">Reduce Cognitive Biases</option>
          <option value="learn_systems">Learn Systems Thinking</option>
        </select>
      </div>

      <button
        onClick={onNext}
        disabled={!primaryGoal}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
};

export default WelcomeStep;
