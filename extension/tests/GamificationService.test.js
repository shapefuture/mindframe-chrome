/**
 * @jest-environment jsdom
 */

import MindframeStore from '../src/core_logic/MindframeStore.js';
import GamificationService from '../src/core_logic/gamificationService.js';

describe('GamificationService', () => {
  beforeEach(async () => {
    await MindframeStore.clear();
  });

  afterAll(async () => {
    await MindframeStore.clear();
  });

  it('should calculate levels correctly', () => {
    expect(GamificationService.getLevel(0)).toBe(1);
    expect(GamificationService.getLevel(99)).toBe(1);
    expect(GamificationService.getLevel(100)).toBe(2);
    expect(GamificationService.getLevel(249)).toBe(2);
    expect(GamificationService.getLevel(250)).toBe(3);
    expect(GamificationService.getLevel(500)).toBe(4);
    expect(GamificationService.getLevel(1000)).toBe(5);
    expect(GamificationService.getLevel(5000)).toBe(5);
  });

  it('should add WXP and update level', async () => {
    await GamificationService.addWXP(50);
    let state = await MindframeStore.get();
    expect(state.wxp).toBe(50);
    expect(GamificationService.getLevel(state.wxp)).toBe(1);

    await GamificationService.addWXP(100);
    state = await MindframeStore.get();
    expect(state.wxp).toBe(150);
    expect(GamificationService.getLevel(state.wxp)).toBe(2);
  });

  it('should complete challenge and update WXP and log', async () => {
    await GamificationService.completeChallenge('Challenge 1', 'critical_thinking');
    const state = await MindframeStore.get();
    expect(state.wxp).toBe(GamificationService.DEFAULT_CHALLENGE_WXP);
    expect(state.completedChallengeLog.length).toBe(1);
    expect(state.completedChallengeLog[0].challengeText).toBe('Challenge 1');
    expect(state.completedChallengeLog[0].hcRelated).toBe('critical_thinking');
    expect(state.completedChallengeLog[0].wxpEarned).toBe(GamificationService.DEFAULT_CHALLENGE_WXP);
  });

  it('should cap challenge log at 20 entries', async () => {
    for (let i = 0; i < 25; i++) {
      await GamificationService.completeChallenge('Challenge ' + i, 'bias_detection');
    }
    const state = await MindframeStore.get();
    expect(state.completedChallengeLog.length).toBe(20);
    expect(state.completedChallengeLog[0].challengeText).toBe('Challenge 24');
    expect(state.completedChallengeLog[19].challengeText).toBe('Challenge 5');
  });

  it('should complete drill and update WXP and completedDrillIds', async () => {
    await GamificationService.completeDrill('drill_critical_thinking_basics');
    const state = await MindframeStore.get();
    expect(state.wxp).toBe(GamificationService.DEFAULT_DRILL_WXP);
    expect(state.completedDrillIds).toContain('drill_critical_thinking_basics');
  });

  it('should not add duplicate drill IDs', async () => {
    await GamificationService.completeDrill('drillA');
    await GamificationService.completeDrill('drillA');
    const state = await MindframeStore.get();
    expect(state.completedDrillIds.filter(id => id === 'drillA').length).toBe(1);
  });

  it('should propagate errors up from MindframeStore', async () => {
    // Simulate a bad updater for addWXP
    const originalUpdate = MindframeStore.update;
    MindframeStore.update = () => { throw new Error("Simulated update error"); };
    await expect(GamificationService.addWXP(10)).rejects.toThrow("Simulated update error");
    MindframeStore.update = originalUpdate;
  });
});