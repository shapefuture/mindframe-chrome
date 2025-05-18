/**
 * @jest-environment jsdom
 */

import MindframeStore from '../src/core_logic/MindframeStore.js';

describe('MindframeStore', () => {
  beforeEach(async () => {
    // Clear state before each test to ensure isolation.
    await MindframeStore.clear();
  });

  afterAll(async () => {
    await MindframeStore.clear();
  });

  it('should return default state when no state exists', async () => {
    const state = await MindframeStore.get();
    expect(state).toMatchObject({
      version: MindframeStore.CURRENT_VERSION,
      profile: null,
      wxp: 0,
      completedChallengeLog: [],
      completedDrillIds: [],
      activeQuestIds: [],
      sjtAnswersById: {}
    });
  });

  it('should update state correctly and persist values', async () => {
    await MindframeStore.update((currentState) => ({
      wxp: 42,
      activeQuestIds: ['quest1', 'quest2'],
    }));
    const state = await MindframeStore.get();
    expect(state.wxp).toBe(42);
    expect(state.activeQuestIds).toEqual(['quest1', 'quest2']);
  });

  it('should merge updates and not overwrite unrelated fields', async () => {
    await MindframeStore.update((currentState) => ({
      wxp: 10,
      completedDrillIds: ['drillA']
    }));
    await MindframeStore.update((currentState) => ({
      completedDrillIds: [...currentState.completedDrillIds, 'drillB']
    }));
    const state = await MindframeStore.get();
    expect(state.wxp).toBe(10);
    expect(state.completedDrillIds).toContain('drillA');
    expect(state.completedDrillIds).toContain('drillB');
  });

  it('should clear state correctly', async () => {
    await MindframeStore.update(() => ({ wxp: 123 }));
    await MindframeStore.clear();
    const state = await MindframeStore.get();
    expect(state.wxp).toBe(0);
  });

  it('should handle updater function errors gracefully', async () => {
    // Patch update to throw an error
    const badUpdater = () => {
      throw new Error("Test updater error");
    };
    await expect(MindframeStore.update(badUpdater)).rejects.toThrow("Test updater error");
  });
});