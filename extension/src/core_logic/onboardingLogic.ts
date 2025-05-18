
import { v4 as uuidv4 } from 'uuid';
import MindframeStore from './MindframeStore.js';
import type { UserProfile, SJTScenario } from './types';

export async function initializeProfile(
  primaryGoal: string,
  userInterests: string[],
  hcProficiency: Record<string, number>,
  sjtAnswersById: Record<string, number>,
  sjtScenariosData: SJTScenario[]
): Promise<void> {
  const potentialBiases = calculatePotentialBiases(sjtAnswersById, sjtScenariosData);
  
  const profile: UserProfile = {
    userId: uuidv4(),
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

function calculatePotentialBiases(
  sjtAnswersById: Record<string, number>,
  sjtScenariosData: SJTScenario[]
): Record<string, number> {
  const biasScores: Record<string, number> = {};

  sjtScenariosData.forEach(scenario => {
    const selectedAnswerIndex = sjtAnswersById[scenario.id];
    if (selectedAnswerIndex === undefined) return;

    const selectedOption = scenario.options[selectedAnswerIndex];
    if (!selectedOption) return;

    const { cognitiveBiasTargeted, cognitiveBiasTargetedScore } = selectedOption;
    if (cognitiveBiasTargeted && cognitiveBiasTargetedScore && cognitiveBiasTargetedScore > 0) {
      biasScores[cognitiveBiasTargeted] = (biasScores[cognitiveBiasTargeted] || 0) + cognitiveBiasTargetedScore;
    }
  });

  return biasScores;
}

export async function updateProfile(
  updates: Partial<UserProfile>
): Promise<void> {
  await MindframeStore.update(currentState => ({
    profile: currentState.profile ? { ...currentState.profile, ...updates } : null
  }));
}

export async function resetProfile(): Promise<void> {
  await MindframeStore.clear();
}
