
import MindframeStore from './MindframeStore.js';

class GamificationService {
  static WXP_THRESHOLDS = [0, 100, 250, 500, 1000];
  static DEFAULT_CHALLENGE_WXP = 15;
  static DEFAULT_DRILL_WXP = 5;

  /**
   * @param {number} wxp
   * @returns {number}
   */
  static getLevel(wxp) {
    for (let i = this.WXP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (wxp >= this.WXP_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * @param {number} amount
   * @returns {Promise<void>}
   */
  static async addWXP(amount) {
    await MindframeStore.update(currentState => ({
      wxp: currentState.wxp + amount
    }));
  }

  /**
   * @param {string} challengeText
   * @param {string} hcRelated
   * @returns {Promise<void>}
   */
  static async completeChallenge(challengeText, hcRelated) {
    await MindframeStore.update(currentState => ({
      wxp: currentState.wxp + this.DEFAULT_CHALLENGE_WXP,
      completedChallengeLog: [
        {
          timestamp: Date.now(),
          challengeText,
          hcRelated,
          wxpEarned: this.DEFAULT_CHALLENGE_WXP
        },
        ...currentState.completedChallengeLog.slice(0, 19)
      ]
    }));
  }

  /**
   * @param {string} drillId
   * @returns {Promise<void>}
   */
  static async completeDrill(drillId) {
    await MindframeStore.update(currentState => ({
      wxp: currentState.wxp + this.DEFAULT_DRILL_WXP,
      completedDrillIds: [...new Set([...currentState.completedDrillIds, drillId])]
    }));
  }
}

export default GamificationService;
