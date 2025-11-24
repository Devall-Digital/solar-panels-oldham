/**
 * Solar Panels Oldham - Component Management System
 * Dynamic component loading and initialization
 */

// Component management system
const Components = {
  registry: new Map(),
  instances: new Map(),
  loading: new Set(),

  /**
   * Register a component class
   */
  register(name, componentClass) {
    this.registry.set(name, componentClass);
    console.log(`Registered component: ${name}`);
  },

  /**
   * Load component from file
   */
  async load(name) {
    if (this.loading.has(name)) {
      return; // Already loading
    }

    if (this.registry.has(name)) {
      return this.registry.get(name); // Already loaded
    }

    this.loading.add(name);

    try {
      // Dynamic import (fallback to script loading)
      const module = await import(`/components/${name}/${name}.js`);
      const componentClass = module.default || module[name];

      this.register(name, componentClass);
      return componentClass;

    } catch (error) {
      console.error(`Failed to load component '${name}':`, error);
      throw error;

    } finally {
      this.loading.delete(name);
    }
  },

  /**
   * Initialize component instance
   */
  async init(name, element, options = {}) {
    try {
      // Load component class if not already loaded
      const ComponentClass = await this.load(name);

      // Create instance
      const instance = new ComponentClass(element, options);

      // Initialize if method exists
      if (typeof instance.init === 'function') {
        await instance.init();
      }

      // Store instance
      const instanceId = `${name}_${Date.now()}_${Math.random()}`;
      this.instances.set(instanceId, {
        name,
        instance,
        element,
        id: instanceId
      });

      // Mark element as initialized
      element.setAttribute('data-component-initialized', 'true');
      element.classList.add('component-initialized');

      console.log(`Initialized component: ${name}`);

      return instance;

    } catch (error) {
      console.error(`Failed to initialize component '${name}':`, error);
      element.classList.add('component-error');
      throw error;
    }
  },

  /**
   * Auto-initialize components from DOM
   */
  async autoInit() {
    const startTime = performance.now();
    const elements = document.querySelectorAll('[data-component]');
    const initPromises = [];

    console.log(`Found ${elements.length} component elements to initialize`);

    for (const element of elements) {
      const componentName = element.getAttribute('data-component');

      // Skip if already initialized
      if (element.hasAttribute('data-component-initialized')) {
        continue;
      }

      // Initialize component
      const promise = this.init(componentName, element)
        .catch(error => {
          console.warn(`Failed to initialize component '${componentName}':`, error);
          return null;
        });

      initPromises.push(promise);
    }

    // Wait for all initializations
    const results = await Promise.allSettled(initPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
    const failed = results.filter(r => r.status === 'rejected' || r.value === null).length;
    const duration = performance.now() - startTime;

    console.log(`Component initialization complete: ${successful} successful, ${failed} failed (${duration.toFixed(2)}ms)`);

    return { successful, failed, duration };
  },

  /**
   * Destroy component instance
   */
  destroy(instanceId) {
    const componentData = this.instances.get(instanceId);
    if (componentData) {
      const { instance, element } = componentData;

      // Call destroy method if exists
      if (typeof instance.destroy === 'function') {
        instance.destroy();
      }

      // Remove from DOM if needed
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Remove from registry
      this.instances.delete(instanceId);

      console.log(`Destroyed component: ${componentData.name}`);
    }
  },

  /**
   * Get component instance
   */
  get(name) {
    for (const [id, data] of this.instances) {
      if (data.name === name) {
        return data.instance;
      }
    }
    return null;
  },

  /**
   * Get all component instances
   */
  getAll(name = null) {
    if (name) {
      return Array.from(this.instances.values())
        .filter(data => data.name === name)
        .map(data => data.instance);
    }

    return Array.from(this.instances.values()).map(data => data.instance);
  },

  /**
   * Check if component is registered
   */
  isRegistered(name) {
    return this.registry.has(name);
  },

  /**
   * Check if component is loaded
   */
  isLoaded(name) {
    return this.registry.has(name) && !this.loading.has(name);
  },

  /**
   * Get registered component names
   */
  getRegisteredNames() {
    return Array.from(this.registry.keys());
  },

  /**
   * Get loading component names
   */
  getLoadingNames() {
    return Array.from(this.loading);
  }
};

// Auto-initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Components.autoInit();
});

// Export for use in other modules
window.Components = Components;