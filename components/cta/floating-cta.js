/**
 * Component: Floating CTA Button
 * Module: Components
 * Purpose: Eye-catching call-to-action with animations and interactions
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class FloatingCTA {
    constructor(element) {
        this.element = element;
        this.ctaBg = element.querySelector('.cta-bg');
        this.ctaText = element.querySelector('.cta-text');
        this.ctaIcon = element.querySelector('.cta-icon');
        this.rippleContainer = element.querySelector('.ripple-container');
        this.initialized = false;

        // Configuration
        this.config = {
            pulseInterval: 3000,
            rippleDuration: 600,
            scaleHover: 1.05,
            scaleClick: 0.95,
            glowIntensity: 0.6,
            magneticEffect: true,
            magneticRange: 100
        };

        // State
        this.state = {
            isPulsing: false,
            pulseIntervalId: null,
            mousePosition: { x: 0, y: 0 },
            isHovered: false,
            isClicked: false
        };

        // Bind methods
        this.handleMouseEnter = this.onMouseEnter.bind(this);
        this.handleMouseLeave = this.onMouseLeave.bind(this);
        this.handleMouseMove = this.onMouseMove.bind(this);
        this.handleClick = this.onClick.bind(this);
        this.handlePulse = this.handlePulse.bind(this);
    }

    async init() {
        try {
            console.log('Initializing Floating CTA component');

            // Parse data attributes
            this.parseDataAttributes();

            // Set up event listeners
            this.setupEventListeners();

            // Start pulsing animation
            this.startPulsing();

            // Add magnetic effect if enabled
            if (this.config.magneticEffect) {
                this.setupMagneticEffect();
            }

            this.initialized = true;
            emit('component:cta:initialized', { element: this.element });

        } catch (error) {
            console.error('Floating CTA initialization failed:', error);
            emit('component:cta:error', { element: this.element, error });
        }
    }

    /**
     * Parse data attributes for configuration
     */
    parseDataAttributes() {
        // Pulse interval
        const pulseAttr = this.element.dataset.pulseInterval;
        if (pulseAttr) {
            this.config.pulseInterval = parseInt(pulseAttr);
        }

        // Ripple duration
        const rippleAttr = this.element.dataset.rippleDuration;
        if (rippleAttr) {
            this.config.rippleDuration = parseInt(rippleAttr);
        }

        // Scale effects
        const hoverScaleAttr = this.element.dataset.hoverScale;
        if (hoverScaleAttr) {
            this.config.scaleHover = parseFloat(hoverScaleAttr);
        }

        const clickScaleAttr = this.element.dataset.clickScale;
        if (clickScaleAttr) {
            this.config.scaleClick = parseFloat(clickScaleAttr);
        }

        // Glow intensity
        const glowAttr = this.element.dataset.glowIntensity;
        if (glowAttr) {
            this.config.glowIntensity = parseFloat(glowAttr);
        }

        // Magnetic effect
        const magneticAttr = this.element.dataset.magneticEffect;
        if (magneticAttr !== undefined) {
            this.config.magneticEffect = magneticAttr !== 'false';
        }

        // Magnetic range
        const rangeAttr = this.element.dataset.magneticRange;
        if (rangeAttr) {
            this.config.magneticRange = parseInt(rangeAttr);
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        this.element.addEventListener('mouseenter', this.handleMouseEnter);
        this.element.addEventListener('mouseleave', this.handleMouseLeave);
        this.element.addEventListener('mousemove', this.handleMouseMove);
        this.element.addEventListener('click', this.handleClick);
    }

    /**
     * Set up magnetic effect
     */
    setupMagneticEffect() {
        // Listen for mouse movement on document
        document.addEventListener('mousemove', (e) => {
            this.state.mousePosition.x = e.clientX;
            this.state.mousePosition.y = e.clientY;

            if (this.state.isHovered) {
                this.updateMagneticEffect();
            }
        });
    }

    /**
     * Start pulsing animation
     */
    startPulsing() {
        this.state.pulseIntervalId = setInterval(this.handlePulse, this.config.pulseInterval);
    }

    /**
     * Handle pulse animation
     */
    handlePulse() {
        if (this.state.isPulsing || this.state.isHovered) return;

        this.state.isPulsing = true;
        this.element.classList.add('cta-pulsing');

        setTimeout(() => {
            this.element.classList.remove('cta-pulsing');
            this.state.isPulsing = false;
        }, 1000);
    }

    /**
     * Update magnetic effect
     */
    updateMagneticEffect() {
        if (!this.config.magneticEffect) return;

        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = this.state.mousePosition.x - centerX;
        const deltaY = this.state.mousePosition.y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < this.config.magneticRange) {
            const strength = 1 - (distance / this.config.magneticRange);
            const moveX = deltaX * strength * 0.3;
            const moveY = deltaY * strength * 0.3;

            this.element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${this.config.scaleHover})`;
        } else {
            this.element.style.transform = `scale(${this.config.scaleHover})`;
        }
    }

    /**
     * Mouse enter handler
     */
    onMouseEnter(event) {
        this.state.isHovered = true;
        this.element.classList.add('cta-hovered');

        // Stop pulsing
        if (this.state.pulseIntervalId) {
            clearInterval(this.state.pulseIntervalId);
            this.state.pulseIntervalId = null;
        }

        // Apply hover scale
        if (!this.config.magneticEffect) {
            this.element.style.transform = `scale(${this.config.scaleHover})`;
        } else {
            this.updateMagneticEffect();
        }

        // Add glow effect
        if (this.ctaBg) {
            this.ctaBg.style.opacity = this.config.glowIntensity.toString();
        }

        emit('cta:hover:enter', { element: this.element });
    }

    /**
     * Mouse leave handler
     */
    onMouseLeave(event) {
        this.state.isHovered = false;
        this.element.classList.remove('cta-hovered');

        // Reset transform
        this.element.style.transform = '';

        // Hide glow
        if (this.ctaBg) {
            this.ctaBg.style.opacity = '0';
        }

        // Restart pulsing
        this.startPulsing();

        emit('cta:hover:leave', { element: this.element });
    }

    /**
     * Mouse move handler
     */
    onMouseMove(event) {
        if (this.config.magneticEffect && this.state.isHovered) {
            this.updateMagneticEffect();
        }
    }

    /**
     * Click handler
     */
    onClick(event) {
        this.state.isClicked = true;

        // Create ripple effect
        this.createRipple(event);

        // Click animation
        this.element.style.transform = this.element.style.transform.replace(/scale\([^)]+\)/, `scale(${this.config.scaleClick})`);

        setTimeout(() => {
            this.element.style.transform = this.state.isHovered
                ? `scale(${this.config.scaleHover})`
                : '';
            this.state.isClicked = false;
        }, 150);

        // Get action from data attribute
        const action = this.element.dataset.action;

        emit('cta:click', { element: this.element, action, event });

        // Prevent default if action is handled
        if (action) {
            event.preventDefault();
        }
    }

    /**
     * Create ripple effect
     */
    createRipple(event) {
        if (!this.rippleContainer) return;

        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement('span');
        ripple.className = 'cta-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x - size / 2 + 'px';
        ripple.style.top = y - size / 2 + 'px';

        this.rippleContainer.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, this.config.rippleDuration);
    }

    /**
     * Update button text
     */
    setText(text) {
        if (this.ctaText) {
            this.ctaText.textContent = text;
        }
    }

    /**
     * Update button icon
     */
    setIcon(iconHtml) {
        if (this.ctaIcon) {
            this.ctaIcon.innerHTML = iconHtml;
        }
    }

    /**
     * Update button action
     */
    setAction(action) {
        this.element.dataset.action = action;
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // Restart pulsing if interval changed
        if (newConfig.pulseInterval && this.state.pulseIntervalId) {
            clearInterval(this.state.pulseIntervalId);
            this.startPulsing();
        }
    }

    /**
     * Show the CTA button
     */
    show() {
        this.element.style.display = '';
        this.element.classList.add('cta-visible');
    }

    /**
     * Hide the CTA button
     */
    hide() {
        this.element.classList.remove('cta-visible');
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 300);
    }

    /**
     * Destroy component
     */
    destroy() {
        // Clear pulse interval
        if (this.state.pulseIntervalId) {
            clearInterval(this.state.pulseIntervalId);
        }

        // Remove event listeners
        this.element.removeEventListener('mouseenter', this.handleMouseEnter);
        this.element.removeEventListener('mouseleave', this.handleMouseLeave);
        this.element.removeEventListener('mousemove', this.handleMouseMove);
        this.element.removeEventListener('click', this.handleClick);

        // Reset styles
        this.element.style.transform = '';
        this.element.classList.remove('cta-hovered', 'cta-pulsing', 'cta-visible');

        if (this.ctaBg) {
            this.ctaBg.style.opacity = '';
        }

        this.initialized = false;
        emit('component:cta:destroyed', { element: this.element });
    }
}
