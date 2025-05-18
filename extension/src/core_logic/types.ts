
// User Profile and State Types
export interface UserProfile {
  userId: string;
  primaryGoal: string;
  userInterests: string[];
  hcProficiency: Record<string, number>;
  potentialBiases: Record<string, number>;
  createdAt: number;
}

export interface SJTScenarioOption {
  text: string;
  cognitiveBiasTargeted: string | null;
  cognitiveBiasTargetedScore?: number;
  isBetterThinking: boolean;
}

export interface SJTScenario {
  id: string;
  scenarioText: string;
  options: SJTScenarioOption[];
  biasExplanation: string;
  relatedInterests: string[];
}

export interface CompletedChallenge {
  timestamp: number;
  challengeText: string;
  hcRelated: string;
  wxpEarned: number;
}

export interface MindframeStoreState {
  version: string;
  profile: UserProfile | null;
  wxp: number;
  completedChallengeLog: CompletedChallenge[];
  completedDrillIds: string[];
  activeQuestIds: string[];
  sjtAnswersById: Record<string, number>;
}

export interface LLMInsight {
  pattern_type: string;
  hc_related: string | null;
  explanation: string;
  micro_challenge_prompt: string;
  highlight_suggestion_css_selector: string | null;
  original_text_segment: string;
}

export interface OfflineInsight extends Omit<LLMInsight, 'highlight_suggestion_css_selector'> {
  highlight_suggestion_css_selector?: string;
}
