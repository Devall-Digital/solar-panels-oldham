/**
 * Component: Loading Animation
 * Module: Components
 * Purpose: Entertaining loading animation with solar theme
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class LoadingAnimation {
    constructor(element) {
        this.element = element;
        this.solarLoader = element.querySelector('.solar-loader');
        this.sun = element.querySelector('.sun');
        this.panels = element.querySelectorAll('.panel');
        this.loadingText = element.querySelector('.loading-text');
        this.initialized = false;

        // Configuration
        this.config = {
            duration: 2000,
            text: 'Loading...',
            size: 'medium',
            theme: 'solar'
        };

        // State
        this.state = {
            isAnimating: false,
            animationId: null
        };

        // Bind methods
        this.animate = this.animate.bind(this);
    }

    async init() {
        try {
            console.log('Initializing Loading Animation component');

            // Parse data attributes
            this.parseDataAttributes();

            // Set initial state
            this.updateText(this.config.text);
            this.applySize(this.config.size);
            this.applyTheme(this.config.theme);

            // Start animation if auto-start
            if (this.element.dataset.autoStart !== 'false') {
                this.start();
            }

            this.initialized = true;
            emit('component:loader:initialized', { element: this.element });

        } catch (error) {
            console.error('Loading animation initialization failed:', error);
            emit('component:loader:error', { element: this.element, error });
        }
    }

    /**
     * Parse data attributes for configuration
     */
    parseDataAttributes() {
        // Duration
        const durationAttr = this.element.dataset.duration;
        if (durationAttr) {
            this.config.duration = parseInt(durationAttr);
        }

        // Text
        const textAttr = this.element.dataset.text;
        if (textAttr) {
            this.config.text = textAttr;
        }

        // Size
        const sizeAttr = this.element.dataset.size;
        if (sizeAttr) {
            this.config.size = sizeAttr;
        }

        // Theme
        const themeAttr = this.element.dataset.theme;
        if (themeAttr) {
            this.config.theme = themeAttr;
        }
    }

    /**
     * Start the loading animation
     */
    start() {
        if (this.state.isAnimating) return;

        this.state.isAnimating = true;
        this.element.classList.add('loading-active');

        // Start the animation loop
        this.animate();

        emit('loader:start', { element: this.element });
    }

    /**
     * Stop the loading animation
     */
    stop() {
        if (!this.state.isAnimating) return;

        this.state.isAnimating = false;

        if (this.state.animationId) {
            cancelAnimationFrame(this.state.animationId);
            this.state.animationId = null;
        }

        this.element.classList.remove('loading-active');
        emit('loader:stop', { element: this.element });
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.state.isAnimating) return;

        // Rotate sun
        if (this.sun) {
            const time = Date.now() * 0.001; // Convert to seconds
            const rotation = time * 180; // 180 degrees per second
            this.sun.style.transform = `rotate(${rotation}deg)`;
        }

        // Animate panels
        this.panels.forEach((panel, index) => {
            const time = Date.now() * 0.001;
            const offset = index * 0.5; // Stagger the panels
            const scale = 0.8 + Math.sin(time * 2 + offset) * 0.2;
            panel.style.transform = `scale(${scale})`;
        });

        this.state.animationId = requestAnimationFrame(this.animate);
    }

    /**
     * Update loading text
     */
    updateText(text) {
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
        this.config.text = text;
    }

    /**
     * Apply size variant
     */
    applySize(size) {
        // Remove existing size classes
        this.element.classList.remove('loader-small', 'loader-medium', 'loader-large');

        // Add new size class
        if (size !== 'medium') {
            this.element.classList.add(`loader-${size}`);
        }

        this.config.size = size;
    }

    /**
     * Apply theme variant
     */
    applyTheme(theme) {
        // Remove existing theme classes
        this.element.classList.remove('loader-solar', 'loader-default', 'loader-dark');

        // Add new theme class
        if (theme !== 'default') {
            this.element.classList.add(`loader-${theme}`);
        }

        this.config.theme = theme;
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        const oldConfig = { ...this.config };

        // Update configuration
        this.config = { ...this.config, ...newConfig };

        // Apply changes
        if (newConfig.text !== undefined && newConfig.text !== oldConfig.text) {
            this.updateText(newConfig.text);
        }

        if (newConfig.size !== undefined && newConfig.size !== oldConfig.size) {
            this.applySize(newConfig.size);
        }

        if (newConfig.theme !== undefined && newConfig.theme !== oldConfig.theme) {
            this.applyTheme(newConfig.theme);
        }
    }

    /**
     * Check if loading is active
     */
    isLoading() {
        return this.state.isAnimating;
    }

    /**
     * Destroy component
     */
    destroy() {
        this.stop();
        this.initialized = false;
        emit('component:loader:destroyed', { element: this.element });
    }
}