
import MindframeStore from './MindframeStore.js';
import type { UserProfile, SJTScenario } from './types';

/**
 * Generates a UUID v4 string.
 * @returns {string}
 */
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

/**
 * Initializes the user's profile and stores it.
 * @param {string} primaryGoal
 * @param {string[]} userInterests
 * @param {Record<string, number>} hcProficiency
 * @param {Record<string, number>} sjtAnswersById
 * @param {SJTScenario[]} sjtScenariosData
 * @returns {Promise<void>}
 */
export async function initializeProfile(
  primaryGoal: string,
  userInterests: string[],
  hcProficiency: Record<string, number>,
  sjtAnswersById: Record<string, number>,
  sjtScenariosData: SJTScenario[]
): Promise<void> {
  const potentialBiases = calculatePotentialBiases(sjtAnswersById, sjtScenariosData);

  const profile: UserProfile = {
    userId: generateUUIDv4(),
    primaryGoal,
    userInterests,
    hcProficiency,
    potentialBiases,
    createdAt: Date.now()
  };

  await MindframeStore.update(currentState => ({
    profile,
    sjtAnswersById
  }));
}

/**
 * Calculates the aggregate potential biases for a user based on SJT answers.
 * @param {Record<string, number>} sjtAnswersById
 * @param {SJTScenario[]} sjtScenariosData
 * @returns {Record<string, number>} Accumulated bias scores by bias name
 */
function calculatePotentialBiases(
  sjtAnswersById: Record<string, number>,
  sjtScenariosData: SJTScenario[]
): Record<string, number> {
  const biasScores: Record<string, number> = {};

  for (const scenario of sjtScenariosData) {
    const selectedIndex = sjtAnswersById[scenario.id];
    if (typeof selectedIndex !== 'number') continue;
    const selectedOption = scenario.options[selectedIndex];
    if (!selectedOption) continue;

    const { cognitiveBiasTargeted, cognitiveBiasTargetedScore } = selectedOption;
    if (
      typeof cognitiveBiasTargeted === 'string' &&
      cognitiveBiasTargeted &&
      typeof cognitiveBiasTargetedScore === 'number' &&
      cognitiveBiasTargetedScore > 0
    ) {
      biasScores[cognitiveBiasTargeted] = (biasScores[cognitiveBiasTargeted] || 0) + cognitiveBiasTargetedScore;
    }
  }

  return biasScores;
}

/**
 * Updates the stored user profile with partial updates.
 * @param {Partial<UserProfile>} updates
 * @returns {Promise<void>}
 */
export async function updateProfile(
  updates: Partial<UserProfile>
): Promise<void> {
  await MindframeStore.update(currentState => ({
    profile: currentState.profile ? { ...currentState.profile, ...updates } : null
  }));
}

/**
 * Clears the user profile and all store state.
 * @returns {Promise<void>}
 */
export async function resetProfile(): Promise<void> {
  await MindframeStore.clear();
}
