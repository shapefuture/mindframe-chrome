
import React from 'react';
import type { LLMInsight, OfflineInsight } from '../core_logic/types';
import { hcLibrary } from '../assets/data/hc_library_data';

interface InsightCardProps {
  insight: LLMInsight | OfflineInsight;
  onAccept: (challengePrompt: string, hcRelated: string | null) => void;
  onDismiss: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onAccept, onDismiss }) => {
  const hcItem = insight.hc_related 
    ? hcLibrary.find(item => item.id === insight.hc_related)
    : null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {hcItem && (
            <span className="text-2xl" title={hcItem.name}>
              {hcItem.icon}
            </span>
          )}
          <h3 className="font-medium">Mindframe Insight</h3>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">{insight.explanation}</p>
        <div className="bg-blue-50 p-3 rounded">
          <p className="font-medium">Challenge:</p>
          <p>{insight.micro_challenge_prompt}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onDismiss}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
        >
          Dismiss
        </button>
        <button
          onClick={() => onAccept(insight.micro_challenge_prompt, insight.hc_related)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Accept Challenge
        </button>
      </div>
    </div>
  );
};

export default InsightCard;
