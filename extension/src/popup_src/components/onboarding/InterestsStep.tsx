
import React from 'react';
import { hcLibrary } from '../../../assets/data/hc_library_data';

interface InterestsStepProps {
  onNext: () => void;
  onBack: () => void;
  onInterestsChange: (interests: string[]) => void;
  selectedInterests: string[];
}

const InterestsStep: React.FC<InterestsStepProps> = ({
  onNext,
  onBack,
  onInterestsChange,
  selectedInterests
}) => {
  const toggleInterest = (id: string) => {
    const newInterests = selectedInterests.includes(id)
      ? selectedInterests.filter(i => i !== id)
      : [...selectedInterests, id];
    onInterestsChange(newInterests);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Select Your Interests</h2>
      <p className="mb-6 text-gray-600">
        Choose the areas you'd like to focus on improving.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {hcLibrary.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleInterest(item.id)}
            className={`p-4 border rounded-lg text-left ${
              selectedInterests.includes(item.id) ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <span className="text-2xl mb-2">{item.icon}</span>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 border rounded-lg"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default InterestsStep;
