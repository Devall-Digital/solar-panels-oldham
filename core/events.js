/**
 * Component: Event System
 * Module: Core
 * Purpose: Global event bus for component communication
 * Dependencies: None
 * Author: Initial Setup Agent
 * Date: November 2024
 */

export class EventBus {
    constructor() {
        this.events = new Map();
        this.onceEvents = new Map();
        this.debug = window.location.hostname === 'localhost';
    }
    
    /**
     * Subscribe to an event
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        
        this.events.get(event).add(callback);
        
        if (this.debug) {
            console.log(`Event listener added: ${event}`);
        }
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    /**
     * Subscribe to an event once
     */
    once(event, callback) {
        if (!this.onceEvents.has(event)) {
            this.onceEvents.set(event, new Set());
        }
        
        this.onceEvents.get(event).add(callback);
        
        // Return unsubscribe function
        return () => this.offOnce(event, callback);
    }
    
    /**
     * Unsubscribe from an event
     */
    off(event, callback) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.events.delete(event);
            }
        }
    }
    
    /**
     * Unsubscribe from a once event
     */
    offOnce(event, callback) {
        const callbacks = this.onceEvents.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.onceEvents.delete(event);
            }
        }
    }
    
    /**
     * Emit an event
     */
    emit(event, data = null) {
        if (this.debug) {
            console.log(`Event emitted: ${event}`, data);
        }
        
        // Call regular listeners
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data, event);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
        
        // Call once listeners
        const onceCallbacks = this.onceEvents.get(event);
        if (onceCallbacks) {
            onceCallbacks.forEach(callback => {
                try {
                    callback(data, event);
                } catch (error) {
                    console.error(`Error in once event listener for ${event}:`, error);
                }
            });
            // Clear once listeners after calling
            this.onceEvents.delete(event);
        }
    }
    
    /**
     * Emit event asynchronously
     */
    async emitAsync(event, data = null) {
        if (this.debug) {
            console.log(`Async event emitted: ${event}`, data);
        }
        
        const results = [];
        
        // Call regular listeners
        const callbacks = this.events.get(event);
        if (callbacks) {
            for (const callback of callbacks) {
                try {
                    const result = await callback(data, event);
                    results.push(result);
                } catch (error) {
                    console.error(`Error in async event listener for ${event}:`, error);
                    results.push({ error });
                }
            }
        }
        
        // Call once listeners
        const onceCallbacks = this.onceEvents.get(event);
        if (onceCallbacks) {
            for (const callback of onceCallbacks) {
                try {
                    const result = await callback(data, event);
                    results.push(result);
                } catch (error) {
                    console.error(`Error in async once event listener for ${event}:`, error);
                    results.push({ error });
                }
            }
            // Clear once listeners after calling
            this.onceEvents.delete(event);
        }
        
        return results;
    }
    
    /**
     * Check if event has listeners
     */
    hasListeners(event) {
        return this.events.has(event) || this.onceEvents.has(event);
    }
    
    /**
     * Get listener count for an event
     */
    getListenerCount(event) {
        const regularCount = this.events.has(event) ? this.events.get(event).size : 0;
        const onceCount = this.onceEvents.has(event) ? this.onceEvents.get(event).size : 0;
        return regularCount + onceCount;
    }
    
    /**
     * Remove all listeners for an event
     */
    removeAllListeners(event = null) {
        if (event) {
            this.events.delete(event);
            this.onceEvents.delete(event);
        } else {
            this.events.clear();
            this.onceEvents.clear();
        }
    }
    
    /**
     * Wait for an event
     */
    waitFor(event, timeout = null) {
        return new Promise((resolve, reject) => {
            let timeoutId = null;
            
            // Set up timeout if specified
            if (timeout) {
                timeoutId = setTimeout(() => {
                    this.offOnce(event, handler);
                    reject(new Error(`Timeout waiting for event: ${event}`));
                }, timeout);
            }
            
            // Event handler
            const handler = (data) => {
                if (timeoutId) clearTimeout(timeoutId);
                resolve(data);
            };
            
            this.once(event, handler);
        });
    }
}

// Create global event bus
const globalEventBus = new EventBus();

// Convenience functions for global event bus
export const on = (event, callback) => globalEventBus.on(event, callback);
export const once = (event, callback) => globalEventBus.once(event, callback);
export const off = (event, callback) => globalEventBus.off(event, callback);
export const emit = (event, data) => globalEventBus.emit(event, data);
export const emitAsync = (event, data) => globalEventBus.emitAsync(event, data);
export const waitFor = (event, timeout) => globalEventBus.waitFor(event, timeout);

// Export the global instance
export { globalEventBus };
