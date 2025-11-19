/**
 * Component: Loading Animation
 * Module: Components
 * Purpose: Solar-themed loading animation
 * Dependencies: None
 * Author: Initial Setup Agent
 * Date: November 2024
 */

export default class LoadingAnimation {
    constructor(element) {
        this.element = element;
        this.panels = element.querySelectorAll('.panel');
        this.sun = element.querySelector('.sun');
        this.text = element.querySelector('.loading-text');
        this.initialized = false;
    }
    
    async init() {
        // Component is CSS-only, just mark as initialized
        this.initialized = true;
        
        // Add random delays to panels for organic feel
        this.panels.forEach((panel, index) => {
            panel.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    /**
     * Update loading text
     */
    setText(text) {
        if (this.text) {
            this.text.textContent = text;
        }
    }
    
    /**
     * Show loader
     */
    show() {
        this.element.style.display = 'flex';
        this.element.classList.add('active');
    }
    
    /**
     * Hide loader
     */
    hide() {
        this.element.classList.remove('active');
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 300);
    }
    
    destroy() {
        this.initialized = false;
    }
}
