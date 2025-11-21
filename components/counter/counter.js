/**
 * Component: Animated Counter
 * Module: Components
 * Purpose: Number counter that animates when visible
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class AnimatedCounter {
    constructor(element) {
        this.element = element;
        this.valueElement = element.querySelector('.counter-value');
        this.initialized = false;

        // Configuration
        this.config = {
            duration: 2000,
            easing: 'easeOutCubic',
            useGrouping: true,
            locale: 'en-GB',
            prefix: '',
            suffix: '',
            startValue: 0
        };

        // State
        this.state = {
            targetValue: 0,
            currentValue: 0,
            startTime: null,
            animationFrame: null,
            isAnimating: false,
            hasAnimated: false,
            observer: null
        };

        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleIntersection = this.handleIntersection.bind(this);
    }

    async init() {
        try {
            console.log('Initializing Animated Counter component');

            // Get configuration from data attributes
            this.parseDataAttributes();

            // Set initial value
            this.updateDisplay(this.config.startValue);

            // Set up intersection observer
            this.setupIntersectionObserver();

            this.initialized = true;
            emit('component:counter:initialized', { element: this.element });

        } catch (error) {
            console.error('Counter initialization failed:', error);
            emit('component:counter:error', { element: this.element, error });
        }
    }

    /**
     * Parse data attributes for configuration
     */
    parseDataAttributes() {
        // Get target value
        const targetAttr = this.element.dataset.target || this.element.dataset.count;
        if (targetAttr) {
            this.state.targetValue = parseFloat(targetAttr);
            this.config.targetValue = this.state.targetValue;
        }

        // Get duration
        const durationAttr = this.element.dataset.duration;
        if (durationAttr) {
            this.config.duration = parseInt(durationAttr);
        }

        // Get easing
        const easingAttr = this.element.dataset.easing;
        if (easingAttr) {
            this.config.easing = easingAttr;
        }

        // Get prefix and suffix
        const prefixElement = this.element.querySelector('.counter-prefix');
        const suffixElement = this.element.querySelector('.counter-suffix');

        if (prefixElement) {
            this.config.prefix = prefixElement.textContent || '';
        }

        if (suffixElement) {
            this.config.suffix = suffixElement.textContent || '';
        }

        // Get start value
        const startAttr = this.element.dataset.start;
        if (startAttr) {
            this.config.startValue = parseFloat(startAttr);
            this.state.currentValue = this.config.startValue;
        }

        // Get locale
        const localeAttr = this.element.dataset.locale;
        if (localeAttr) {
            this.config.locale = localeAttr;
        }

        // Get grouping setting
        const groupingAttr = this.element.dataset.grouping;
        if (groupingAttr !== undefined) {
            this.config.useGrouping = groupingAttr !== 'false';
        }
    }

    /**
     * Set up intersection observer
     */
    setupIntersectionObserver() {
        this.state.observer = new IntersectionObserver(
            this.handleIntersection,
            {
                threshold: 0.5, // 50% visible
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully visible
            }
        );

        this.state.observer.observe(this.element);
    }

    /**
     * Handle intersection observer callback
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.state.hasAnimated) {
                this.startAnimation();
            }
        });
    }

    /**
     * Start the counter animation
     */
    startAnimation() {
        if (this.state.isAnimating) return;

        this.state.isAnimating = true;
        this.state.hasAnimated = true;
        this.state.startTime = performance.now();

        // Add animation class
        this.element.classList.add('counter-animating');

        // Start animation
        this.animate();

        // Emit start event
        emit('counter:animation:start', {
            element: this.element,
            targetValue: this.state.targetValue
        });
    }

    /**
     * Animation loop
     */
    animate(currentTime = performance.now()) {
        if (!this.state.isAnimating) return;

        const elapsed = currentTime - this.state.startTime;
        const progress = Math.min(elapsed / this.config.duration, 1);

        // Apply easing
        const easedProgress = this.applyEasing(progress);

        // Calculate current value
        const range = this.state.targetValue - this.config.startValue;
        this.state.currentValue = this.config.startValue + (range * easedProgress);

        // Update display
        this.updateDisplay(this.state.currentValue);

        if (progress < 1) {
            this.state.animationFrame = requestAnimationFrame(this.animate);
        } else {
            // Animation complete
            this.state.isAnimating = false;
            this.updateDisplay(this.state.targetValue);

            // Remove animation class
            this.element.classList.remove('counter-animating');
            this.element.classList.add('counter-complete');

            // Emit complete event
            emit('counter:animation:complete', {
                element: this.element,
                finalValue: this.state.targetValue
            });
        }
    }

    /**
     * Apply easing function
     */
    applyEasing(progress) {
        switch (this.config.easing) {
            case 'easeOutCubic':
                return 1 - Math.pow(1 - progress, 3);
            case 'easeOutQuad':
                return 1 - Math.pow(1 - progress, 2);
            case 'easeOutQuart':
                return 1 - Math.pow(1 - progress, 4);
            case 'easeInOutCubic':
                return progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            case 'linear':
            default:
                return progress;
        }
    }

    /**
     * Update display value
     */
    updateDisplay(value) {
        if (!this.valueElement) return;

        let displayValue;

        if (this.config.useGrouping && value >= 1000) {
            // Format with grouping for large numbers
            displayValue = new Intl.NumberFormat(this.config.locale).format(Math.floor(value));
        } else {
            // For smaller numbers or when grouping is disabled
            displayValue = Math.floor(value).toString();
        }

        this.valueElement.textContent = displayValue;
    }

    /**
     * Set new target value
     */
    setTarget(newTarget) {
        this.state.targetValue = parseFloat(newTarget);
        this.state.hasAnimated = false; // Allow re-animation

        if (this.state.observer) {
            // Reset observer to allow re-triggering
            this.state.observer.unobserve(this.element);
            this.setupIntersectionObserver();
        }
    }

    /**
     * Reset counter to initial state
     */
    reset() {
        this.state.hasAnimated = false;
        this.state.isAnimating = false;
        this.state.currentValue = this.config.startValue;

        // Cancel any running animation
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }

        // Reset classes
        this.element.classList.remove('counter-animating', 'counter-complete');

        // Reset display
        this.updateDisplay(this.config.startValue);

        // Reset observer
        if (this.state.observer) {
            this.state.observer.unobserve(this.element);
            this.setupIntersectionObserver();
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // Re-parse data attributes if needed
        this.parseDataAttributes();

        // Update display if not animating
        if (!this.state.isAnimating) {
            this.updateDisplay(this.state.currentValue);
        }
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Destroy component
     */
    destroy() {
        // Cancel animation
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }

        // Disconnect observer
        if (this.state.observer) {
            this.state.observer.disconnect();
        }

        // Reset classes
        this.element.classList.remove('counter-animating', 'counter-complete');

        this.initialized = false;
        emit('component:counter:destroyed', { element: this.element });
    }
}
