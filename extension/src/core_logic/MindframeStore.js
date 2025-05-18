
/**
 * MindframeStore: Persistent state manager for MINDFRAME OS.
 * Handles profile, WXP, challenge log, drills, active quests, and SJT answers.
 * @class
 */
class MindframeStore {
  /** @type {string} */
  static CURRENT_VERSION = '0.1.0';
  /** @type {string} */
  static STORAGE_KEY = 'mindframe_store_state';

  /**
   * Returns the default state object for MindframeStore.
   * @returns {Promise<import('./types').MindframeStoreState>}
   */
  static async getDefaultState() {
    return {
      version: MindframeStore.CURRENT_VERSION,
      profile: null,
      wxp: 0,
      completedChallengeLog: [],
      completedDrillIds: [],
      activeQuestIds: [],
      sjtAnswersById: {}
    };
  }

  /**
   * Retrieves the current state from storage, or default state if not present.
   * @returns {Promise<import('./types').MindframeStoreState>}
   */
  static async get() {
    try {
      const result = await chrome.storage.local.get(MindframeStore.STORAGE_KEY);
      const state = result[MindframeStore.STORAGE_KEY];
      if (state && typeof state === 'object') {
        return state;
      } else {
        return await MindframeStore.getDefaultState();
      }
    } catch (error) {
      console.error('MindframeStore.get() error:', error);
      return await MindframeStore.getDefaultState();
    }
  }

  /**
   * Updates the store using an updater function. Safely merges updates.
   * @param {(currentState: import('./types').MindframeStoreState) => Partial<import('./types').MindframeStoreState>} updaterFn
   * @returns {Promise<void>}
   */
  static async update(updaterFn) {
    try {
      const currentState = await MindframeStore.get();
      const updates = updaterFn(currentState);
      const newState = { ...currentState, ...updates };
      await chrome.storage.local.set({
        [MindframeStore.STORAGE_KEY]: newState
      });
    } catch (error) {
      console.error('MindframeStore.update() error:', error);
      throw error;
    }
  }

  /**
   * Clears all stored state.
   * @returns {Promise<void>}
   */
  static async clear() {
    try {
      await chrome.storage.local.remove(MindframeStore.STORAGE_KEY);
    } catch (error) {
      console.error('MindframeStore.clear() error:', error);
      throw error;
    }
  }
}

export default MindframeStore;
