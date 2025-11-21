/**
 * Component: Component Loader and Manager
 * Module: Core
 * Purpose: Initialize and manage all UI components
 * Dependencies: events.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { emit, on } from './events.js';

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.initialized = new Set();
        this.observers = new Map();
    }
    
    /**
     * Register a component
     */
    register(name, componentClass) {
        this.components.set(name, componentClass);
    }
    
    /**
     * Initialize all components on the page
     */
    async initAll() {
        const startTime = performance.now();
        
        // Find all component elements
        const componentElements = document.querySelectorAll('[data-component]');
        const initPromises = [];
        
        for (const element of componentElements) {
            const componentName = element.dataset.component;
            
            // Skip if already initialized
            if (this.initialized.has(element)) {
                continue;
            }
            
            // Initialize component
            const promise = this.initComponent(componentName, element);
            initPromises.push(promise);
        }
        
        // Wait for all components to initialize
        const results = await Promise.allSettled(initPromises);
        
        // Log results
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        const duration = performance.now() - startTime;
        
        console.info(`Components initialized: ${successful} successful, ${failed} failed (${duration.toFixed(2)}ms)`);
        
        // Set up mutation observer for dynamic components
        this.setupMutationObserver();
        
        // Emit initialization complete event
        emit('components:initialized', {
            successful,
            failed,
            duration
        });
    }
    
    /**
     * Initialize a single component
     */
    async initComponent(componentName, element) {
        try {
            // Check if component is registered
            if (!this.components.has(componentName)) {
                // Try to load component dynamically
                await this.loadComponent(componentName);
            }
            
            const ComponentClass = this.components.get(componentName);
            if (!ComponentClass) {
                throw new Error(`Component not found: ${componentName}`);
            }
            
            // Create component instance
            const instance = new ComponentClass(element);
            
            // Initialize if method exists
            if (typeof instance.init === 'function') {
                await instance.init();
            }
            
            // Mark as initialized
            this.initialized.add(element);
            element.classList.add('component-initialized');
            
            // Store instance reference
            element._componentInstance = instance;
            
            // Emit component initialized event
            emit('component:initialized', {
                name: componentName,
                element,
                instance
            });
            
        } catch (error) {
            console.error(`Failed to initialize component ${componentName}:`, error);
            element.classList.add('component-error');
            throw error;
        }
    }
    
    /**
     * Load component dynamically
     */
    async loadComponent(componentName) {
        try {
            // Map of component names to their paths
            const componentPaths = {
                'hero': '/components/hero/hero.js',
                'card': '/components/card/interactive-card.js',
                'progress-form': '/components/form/progress-form.js',
                'counter': '/components/counter/counter.js',
                'floating-cta': '/components/cta/floating-cta.js',
                'testimonial': '/components/testimonial/testimonial.js',
                'calculator': '/components/calculator/calculator.js',
                'loader': '/components/loader/loader.js',
                'toast': '/components/toast/toast.js',
                'form-field': '/components/form/animated-input.js',
                'reveal': '/components/animation/scroll-reveal.js',
                'particles': '/components/particles/particles.js',
                'modal': '/components/modal/modal.js',
                'mobile-menu': '/components/mobile/mobile-menu/mobile-menu.js',
                'site-nav': '/components/navigation/site-nav/site-nav.js'
            };
            
            const path = componentPaths[componentName];
            if (!path) {
                throw new Error(`Unknown component: ${componentName}`);
            }
            
            // Load component module with cache busting
            const cacheBuster = `?v=${Date.now()}`;
            const module = await import(path + cacheBuster);
            
            // Register component
            this.register(componentName, module.default || module[Object.keys(module)[0]]);
            
        } catch (error) {
            console.error(`Failed to load component ${componentName}:`, error);
            throw error;
        }
    }
    
    /**
     * Set up mutation observer for dynamic components
     */
    setupMutationObserver() {
        // Create observer
        const observer = new MutationObserver((mutations) => {
            const addedComponents = [];
            
            for (const mutation of mutations) {
                // Check added nodes
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a component
                        if (node.hasAttribute('data-component')) {
                            addedComponents.push(node);
                        }
                        
                        // Check children
                        const childComponents = node.querySelectorAll('[data-component]');
                        addedComponents.push(...childComponents);
                    }
                }
            }
            
            // Initialize new components
            if (addedComponents.length > 0) {
                addedComponents.forEach(element => {
                    if (!this.initialized.has(element)) {
                        const componentName = element.dataset.component;
                        this.initComponent(componentName, element);
                    }
                });
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        this.observers.set('components', observer);
    }
    
    /**
     * Destroy a component
     */
    destroyComponent(element) {
        const instance = element._componentInstance;
        
        if (instance) {
            // Call destroy method if exists
            if (typeof instance.destroy === 'function') {
                instance.destroy();
            }
            
            // Clean up
            delete element._componentInstance;
            this.initialized.delete(element);
            element.classList.remove('component-initialized');
            
            // Emit event
            emit('component:destroyed', {
                element,
                instance
            });
        }
    }
    
    /**
     * Get component instance
     */
    getInstance(element) {
        return element._componentInstance || null;
    }
    
    /**
     * Refresh all components
     */
    async refreshAll() {
        // Destroy all existing components
        for (const element of this.initialized) {
            this.destroyComponent(element);
        }
        
        // Re-initialize all
        await this.initAll();
    }
}

// Create singleton instance
const componentManager = new ComponentManager();

// Initialize components when DOM is ready
export async function initComponents() {
    await componentManager.initAll();
}

// Listen for component refresh requests
on('components:refresh', () => {
    componentManager.refreshAll();
});

// Export manager for advanced usage
export { componentManager };

// Export convenience functions
export const registerComponent = (name, componentClass) => componentManager.register(name, componentClass);
export const getComponentInstance = (element) => componentManager.getInstance(element);
export const destroyComponent = (element) => componentManager.destroyComponent(element);
