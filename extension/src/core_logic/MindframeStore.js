
/**
 * @typedef {import('./types').MindframeStoreState} MindframeStoreState
 */

class MindframeStore {
  static CURRENT_VERSION = '0.1.0';
  static STORAGE_KEY = 'mindframe_store_state';

  /**
   * @returns {Promise<MindframeStoreState>}
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
   * @returns {Promise<MindframeStoreState>}
   */
  static async get() {
    try {
      const result = await chrome.storage.local.get(MindframeStore.STORAGE_KEY);
      const state = result[MindframeStore.STORAGE_KEY];
      return state || await MindframeStore.getDefaultState();
    } catch (error) {
      console.error('Error getting state:', error);
      return MindframeStore.getDefaultState();
    }
  }

  /**
   * @param {(currentState: MindframeStoreState) => Partial<MindframeStoreState>} updaterFn
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
      console.error('Error updating state:', error);
      throw error;
    }
  }

  /**
   * @returns {Promise<void>}
   */
  static async clear() {
    try {
      await chrome.storage.local.remove(MindframeStore.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing state:', error);
      throw error;
    }
  }
}

export default MindframeStore;
