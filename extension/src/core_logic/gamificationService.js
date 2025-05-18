
import MindframeStore from './MindframeStore.js';

/**
 * GamificationService handles Wisdom XP (WXP), levels, and challenge/drill rewards for MINDFRAME OS.
 * All methods are robust and provide detailed error handling.
 * @class
 */
class GamificationService {
  /** @type {number[]} WXP thresholds for levels 1-5 */
  static WXP_THRESHOLDS = [0, 100, 250, 500, 1000];
  /** @type {number} Default WXP for a completed challenge */
  static DEFAULT_CHALLENGE_WXP = 15;
  /** @type {number} Default WXP for a completed drill */
  static DEFAULT_DRILL_WXP = 5;

  /**
   * Returns the level for a given WXP value.
   * @param {number} wxp
   * @returns {number} Level (1-indexed)
   */
  static getLevel(wxp) {
    for (let i = this.WXP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (wxp >= this.WXP_THRESHOLDS[i]) {
        return i + 1; // Levels are 1-indexed
      }
    }
    return 1;
  }

  /**
   * Adds Wisdom XP to the current user, updates state, and tracks level up.
   * @param {number} amount - Amount of WXP to add (>=0).
   * @returns {Promise<void>}
   */
  static async addWXP(amount) {
    try {
      await MindframeStore.update(currentState => {
        const oldLevel = GamificationService.getLevel(currentState.wxp);
        const newWXP = currentState.wxp + amount;
        const newLevel = GamificationService.getLevel(newWXP);
        // You may add logic here to trigger level-up notifications if needed
        return { wxp: newWXP };
      });
    } catch (error) {
      console.error('GamificationService.addWXP error:', error);
      throw error;
    }
  }

  /**
   * Marks a challenge as completed, adds WXP, and updates the log.
   * @param {string} challengeText
   * @param {string} hcRelated
   * @returns {Promise<void>}
   */
  static async completeChallenge(challengeText, hcRelated) {
    try {
      await MindframeStore.update(currentState => ({
        wxp: currentState.wxp + GamificationService.DEFAULT_CHALLENGE_WXP,
        completedChallengeLog: [
          {
            timestamp: Date.now(),
            challengeText,
            hcRelated,
            wxpEarned: GamificationService.DEFAULT_CHALLENGE_WXP
          },
          ...currentState.completedChallengeLog.slice(0, 19)
        ]
      }));
    } catch (error) {
      console.error('GamificationService.completeChallenge error:', error);
      throw error;
    }
  }

  /**
   * Marks a drill as completed, adds WXP, and updates completedDrillIds.
   * @param {string} drillId
   * @returns {Promise<void>}
   */
  static async completeDrill(drillId) {
    try {
      await MindframeStore.update(currentState => ({
        wxp: currentState.wxp + GamificationService.DEFAULT_DRILL_WXP,
        completedDrillIds: [...new Set([...currentState.completedDrillIds, drillId])]
      }));
    } catch (error) {
      console.error('GamificationService.completeDrill error:', error);
      throw error;
    }
  }
}

export default GamificationService;
