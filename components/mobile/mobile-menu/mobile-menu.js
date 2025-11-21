/**
 * Component: Mobile Menu
 * Module: Navigation
 * Purpose: Accessible slide-down mobile navigation with focus management
 * Dependencies: /core/events.js
 * Author: GPT-5.1 Codex
 * Date: November 2025
 */

import { emit, on } from '/core/events.js';

export default class MobileMenu {
    constructor(element) {
        this.element = element;
        this.toggleButton = element?.querySelector('.menu-toggle') || null;
        this.menuPanel = element?.querySelector('.menu-panel') || null;
        this.menuList = element?.querySelector('.menu-list') || null;
        this.focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        this.isOpen = false;
        this.previousFocus = null;
        this.boundToggle = this.handleToggle.bind(this);
        this.boundOutsideClick = this.handleOutsideClick.bind(this);
        this.boundKeydown = this.handleKeydown.bind(this);
        this.boundCloseRequest = () => this.closeMenu();
        this.boundListClick = (event) => this.handleListClick(event);
        this.breakpointQuery = window.matchMedia('(min-width: 1024px)');
        this.boundBreakpointChange = (event) => this.handleBreakpointChange(event);
        this.unsubscribe = [];
    }

    async init() {
        if (!this.element || !this.toggleButton || !this.menuPanel) {
            emit('mobile-menu:error', { message: 'Missing required mobile menu elements' });
            return;
        }

        if (!this.menuPanel.id) {
            this.menuPanel.id = `mobile-menu-panel-${Date.now()}`;
        }

        this.element.dataset.menuState = 'closed';
        this.toggleButton.setAttribute('aria-controls', this.menuPanel.id);
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.toggleButton.setAttribute('aria-haspopup', 'dialog');
        this.menuPanel.setAttribute('aria-hidden', 'true');

        this.toggleButton.addEventListener('click', this.boundToggle);
        this.element.addEventListener('mobile-menu:request-close', this.boundCloseRequest);
        this.menuList?.addEventListener('click', this.boundListClick);

        if (this.breakpointQuery.addEventListener) {
            this.breakpointQuery.addEventListener('change', this.boundBreakpointChange);
        } else if (this.breakpointQuery.addListener) {
            this.breakpointQuery.addListener(this.boundBreakpointChange);
        }

        this.unsubscribe.push(on('route:change', () => this.closeMenu()));

        emit('mobile-menu:initialized', { element: this.element });
    }

    handleToggle() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.previousFocus = document.activeElement;
        this.element.dataset.menuState = 'open';
        this.toggleButton.setAttribute('aria-expanded', 'true');
        this.menuPanel.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('nav-menu-open');
        document.body.classList.add('nav-menu-open');

        document.addEventListener('click', this.boundOutsideClick, true);
        document.addEventListener('keydown', this.boundKeydown);

        this.focusFirstItem();
        emit('mobile-menu:state-change', { open: true });
    }

    closeMenu() {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;
        this.element.dataset.menuState = 'closed';
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.menuPanel.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('nav-menu-open');
        document.body.classList.remove('nav-menu-open');

        document.removeEventListener('click', this.boundOutsideClick, true);
        document.removeEventListener('keydown', this.boundKeydown);

        if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
            this.previousFocus.focus({ preventScroll: true });
        }

        emit('mobile-menu:state-change', { open: false });
    }

    handleOutsideClick(event) {
        if (!this.element.contains(event.target)) {
            this.closeMenu();
        }
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            this.closeMenu();
            return;
        }

        if (event.key === 'Tab') {
            this.maintainFocusTrap(event);
        }
    }

    maintainFocusTrap(event) {
        const focusable = this.getFocusableElements();
        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    handleListClick(event) {
        const navLink = event.target.closest('.nav-link');
        if (navLink) {
            this.closeMenu();
        }
    }

    focusFirstItem() {
        const focusable = this.getFocusableElements();
        if (focusable.length) {
            focusable[0].focus({ preventScroll: true });
        }
    }

    getFocusableElements() {
        if (!this.menuPanel) {
            return [];
        }

        return Array.from(this.menuPanel.querySelectorAll(this.focusableSelectors))
            .filter((element) => {
                if (element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true') {
                    return false;
                }
                const rect = element.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });
    }

    handleBreakpointChange(event) {
        if (event.matches) {
            this.closeMenu();
        }
    }

    destroy() {
        this.closeMenu();

        this.toggleButton?.removeEventListener('click', this.boundToggle);
        this.element?.removeEventListener('mobile-menu:request-close', this.boundCloseRequest);
        this.menuList?.removeEventListener('click', this.boundListClick);

        if (this.breakpointQuery.removeEventListener) {
            this.breakpointQuery.removeEventListener('change', this.boundBreakpointChange);
        } else if (this.breakpointQuery.removeListener) {
            this.breakpointQuery.removeListener(this.boundBreakpointChange);
        }

        this.unsubscribe.forEach((unsubscribe) => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });

        emit('mobile-menu:destroyed');
    }
}

