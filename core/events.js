/**
 * Solar Panels Oldham - Event System
 * Global event bus for inter-component communication
 */

// Global event system
const Events = {
  listeners: new Map(),

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  },

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  },

  /**
   * Emit event with data
   */
  emit(event, data = {}) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error);
        }
      });
    }

    // Also emit as custom event for debugging
    if (typeof CustomEvent !== 'undefined') {
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
  },

  /**
   * Remove all listeners for event
   */
  removeAllListeners(event) {
    this.listeners.delete(event);
  },

  /**
   * Get listener count for event
   */
  listenerCount(event) {
    return this.listeners.has(event) ? this.listeners.get(event).length : 0;
  },

  /**
   * Get all event names
   */
  eventNames() {
    return Array.from(this.listeners.keys());
  }
};

// Export for use in other modules
window.Events = Events;

// Convenience functions
window.on = Events.on.bind(Events);
window.off = Events.off.bind(Events);
window.emit = Events.emit.bind(Events);