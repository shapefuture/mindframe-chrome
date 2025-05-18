
import React, { useEffect } from 'react';
import type { LLMInsight, OfflineInsight } from '../core_logic/types';

interface InsightCardProps {
  insight: LLMInsight | OfflineInsight;
  onAccept: (challengePrompt: string, hcRelated: string | null) => void;
  onDismiss: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onAccept, onDismiss }) => {
  useEffect(() => {
    console.debug('[InsightCard] Mounted with insight:', insight);
    return () => {
      console.debug('[InsightCard] Unmounted');
    };
  }, [insight]);

  const handleAccept = () => {
    console.debug('[InsightCard] User clicked Accept Challenge', {
      challengePrompt: insight.micro_challenge_prompt,
      hcRelated: insight.hc_related,
    });
    try {
      onAccept(insight.micro_challenge_prompt, insight.hc_related ?? null);
    } catch (err) {
      console.error('[InsightCard] Error in onAccept callback:', err);
    }
  };

  const handleDismiss = () => {
    console.debug('[InsightCard] User clicked Dismiss');
    try {
      onDismiss();
    } catch (err) {
      console.error('[InsightCard] Error in onDismiss callback:', err);
    }
  };

  let hcIcon = null;
  if (insight.hc_related) {
    // For expanded logging, log which HC icon we (would) display
    // You could map this to icons from hcLibrary if desired
    hcIcon = <span className="text-2xl mr-2">{/* icon placeholder */}</span>;
    console.debug('[InsightCard] Would display icon for HC:', insight.hc_related);
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm border border-gray-200">
      <div className="flex items-center mb-2">
        {hcIcon}
        <span className="font-semibold text-lg">{insight.pattern_type}</span>
      </div>
      <div className="mb-2 text-gray-700">{insight.explanation}</div>
      <div className="mb-2 font-medium">Challenge:</div>
      <div className="mb-4">{insight.micro_challenge_prompt}</div>
      <div className="flex justify-end space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          onClick={handleAccept}
        >
          Accept Challenge
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300 transition"
          onClick={handleDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default InsightCard;
