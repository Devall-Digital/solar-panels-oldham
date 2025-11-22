/**
 * Component: Modal Dialog
 * Module: Components
 * Purpose: Overlay modal dialogs with backdrop and animations
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class ModalDialog {
    constructor(element) {
            this.element = element;
            this.backdrop = element.querySelector('.modal-backdrop');
            this.content = element.querySelector('.modal-content');
            this.closeBtn = element.querySelector('.modal-close');
        this.initialized = false;

        // Configuration
        this.config = {
            closeOnBackdrop: true,
            closeOnEscape: true,
            closeOnButton: true,
            preventScroll: true,
            animationDuration: 300,
            focusTrap: true,
            restoreFocus: true
        };

        // State
        this.state = {
            isOpen: false,
            isAnimating: false,
            previousActiveElement: null,
            focusableElements: [],
            eventListeners: new Map()
        };

        // Bind methods
        this.handleBackdropClick = this.onBackdropClick.bind(this);
        this.handleKeyDown = this.onKeyDown.bind(this);
        this.handleCloseClick = this.onCloseClick.bind(this);
        this.handleTransitionEnd = this.onTransitionEnd.bind(this);
    }

    async init() {
        try {
            console.log('Initializing Modal Dialog component');

            // Parse data attributes
            this.parseDataAttributes();

            // Set up event listeners
            this.setupEventListeners();
            
            // Set initial state
            this.element.setAttribute('aria-hidden', 'true');

            // Focus trap setup
            if (this.config.focusTrap) {
                this.setupFocusTrap();
            }
            
            this.initialized = true;
            emit('component:modal:initialized', { element: this.element });
            
        } catch (error) {
            console.error('Modal initialization failed:', error);
            emit('component:modal:error', { element: this.element, error });
        }
    }

    /**
     * Parse data attributes for configuration
     */
    parseDataAttributes() {
        // Close on backdrop
        const backdropAttr = this.element.dataset.backdropClose;
        if (backdropAttr !== undefined) {
            this.config.closeOnBackdrop = backdropAttr !== 'false';
        }

        // Close on escape
        const escapeAttr = this.element.dataset.escapeClose;
        if (escapeAttr !== undefined) {
            this.config.closeOnEscape = escapeAttr !== 'false';
        }

        // Close button
        const buttonAttr = this.element.dataset.closeButton;
        if (buttonAttr !== undefined) {
            this.config.closeOnButton = buttonAttr !== 'false';
        }

        // Prevent scroll
        const scrollAttr = this.element.dataset.preventScroll;
        if (scrollAttr !== undefined) {
            this.config.preventScroll = scrollAttr !== 'false';
        }

        // Animation duration
        const durationAttr = this.element.dataset.animationDuration;
        if (durationAttr) {
            this.config.animationDuration = parseInt(durationAttr);
        }

        // Focus trap
        const focusAttr = this.element.dataset.focusTrap;
        if (focusAttr !== undefined) {
            this.config.focusTrap = focusAttr !== 'false';
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Backdrop click
        if (this.config.closeOnBackdrop && this.backdrop) {
            this.backdrop.addEventListener('click', this.handleBackdropClick);
            this.state.eventListeners.set('backdrop', this.handleBackdropClick);
        }

        // Close button
        if (this.config.closeOnButton && this.closeBtn) {
            this.closeBtn.addEventListener('click', this.handleCloseClick);
            this.state.eventListeners.set('closeBtn', this.handleCloseClick);
        }

        // Transition end for animation cleanup
        if (this.content) {
            this.content.addEventListener('transitionend', this.handleTransitionEnd);
            this.state.eventListeners.set('transition', this.handleTransitionEnd);
        }
    }

    /**
     * Set up focus trap
     */
    setupFocusTrap() {
        this.updateFocusableElements();

        // Watch for dynamically added focusable elements
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(this.element, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['tabindex', 'disabled']
        });

        this.state.focusObserver = observer;
    }

    /**
     * Update list of focusable elements
     */
    updateFocusableElements() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ];

        this.state.focusableElements = Array.from(
            this.element.querySelectorAll(focusableSelectors.join(', '))
        ).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
    }

    /**
     * Show the modal
     */
    async show() {
        if (this.state.isOpen || this.state.isAnimating) return;

        this.state.isAnimating = true;

        // Store previous active element
        this.state.previousActiveElement = document.activeElement;
        
        // Prevent body scroll
        if (this.config.preventScroll) {
        document.body.style.overflow = 'hidden';
        }

        // Update ARIA attributes
        this.element.setAttribute('aria-hidden', 'false');
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');

        // Add modal-open class to body
        document.body.classList.add('modal-open');

        // Show modal
        this.element.style.display = 'block';

        // Force reflow
        this.element.offsetHeight;

        // Add open class for animation
        this.element.classList.add('modal-open');

        // Set up escape key listener
        if (this.config.closeOnEscape) {
            document.addEventListener('keydown', this.handleKeyDown);
            this.state.eventListeners.set('escape', this.handleKeyDown);
        }

        // Focus management
        if (this.config.focusTrap) {
            // Focus first focusable element or modal itself
            const firstFocusable = this.state.focusableElements[0];
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            } else {
                this.element.focus();
            }
        }

        // Emit show event
        emit('modal:show', { element: this.element });

        // Wait for animation
        await this.waitForAnimation();

        this.state.isOpen = true;
        this.state.isAnimating = false;

        emit('modal:shown', { element: this.element });
    }

    /**
     * Hide the modal
     */
    async hide() {
        if (!this.state.isOpen || this.state.isAnimating) return;

        this.state.isAnimating = true;

        // Remove open class
        this.element.classList.remove('modal-open');

        // Emit hide event
        emit('modal:hide', { element: this.element });
        
        // Wait for animation
        await this.waitForAnimation();

        // Hide modal
            this.element.style.display = 'none';
            
        // Restore body scroll
        if (this.config.preventScroll) {
                document.body.style.overflow = '';
            }
            
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');

        // Update ARIA attributes
        this.element.setAttribute('aria-hidden', 'true');

        // Restore focus
        if (this.config.restoreFocus && this.state.previousActiveElement) {
            this.state.previousActiveElement.focus();
        }

        // Remove escape key listener
        if (this.config.closeOnEscape) {
            document.removeEventListener('keydown', this.handleKeyDown);
            this.state.eventListeners.delete('escape');
        }

        this.state.isOpen = false;
        this.state.isAnimating = false;

        emit('modal:hidden', { element: this.element });
    }

    /**
     * Toggle modal visibility
     */
    async toggle() {
        if (this.state.isOpen) {
            await this.hide();
        } else {
            await this.show();
        }
    }

    /**
     * Wait for animation to complete
     */
    waitForAnimation() {
        return new Promise(resolve => {
            const duration = this.config.animationDuration;
            setTimeout(resolve, duration);
        });
    }

    /**
     * Handle backdrop click
     */
    onBackdropClick(event) {
        if (event.target === this.backdrop) {
            this.hide();
        }
    }

    /**
     * Handle close button click
     */
    onCloseClick() {
        this.hide();
    }

    /**
     * Handle key down events
     */
    onKeyDown(event) {
        if (event.key === 'Escape') {
            this.hide();
        } else if (event.key === 'Tab' && this.config.focusTrap) {
            this.handleTabKey(event);
        }
    }

    /**
     * Handle tab key for focus trap
     */
    handleTabKey(event) {
        if (this.state.focusableElements.length === 0) return;

        const firstElement = this.state.focusableElements[0];
        const lastElement = this.state.focusableElements[this.state.focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey) {
            // Shift + Tab
            if (activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Handle transition end
     */
    onTransitionEnd(event) {
        // Only handle transitions on the modal content
        if (event.target === this.content) {
            if (this.state.isOpen) {
                emit('modal:animation:complete', { element: this.element, type: 'show' });
            } else {
                emit('modal:animation:complete', { element: this.element, type: 'hide' });
            }
        }
    }

    /**
     * Update modal content
     */
    updateContent(header, body, footer) {
        const headerElement = this.element.querySelector('.modal-header .modal-title');
        const bodyElement = this.element.querySelector('.modal-body');
        const footerElement = this.element.querySelector('.modal-footer');

        if (headerElement && header !== undefined) {
            headerElement.textContent = header;
        }

        if (bodyElement && body !== undefined) {
            if (typeof body === 'string') {
                bodyElement.innerHTML = body;
            } else if (body instanceof Node) {
                bodyElement.innerHTML = '';
                bodyElement.appendChild(body);
            }
        }

        if (footerElement && footer !== undefined) {
            if (typeof footer === 'string') {
                footerElement.innerHTML = footer;
            } else if (footer instanceof Node) {
                footerElement.innerHTML = '';
                footerElement.appendChild(footer);
            }
        }

        // Update focusable elements if content changed
        if (this.config.focusTrap) {
            setTimeout(() => this.updateFocusableElements(), 0);
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Check if modal is open
     */
    isOpen() {
        return this.state.isOpen;
    }

    /**
     * Destroy component
     */
    destroy() {
        // Hide modal if open
        if (this.state.isOpen) {
            this.hide();
        }

        // Remove event listeners
        this.state.eventListeners.forEach((handler, event) => {
            switch (event) {
                case 'backdrop':
                    if (this.backdrop) this.backdrop.removeEventListener('click', handler);
                    break;
                case 'closeBtn':
                    if (this.closeBtn) this.closeBtn.removeEventListener('click', handler);
                    break;
                case 'transition':
                    if (this.content) this.content.removeEventListener('transitionend', handler);
                    break;
                case 'escape':
                    document.removeEventListener('keydown', handler);
                    break;
            }
        });

        // Disconnect focus observer
        if (this.state.focusObserver) {
            this.state.focusObserver.disconnect();
        }

        // Reset styles
        this.element.style.display = '';
        this.element.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');

        this.initialized = false;
        emit('component:modal:destroyed', { element: this.element });
    }
}
