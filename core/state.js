/**
 * Solar Panels Oldham - State Management
 * Global application state with persistence
 */

// State management system
const State = {
  data: new Map(),
  subscribers: new Map(),

  /**
   * Get state value
   */
  get(key, defaultValue = null) {
    return this.data.has(key) ? this.data.get(key) : defaultValue;
  },

  /**
   * Set state value
   */
  set(key, value) {
    const oldValue = this.data.get(key);
    this.data.set(key, value);

    // Notify subscribers
    this.notify(key, value, oldValue);

    // Persist to localStorage for certain keys
    this.persist(key, value);

    return value;
  },

  /**
   * Update state with partial data
   */
  update(key, updates) {
    const current = this.get(key, {});
    const updated = { ...current, ...updates };
    return this.set(key, updated);
  },

  /**
   * Delete state value
   */
  delete(key) {
    const oldValue = this.data.get(key);
    this.data.delete(key);

    // Notify subscribers
    this.notify(key, undefined, oldValue);

    // Remove from localStorage
    this.removePersisted(key);

    return true;
  },

  /**
   * Subscribe to state changes
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(key, callback);
  },

  /**
   * Unsubscribe from state changes
   */
  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      const callbacks = this.subscribers.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  },

  /**
   * Notify subscribers of state change
   */
  notify(key, newValue, oldValue) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(newValue, oldValue, key);
        } catch (error) {
          console.error(`Error in state subscriber for '${key}':`, error);
        }
      });
    }
  },

  /**
   * Persist state to localStorage
   */
  persist(key, value) {
    const persistableKeys = ['calculator', 'user', 'preferences'];

    if (persistableKeys.includes(key)) {
      try {
        localStorage.setItem(`solar_${key}`, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to persist state for '${key}':`, error);
      }
    }
  },

  /**
   * Load persisted state from localStorage
   */
  loadPersisted(key) {
    try {
      const stored = localStorage.getItem(`solar_${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn(`Failed to load persisted state for '${key}':`, error);
      return null;
    }
  },

  /**
   * Remove persisted state
   */
  removePersisted(key) {
    try {
      localStorage.removeItem(`solar_${key}`);
    } catch (error) {
      console.warn(`Failed to remove persisted state for '${key}':`, error);
    }
  },

  /**
   * Initialize state from localStorage
   */
  init() {
    const persistableKeys = ['calculator', 'user', 'preferences'];

    persistableKeys.forEach(key => {
      const persisted = this.loadPersisted(key);
      if (persisted) {
        this.data.set(key, persisted);
        console.log(`Loaded persisted state for '${key}'`);
      }
    });
  },

  /**
   * Clear all state
   */
  clear() {
    this.data.clear();
    this.subscribers.clear();

    // Clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('solar_')) {
        localStorage.removeItem(key);
      }
    });
  },

  /**
   * Get all state keys
   */
  keys() {
    return Array.from(this.data.keys());
  },

  /**
   * Get state summary
   */
  summary() {
    const summary = {};
    for (const [key, value] of this.data) {
      if (typeof value === 'object' && value !== null) {
        summary[key] = `Object with ${Object.keys(value).length} keys`;
      } else {
        summary[key] = value;
      }
    }
    return summary;
  }
};

// Initialize state on load
State.init();

// Export for use in other modules
window.State = State;

// Convenience functions
window.getState = State.get.bind(State);
window.setState = State.set.bind(State);
window.updateState = State.update.bind(State);