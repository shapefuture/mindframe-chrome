
/**
 * MindframeStore: Persistent state manager for MINDFRAME OS.
 * Handles profile, WXP, challenge log, drills, active quests, and SJT answers.
 * Provides maximum debug logging and robust error handling.
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
    console.debug("[MindframeStore.getDefaultState] Creating default state object.");
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
    console.debug("[MindframeStore.get] Attempting to retrieve state...");
    try {
      const result = await chrome.storage.local.get(MindframeStore.STORAGE_KEY);
      const state = result[MindframeStore.STORAGE_KEY];
      if (state && typeof state === 'object') {
        console.debug("[MindframeStore.get] Retrieved state:", state);
        return state;
      } else {
        console.warn("[MindframeStore.get] No state found, returning default.");
        return await MindframeStore.getDefaultState();
      }
    } catch (error) {
      console.error('[MindframeStore.get] Error:', error);
      return await MindframeStore.getDefaultState();
    }
  }

  /**
   * Updates the store using an updater function. Safely merges updates.
   * @param {(currentState: import('./types').MindframeStoreState) => Partial<import('./types').MindframeStoreState>} updaterFn
   * @returns {Promise<void>}
   */
  static async update(updaterFn) {
    console.debug("[MindframeStore.update] Invoked updater.");
    try {
      const currentState = await MindframeStore.get();
      console.debug("[MindframeStore.update] Current state before update:", currentState);
      let updates;
      try {
        updates = updaterFn(currentState);
        if (typeof updates !== 'object' || updates === null) {
          throw new Error("Updater function must return an object.");
        }
      } catch (err) {
        console.error("[MindframeStore.update] Updater function threw:", err);
        throw err;
      }
      const newState = { ...currentState, ...updates };
      console.debug("[MindframeStore.update] New state after update:", newState);
      await chrome.storage.local.set({
        [MindframeStore.STORAGE_KEY]: newState
      });
      console.debug("[MindframeStore.update] State successfully saved.");
    } catch (error) {
      console.error('[MindframeStore.update] Error:', error);
      throw error;
    }
  }

  /**
   * Clears all stored state.
   * @returns {Promise<void>}
   */
  static async clear() {
    console.debug("[MindframeStore.clear] Attempting to clear stored state...");
    try {
      await chrome.storage.local.remove(MindframeStore.STORAGE_KEY);
      console.debug("[MindframeStore.clear] State successfully cleared.");
    } catch (error) {
      console.error('[MindframeStore.clear] Error:', error);
      throw error;
    }
  }
}

export default MindframeStore;
