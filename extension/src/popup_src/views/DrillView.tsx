
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GamificationService from '../../core_logic/gamificationService';
import { hcLibrary } from '../../assets/data/hc_library_data';

interface DrillQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Drill {
  id: string;
  hcId: string;
  title: string;
  description: string;
  questions: DrillQuestion[];
}

// Mock drill data - in real app, this would come from your data files
const mockDrill: Drill = {
  id: "drill_critical_thinking_basics",
  hcId: "critical_thinking",
  title: "Critical Thinking Basics",
  description: "Test your understanding of critical thinking fundamentals",
  questions: [
    {
      id: "q1",
      question: "What is the first step in critical thinking?",
      options: [
        "Making a decision",
        "Identifying assumptions",
        "Gathering information",
        "Drawing conclusions"
      ],
      correctIndex: 2,
      explanation: "Gathering relevant information is the foundation of critical thinking."
    }
    // Add more questions as needed
  ]
};

const DrillView: React.FC = () => {
  const { drillId } = useParams<{ drillId: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const drill = mockDrill; // In real app, fetch based on drillId
  const question = drill.questions[currentQuestion];
  const hc = hcLibrary.find(h => h.id === drill.hcId);

  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === question.correctIndex && currentQuestion === drill.questions.length - 1) {
      await GamificationService.completeDrill(drill.id);
      setCompleted(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < drill.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {hc && <span className="text-2xl">{hc.icon}</span>}
          <h1 className="text-2xl font-bold">{drill.title}</h1>
        </div>
        <p className="text-gray-600">{drill.description}</p>
      </div>

      {!completed ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-medium mb-4">
              Question {currentQuestion + 1} of {drill.questions.length}
            </h2>
            <p className="mb-4">{question.question}</p>

            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-3 text-left border rounded-lg ${
                    selectedAnswer === index
                      ? index === question.correctIndex
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p>{question.explanation}</p>
                {currentQuestion < drill.questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Next Question
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Drill Completed!</h2>
          <p className="mb-4">You've successfully completed this drill.</p>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Return to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default DrillView;
