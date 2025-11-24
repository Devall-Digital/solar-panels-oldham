/**
 * Component: State Management System
 * Module: Core
 * Purpose: Centralized state management for the application
 * Dependencies: None
 * Author: Initial Setup Agent
 * Date: November 2024
 */

class StateManager {
    constructor() {
        this.state = {};
        this.subscribers = new Map();
        this.history = [];
        this.maxHistory = 50;
        this.debug = window.location.hostname === 'localhost';
    }
    
    /**
     * Get state value
     */
    get(path) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }
    
    /**
     * Set state value
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        
        // Navigate to the parent object
        let target = this.state;
        for (const key of keys) {
            if (!(key in target) || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        // Store previous value for history
        const previousValue = target[lastKey];
        
        // Set the new value
        if (value === undefined) {
            delete target[lastKey];
        } else {
            target[lastKey] = this.deepClone(value);
        }
        
        // Add to history
        this.addToHistory({
            path,
            previousValue,
            newValue: value,
            timestamp: Date.now()
        });
        
        // Notify subscribers
        this.notifySubscribers(path, value, previousValue);
        
        // Debug logging
        if (this.debug) {
            console.log('State updated:', path, value);
        }
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
        if (!this.subscribers.has(path)) {
            this.subscribers.set(path, new Set());
        }
        
        this.subscribers.get(path).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(path);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.subscribers.delete(path);
                }
            }
        };
    }
    
    /**
     * Notify subscribers of state change
     */
    notifySubscribers(path, newValue, previousValue) {
        // Notify exact path subscribers
        const exactSubscribers = this.subscribers.get(path);
        if (exactSubscribers) {
            exactSubscribers.forEach(callback => {
                try {
                    callback(newValue, previousValue, path);
                } catch (error) {
                    console.error('Subscriber error:', error);
                }
            });
        }
        
        // Notify parent path subscribers
        const pathParts = path.split('.');
        for (let i = pathParts.length - 1; i > 0; i--) {
            const parentPath = pathParts.slice(0, i).join('.');
            const parentSubscribers = this.subscribers.get(parentPath);
            
            if (parentSubscribers) {
                const parentValue = this.get(parentPath);
                parentSubscribers.forEach(callback => {
                    try {
                        callback(parentValue, undefined, parentPath);
                    } catch (error) {
                        console.error('Parent subscriber error:', error);
                    }
                });
            }
        }
        
        // Notify wildcard subscribers
        const wildcardSubscribers = this.subscribers.get('*');
        if (wildcardSubscribers) {
            wildcardSubscribers.forEach(callback => {
                try {
                    callback({ path, newValue, previousValue });
                } catch (error) {
                    console.error('Wildcard subscriber error:', error);
                }
            });
        }
    }
    
    /**
     * Batch update state
     */
    batch(updates) {
        const changes = [];
        
        // Temporarily disable notifications
        const originalNotify = this.notifySubscribers;
        this.notifySubscribers = (path, newValue, previousValue) => {
            changes.push({ path, newValue, previousValue });
        };
        
        // Apply all updates
        Object.entries(updates).forEach(([path, value]) => {
            this.set(path, value);
        });
        
        // Restore notifications
        this.notifySubscribers = originalNotify;
        
        // Notify all changes at once
        changes.forEach(({ path, newValue, previousValue }) => {
            this.notifySubscribers(path, newValue, previousValue);
        });
    }
    
    /**
     * Add to history
     */
    addToHistory(entry) {
        this.history.push(entry);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    /**
     * Get state history
     */
    getHistory(path = null) {
        if (!path) return this.history;
        
        return this.history.filter(entry => entry.path === path);
    }
    
    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }
    
    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof RegExp) return new RegExp(obj);
        
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }
        
        return clonedObj;
    }
    
    /**
     * Reset state
     */
    reset(path = null) {
        if (path) {
            this.set(path, undefined);
        } else {
            // Reset entire state
            const allPaths = Object.keys(this.state);
            this.state = {};
            
            // Notify all subscribers
            allPaths.forEach(path => {
                this.notifySubscribers(path, undefined, this.state[path]);
            });
        }
    }
    
    /**
     * Persist state to localStorage
     */
    persist(key = 'appState') {
        try {
            const stateString = JSON.stringify(this.state);
            localStorage.setItem(key, stateString);
            return true;
        } catch (error) {
            console.error('Failed to persist state:', error);
            return false;
        }
    }
    
    /**
     * Restore state from localStorage
     */
    restore(key = 'appState') {
        try {
            const stateString = localStorage.getItem(key);
            if (stateString) {
                const restoredState = JSON.parse(stateString);
                this.state = restoredState;
                
                // Notify all subscribers
                Object.keys(restoredState).forEach(path => {
                    this.notifySubscribers(path, restoredState[path], undefined);
                });
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to restore state:', error);
            return false;
        }
    }
    
    /**
     * Create computed property
     */
    computed(path, dependencies, computeFn) {
        // Subscribe to all dependencies
        dependencies.forEach(dep => {
            this.subscribe(dep, () => {
                // Recompute value when any dependency changes
                const values = dependencies.map(d => this.get(d));
                const computedValue = computeFn(...values);
                this.set(path, computedValue);
            });
        });
        
        // Compute initial value
        const values = dependencies.map(d => this.get(d));
        const computedValue = computeFn(...values);
        this.set(path, computedValue);
    }
}

// Create singleton instance
const stateManager = new StateManager();

// Export convenient functions
export const state = stateManager.state;
export const getState = (path) => stateManager.get(path);
export const setState = (path, value) => stateManager.set(path, value);
export const subscribe = (path, callback) => stateManager.subscribe(path, callback);
export const batch = (updates) => stateManager.batch(updates);
export const resetState = (path) => stateManager.reset(path);
export const persistState = (key) => stateManager.persist(key);
export const restoreState = (key) => stateManager.restore(key);
export const computed = (path, deps, fn) => stateManager.computed(path, deps, fn);

// Export the manager instance for advanced usage
export { stateManager };
