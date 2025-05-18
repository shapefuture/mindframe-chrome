
import MindframeStore from './MindframeStore.js';

/**
 * GamificationService handles Wisdom XP (WXP), levels, and challenge/drill rewards for MINDFRAME OS.
 * All methods are robust and provide detailed error handling and debug logging.
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
    console.debug(`[GamificationService.getLevel] Enter wxp=${wxp}`);
    for (let i = this.WXP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (wxp >= this.WXP_THRESHOLDS[i]) {
        console.debug(`[GamificationService.getLevel] Level found: ${i + 1}`);
        return i + 1; // Levels are 1-indexed
      }
    }
    console.warn(`[GamificationService.getLevel] Defaulting to level 1`);
    return 1;
  }

  /**
   * Adds Wisdom XP to the current user, updates state, and tracks level up.
   * @param {number} amount - Amount of WXP to add (>=0).
   * @returns {Promise<void>}
   */
  static async addWXP(amount) {
    console.debug(`[GamificationService.addWXP] Attempting to add WXP: ${amount}`);
    try {
      await MindframeStore.update(currentState => {
        const oldLevel = GamificationService.getLevel(currentState.wxp);
        const newWXP = currentState.wxp + amount;
        const newLevel = GamificationService.getLevel(newWXP);
        if (newLevel > oldLevel) {
          console.info(`[GamificationService.addWXP] Level up! ${oldLevel} -> ${newLevel}`);
        }
        return { wxp: newWXP };
      });
      console.debug(`[GamificationService.addWXP] Successfully added WXP: ${amount}`);
    } catch (error) {
      console.error('[GamificationService.addWXP] Error:', error);
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
    console.debug(`[GamificationService.completeChallenge] challengeText="${challengeText}", hcRelated="${hcRelated}"`);
    try {
      await MindframeStore.update(currentState => {
        const newWXP = currentState.wxp + GamificationService.DEFAULT_CHALLENGE_WXP;
        const newChallenge = {
          timestamp: Date.now(),
          challengeText,
          hcRelated,
          wxpEarned: GamificationService.DEFAULT_CHALLENGE_WXP
        };
        const updatedLog = [newChallenge, ...currentState.completedChallengeLog.slice(0, 19)];
        console.debug(`[GamificationService.completeChallenge] New challenge log:`, updatedLog);
        return {
          wxp: newWXP,
          completedChallengeLog: updatedLog
        };
      });
      console.debug(`[GamificationService.completeChallenge] Challenge completed and logged.`);
    } catch (error) {
      console.error('[GamificationService.completeChallenge] Error:', error);
      throw error;
    }
  }

  /**
   * Marks a drill as completed, adds WXP, and updates completedDrillIds.
   * @param {string} drillId
   * @returns {Promise<void>}
   */
  static async completeDrill(drillId) {
    console.debug(`[GamificationService.completeDrill] drillId="${drillId}"`);
    try {
      await MindframeStore.update(currentState => {
        const newWXP = currentState.wxp + GamificationService.DEFAULT_DRILL_WXP;
        const updatedDrills = [...new Set([...currentState.completedDrillIds, drillId])];
        console.debug(`[GamificationService.completeDrill] updated completedDrillIds:`, updatedDrills);
        return {
          wxp: newWXP,
          completedDrillIds: updatedDrills
        };
      });
      console.debug(`[GamificationService.completeDrill] Drill completed and logged.`);
    } catch (error) {
      console.error('[GamificationService.completeDrill] Error:', error);
      throw error;
    }
  }
}

export default GamificationService;
