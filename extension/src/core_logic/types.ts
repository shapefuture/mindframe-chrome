
/**
 * User profile for MINDFRAME OS.
 * @typedef {Object} UserProfile
 * @property {string} userId - Unique user identifier (UUID v4).
 * @property {string} primaryGoal - User's main cognitive goal (e.g., "improve_thinking").
 * @property {string[]} userInterests - List of high-level cognitive interests.
 * @property {Record<string, number>} hcProficiency - Map of higher-cognitive skill IDs to proficiency levels.
 * @property {Record<string, number>} potentialBiases - Map of bias names to aggregate bias score.
 * @property {number} createdAt - Timestamp of profile creation (ms since epoch).
 */
export interface UserProfile {
  userId: string;
  primaryGoal: string;
  userInterests: string[];
  hcProficiency: Record<string, number>;
  potentialBiases: Record<string, number>;
  createdAt: number;
}

/**
 * An answer option for a Situational Judgment Test (SJT) scenario.
 * @typedef {Object} SJTScenarioOption
 * @property {string} text - Option text shown to the user.
 * @property {string | null} cognitiveBiasTargeted - Name of the cognitive bias targeted (e.g., "Confirmation Bias"). Null if N/A.
 * @property {number | undefined} cognitiveBiasTargetedScore - Score for selecting this option (e.g., 0, 1, 2). 0 or undefined if not applicable.
 * @property {boolean} isBetterThinking - Whether this option reflects better thinking strategy.
 */
export interface SJTScenarioOption {
  text: string;
  cognitiveBiasTargeted: string | null;
  cognitiveBiasTargetedScore?: number;
  isBetterThinking: boolean;
}

/**
 * A single SJT scenario, including its answer options and bias explanation.
 * @typedef {Object} SJTScenario
 * @property {string} id - Unique scenario ID.
 * @property {string} scenarioText - Main scenario prompt.
 * @property {SJTScenarioOption[]} options - Array of answer options.
 * @property {string} biasExplanation - Explanation of the bias(es) targeted.
 * @property {string[]} relatedInterests - IDs of related higher-order cognitive interests.
 */
export interface SJTScenario {
  id: string;
  scenarioText: string;
  options: SJTScenarioOption[];
  biasExplanation: string;
  relatedInterests: string[];
}

/**
 * Log entry for a completed micro-challenge.
 * @typedef {Object} CompletedChallenge
 * @property {number} timestamp - When the challenge was completed (ms since epoch).
 * @property {string} challengeText - The challenge prompt.
 * @property {string} hcRelated - Related higher-cognitive skill.
 * @property {number} wxpEarned - Wisdom XP earned.
 */
export interface CompletedChallenge {
  timestamp: number;
  challengeText: string;
  hcRelated: string;
  wxpEarned: number;
}

/**
 * Main persistent state for the extension.
 * @typedef {Object} MindframeStoreState
 * @property {string} version - Store schema version.
 * @property {UserProfile | null} profile - User profile.
 * @property {number} wxp - Wisdom XP.
 * @property {CompletedChallenge[]} completedChallengeLog - Last 20 completed challenges.
 * @property {string[]} completedDrillIds - IDs of completed drills.
 * @property {string[]} activeQuestIds - IDs of currently active quests.
 * @property {Record<string, number>} sjtAnswersById - Map of SJT scenario IDs to chosen option index.
 */
export interface MindframeStoreState {
  version: string;
  profile: UserProfile | null;
  wxp: number;
  completedChallengeLog: CompletedChallenge[];
  completedDrillIds: string[];
  activeQuestIds: string[];
  sjtAnswersById: Record<string, number>;
}

/**
 * LLM-generated insight for display in the InsightCard.
 * @typedef {Object} LLMInsight
 * @property {string} pattern_type - Name of the cognitive pattern or bias detected.
 * @property {string | null} hc_related - Related higher-order cognitive skill (e.g., "critical_thinking") or null.
 * @property {string} explanation - Explanation for the detected pattern.
 * @property {string} micro_challenge_prompt - Micro-challenge prompt for the user.
 * @property {string | null} highlight_suggestion_css_selector - CSS selector for highlighting relevant text, if any.
 * @property {string} original_text_segment - The analyzed text segment.
 */
export interface LLMInsight {
  pattern_type: string;
  hc_related: string | null;
  explanation: string;
  micro_challenge_prompt: string;
  highlight_suggestion_css_selector: string | null;
  original_text_segment: string;
}

/**
 * Offline fallback insight; same as LLMInsight but highlight_suggestion_css_selector is optional.
 * @typedef {Object} OfflineInsight
 * @property {string} pattern_type
 * @property {string | null} hc_related
 * @property {string} explanation
 * @property {string} micro_challenge_prompt
 * @property {string} [highlight_suggestion_css_selector]
 * @property {string} original_text_segment
 */
export interface OfflineInsight extends Omit<LLMInsight, 'highlight_suggestion_css_selector'> {
  highlight_suggestion_css_selector?: string;
}

/**
 * Higher-order Cognitive Skill library entry.
 * @typedef {Object} HCData
 * @property {string} id - Unique skill ID (e.g., "critical_thinking").
 * @property {string} name - Display name.
 * @property {string} description - Short description.
 * @property {string} icon - Emoji or icon string.
 */
export interface HCData {
  id: string;
  name: string;
  description: string;
  icon: string;
}
