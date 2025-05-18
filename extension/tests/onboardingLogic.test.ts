/**
 * @jest-environment jsdom
 */

import MindframeStore from '../src/core_logic/MindframeStore.js';
import {
  initializeProfile,
  updateProfile,
  resetProfile
} from '../src/core_logic/onboardingLogic';
import type { SJTScenario } from '../src/core_logic/types';

describe('onboardingLogic', () => {
  beforeEach(async () => {
    await MindframeStore.clear();
  });

  afterAll(async () => {
    await MindframeStore.clear();
  });

  const sampleScenarios: SJTScenario[] = [
    {
      id: "s1",
      scenarioText: "Scenario 1",
      options: [
        { text: "Bias", cognitiveBiasTargeted: "Confirmation Bias", cognitiveBiasTargetedScore: 2, isBetterThinking: false },
        { text: "No Bias", cognitiveBiasTargeted: null, cognitiveBiasTargetedScore: 0, isBetterThinking: true }
      ],
      biasExplanation: "Explanation",
      relatedInterests: ["critical_thinking"]
    },
    {
      id: "s2",
      scenarioText: "Scenario 2",
      options: [
        { text: "Anchoring", cognitiveBiasTargeted: "Anchoring Bias", cognitiveBiasTargetedScore: 1, isBetterThinking: false },
        { text: "No Bias", cognitiveBiasTargeted: null, cognitiveBiasTargetedScore: 0, isBetterThinking: true }
      ],
      biasExplanation: "Explanation",
      relatedInterests: ["decision_making"]
    }
  ];

  it('should initialize profile and calculate potential biases', async () => {
    const primaryGoal = "improve_thinking";
    const userInterests = ["critical_thinking"];
    const hcProficiency = { "critical_thinking": 1 };
    const sjtAnswersById = { s1: 0, s2: 0 }; // Both bias options

    await initializeProfile(primaryGoal, userInterests, hcProficiency, sjtAnswersById, sampleScenarios);

    const state = await MindframeStore.get();
    expect(state.profile).toBeTruthy();
    expect(state.profile?.primaryGoal).toBe(primaryGoal);
    expect(state.profile?.userInterests).toEqual(userInterests);
    expect(state.profile?.hcProficiency).toEqual(hcProficiency);

    // Biases accumulated
    expect(state.profile?.potentialBiases).toEqual({
      "Confirmation Bias": 2,
      "Anchoring Bias": 1
    });
    expect(state.sjtAnswersById).toEqual(sjtAnswersById);
  });

  it('should handle missing/invalid answers gracefully', async () => {
    const sjtAnswersById = { s1: 1 }; // Only select the "no bias" for s1, s2 missing
    await initializeProfile(
      "goal", ["interest"], {}, sjtAnswersById, sampleScenarios
    );
    const state = await MindframeStore.get();
    expect(state.profile?.potentialBiases).toEqual({});
  });

  it('should update profile partially', async () => {
    await initializeProfile("goal", ["interest"], {}, { s1: 1 }, sampleScenarios);
    await updateProfile({ primaryGoal: "new_goal", userInterests: ["bias_detection"] });
    const state = await MindframeStore.get();
    expect(state.profile?.primaryGoal).toBe("new_goal");
    expect(state.profile?.userInterests).toEqual(["bias_detection"]);
  });

  it('should reset the profile and store', async () => {
    await initializeProfile("goal", ["interest"], {}, { s1: 1 }, sampleScenarios);
    await resetProfile();
    const state = await MindframeStore.get();
    expect(state.profile).toBeNull();
    expect(state.wxp).toBe(0);
  });

  it('should propagate errors from MindframeStore.update', async () => {
    const origUpdate = MindframeStore.update;
    MindframeStore.update = () => { throw new Error("Simulated update error"); };
    await expect(initializeProfile("g", [], {}, {}, sampleScenarios)).rejects.toThrow("Simulated update error");
    MindframeStore.update = origUpdate;
  });

  it('should propagate errors from MindframeStore.clear', async () => {
    const origClear = MindframeStore.clear;
    MindframeStore.clear = () => { throw new Error("Simulated clear error"); };
    await expect(resetProfile()).rejects.toThrow("Simulated clear error");
    MindframeStore.clear = origClear;
  });
});