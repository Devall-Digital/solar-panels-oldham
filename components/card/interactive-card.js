/**
 * Component: Interactive Card
 * Module: Components
 * Purpose: 3D tilt effect card with hover interactions
 * Dependencies: /core/events.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class InteractiveCard {
    constructor(element) {
        this.element = element;
        this.inner = element.querySelector('.card-inner');
        this.glow = element.querySelector('.card-glow');
        this.initialized = false;
        
        // Configuration
        this.config = {
            maxTilt: 15,
            perspective: 1000,
            scale: 1.05,
            speed: 300,
            glare: true,
            maxGlare: 0.3
        };
        
        // State
        this.state = {
            tiltX: 0,
            tiltY: 0,
            isHovering: false
        };
        
        // Bind methods
        this.handleMouseEnter = this.onMouseEnter.bind(this);
        this.handleMouseMove = this.onMouseMove.bind(this);
        this.handleMouseLeave = this.onMouseLeave.bind(this);
        this.handleClick = this.onClick.bind(this);
    }
    
    async init() {
        try {
            // Check if tilt is enabled
            const tiltEnabled = this.element.dataset.tilt !== 'false';
            
            if (tiltEnabled) {
                // Set up 3D perspective
                this.element.style.perspective = `${this.config.perspective}px`;
                
                // Add event listeners
                this.element.addEventListener('mouseenter', this.handleMouseEnter);
                this.element.addEventListener('mousemove', this.handleMouseMove);
                this.element.addEventListener('mouseleave', this.handleMouseLeave);
            }
            
            // Add click handler
            this.element.addEventListener('click', this.handleClick);
            
            // Initialize CTA button
            this.initCTAButton();
            
            // Add intersection observer for entrance animation
            this.setupIntersectionObserver();
            
            this.initialized = true;
            emit('component:card:initialized', { element: this.element });
            
        } catch (error) {
            console.error('Card initialization failed:', error);
            emit('component:card:error', { element: this.element, error });
        }
    }
    
    /**
     * Mouse enter handler
     */
    onMouseEnter(event) {
        this.state.isHovering = true;
        
        // Add hover class
        this.element.classList.add('is-hovering');
        
        // Scale up
        if (this.inner) {
            this.inner.style.transform = `scale(${this.config.scale})`;
        }
        
        // Show glow
        if (this.glow) {
            this.glow.style.opacity = '1';
        }
        
        emit('card:hover:enter', { element: this.element });
    }
    
    /**
     * Mouse move handler for 3D tilt
     */
    onMouseMove(event) {
        if (!this.state.isHovering) return;
        
        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation values
        const tiltX = ((y - centerY) / centerY) * this.config.maxTilt;
        const tiltY = ((centerX - x) / centerX) * this.config.maxTilt;
        
        // Update state
        this.state.tiltX = tiltX;
        this.state.tiltY = tiltY;
        
        // Apply transforms
        if (this.inner) {
            this.inner.style.transform = `
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg) 
                scale(${this.config.scale})
            `;
        }
        
        // Update glow position
        if (this.glow && this.config.glare) {
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            
            this.glow.style.background = `
                radial-gradient(
                    circle at ${glowX}% ${glowY}%,
                    rgba(255, 215, 0, ${this.config.maxGlare}),
                    transparent 50%
                )
            `;
        }
    }
    
    /**
     * Mouse leave handler
     */
    onMouseLeave(event) {
        this.state.isHovering = false;
        
        // Remove hover class
        this.element.classList.remove('is-hovering');
        
        // Reset transforms
        if (this.inner) {
            this.inner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        }
        
        // Hide glow
        if (this.glow) {
            this.glow.style.opacity = '0';
        }
        
        // Reset state
        this.state.tiltX = 0;
        this.state.tiltY = 0;
        
        emit('card:hover:leave', { element: this.element });
    }
    
    /**
     * Click handler
     */
    onClick(event) {
        // Check if it's the CTA button
        const button = event.target.closest('.card-cta');
        if (button) {
            event.stopPropagation();
            const action = button.dataset.action;
            emit('card:cta:click', { action, card: this.element });
            return;
        }
        
        // Card click
        emit('card:click', { element: this.element });
    }
    
    /**
     * Initialize CTA button effects
     */
    initCTAButton() {
        const button = this.element.querySelector('.card-cta');
        if (!button) return;
        
        // Add hover effect to arrow
        const arrow = button.querySelector('.arrow');
        if (arrow) {
            button.addEventListener('mouseenter', () => {
                arrow.style.transform = 'translateX(5px)';
            });
            
            button.addEventListener('mouseleave', () => {
                arrow.style.transform = 'translateX(0)';
            });
        }
    }
    
    /**
     * Set up intersection observer for entrance animation
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add visible class for animation
                        this.element.classList.add('is-visible');
                        
                        // Unobserve after animation
                        observer.unobserve(this.element);
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        observer.observe(this.element);
    }
    
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    /**
     * Enable/disable tilt
     */
    setTiltEnabled(enabled) {
        if (enabled) {
            this.element.addEventListener('mouseenter', this.handleMouseEnter);
            this.element.addEventListener('mousemove', this.handleMouseMove);
            this.element.addEventListener('mouseleave', this.handleMouseLeave);
        } else {
            this.element.removeEventListener('mouseenter', this.handleMouseEnter);
            this.element.removeEventListener('mousemove', this.handleMouseMove);
            this.element.removeEventListener('mouseleave', this.handleMouseLeave);
            
            // Reset transforms
            if (this.inner) {
                this.inner.style.transform = '';
            }
        }
    }
    
    /**
     * Destroy component
     */
    destroy() {
        // Remove event listeners
        this.element.removeEventListener('mouseenter', this.handleMouseEnter);
        this.element.removeEventListener('mousemove', this.handleMouseMove);
        this.element.removeEventListener('mouseleave', this.handleMouseLeave);
        this.element.removeEventListener('click', this.handleClick);
        
        // Reset styles
        if (this.inner) {
            this.inner.style.transform = '';
        }
        
        if (this.glow) {
            this.glow.style.opacity = '';
            this.glow.style.background = '';
        }
        
        // Remove classes
        this.element.classList.remove('is-hovering', 'is-visible');
        
        this.initialized = false;
        emit('component:card:destroyed', { element: this.element });
    }
}
