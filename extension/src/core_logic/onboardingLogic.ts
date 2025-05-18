
import MindframeStore from './MindframeStore.js';
import type { UserProfile, SJTScenario } from './types';

/**
 * Generates a UUID v4 string.
 * @returns {string}
 */
function generateUUIDv4(): string {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
  console.debug(`[onboardingLogic.generateUUIDv4] Generated UUID: ${uuid}`);
  return uuid;
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
  console.debug("[onboardingLogic.initializeProfile] Called with:", {
    primaryGoal,
    userInterests,
    hcProficiency,
    sjtAnswersById,
    sjtScenariosDataCount: sjtScenariosData.length
  });
  let potentialBiases: Record<string, number> = {};
  try {
    potentialBiases = calculatePotentialBiases(sjtAnswersById, sjtScenariosData);
    const profile: UserProfile = {
      userId: generateUUIDv4(),
      primaryGoal,
      userInterests,
      hcProficiency,
      potentialBiases,
      createdAt: Date.now()
    };
    console.debug("[onboardingLogic.initializeProfile] Profile object:", profile);
    await MindframeStore.update(currentState => ({
      profile,
      sjtAnswersById
    }));
    console.info("[onboardingLogic.initializeProfile] Profile initialized and saved.");
  } catch (err) {
    console.error("[onboardingLogic.initializeProfile] Error:", err);
    throw err;
  }
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
  console.debug("[onboardingLogic.calculatePotentialBiases] Start. Answers:", sjtAnswersById, "Scenarios:", sjtScenariosData.length);
  const biasScores: Record<string, number> = {};

  for (const scenario of sjtScenariosData) {
    const selectedIndex = sjtAnswersById[scenario.id];
    if (typeof selectedIndex !== 'number') {
      console.warn(`[onboardingLogic.calculatePotentialBiases] No answer for scenario: ${scenario.id}`);
      continue;
    }
    const selectedOption = scenario.options[selectedIndex];
    if (!selectedOption) {
      console.warn(`[onboardingLogic.calculatePotentialBiases] Invalid option index ${selectedIndex} for scenario: ${scenario.id}`);
      continue;
    }

    const { cognitiveBiasTargeted, cognitiveBiasTargetedScore } = selectedOption;
    if (
      typeof cognitiveBiasTargeted === 'string' &&
      cognitiveBiasTargeted &&
      typeof cognitiveBiasTargetedScore === 'number' &&
      cognitiveBiasTargetedScore > 0
    ) {
      const prev = biasScores[cognitiveBiasTargeted] || 0;
      biasScores[cognitiveBiasTargeted] = prev + cognitiveBiasTargetedScore;
      console.debug(`[onboardingLogic.calculatePotentialBiases] Added score for ${cognitiveBiasTargeted}: ${prev} + ${cognitiveBiasTargetedScore} = ${biasScores[cognitiveBiasTargeted]}`);
    }
  }

  console.debug("[onboardingLogic.calculatePotentialBiases] Result:", biasScores);
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
  console.debug("[onboardingLogic.updateProfile] Updates:", updates);
  try {
    await MindframeStore.update(currentState => ({
      profile: currentState.profile ? { ...currentState.profile, ...updates } : null
    }));
    console.info("[onboardingLogic.updateProfile] Profile updated.");
  } catch (err) {
    console.error("[onboardingLogic.updateProfile] Error:", err);
    throw err;
  }
}

/**
 * Clears the user profile and all store state.
 * @returns {Promise<void>}
 */
export async function resetProfile(): Promise<void> {
  console.debug("[onboardingLogic.resetProfile] Clearing all store state...");
  try {
    await MindframeStore.clear();
    console.info("[onboardingLogic.resetProfile] Store cleared.");
  } catch (err) {
    console.error("[onboardingLogic.resetProfile] Error:", err);
    throw err;
  }
}
