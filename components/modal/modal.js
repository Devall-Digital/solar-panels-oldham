/**
 * Component: Modal
 * Purpose: Reusable modal dialog component
 * Dependencies: /core/events.js
 */

import { emit } from '/core/events.js';

export default class Modal {
    constructor() {
        this.activeModals = new Set();
        this.initialized = false;
    }

    /**
     * Initialize modal component
     */
    async init(element) {
        try {
            this.element = element;
            this.backdrop = element.querySelector('.modal-backdrop');
            this.content = element.querySelector('.modal-content');
            this.closeBtn = element.querySelector('.modal-close');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Handle initial state
            if (element.classList.contains('active')) {
                this.open();
            }
            
            this.initialized = true;
            emit('component:modal:initialized', { id: element.id });
            
        } catch (error) {
            console.error('Modal initialization failed:', error);
            emit('component:modal:error', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
        
        // Prevent content clicks from closing
        if (this.content) {
            this.content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    /**
     * Open modal
     */
    open() {
        // Show the modal
        this.element.style.display = 'block';
        
        // Trigger reflow for animation
        void this.element.offsetHeight;
        
        // Add active class
        this.element.classList.add('active');
        
        // Add to active modals
        this.activeModals.add(this);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Emit event
        emit('component:modal:opened', { id: this.element.id });
    }

    /**
     * Close modal
     */
    close() {
        // Remove active class
        this.element.classList.remove('active');
        
        // Wait for animation
        setTimeout(() => {
            this.element.style.display = 'none';
            
            // Remove from active modals
            this.activeModals.delete(this);
            
            // Restore body scroll if no other modals
            if (this.activeModals.size === 0) {
                document.body.style.overflow = '';
            }
            
            // Emit event
            emit('component:modal:closed', { id: this.element.id });
        }, 300);
    }

    /**
     * Check if modal is open
     */
    isOpen() {
        return this.element.classList.contains('active');
    }

    /**
     * Toggle modal
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        this.close();
        this.initialized = false;
        emit('component:modal:destroyed', { id: this.element.id });
    }
}
