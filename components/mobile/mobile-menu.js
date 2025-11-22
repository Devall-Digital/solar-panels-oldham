/**
 * Component: Mobile Menu
 * Module: Components
 * Purpose: Responsive navigation menu with smooth animations
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class MobileMenu {
    constructor(element) {
        this.element = element;
        this.toggleButton = element.querySelector('.menu-toggle');
        this.menuPanel = element.querySelector('.menu-panel');
        this.menuList = element.querySelector('.menu-list');
        this.hamburgerSpans = element.querySelectorAll('.hamburger span');

        this.state = {
            isOpen: false,
            isAnimating: false
        };

        // Bind methods
        this.handleToggle = this.handleToggle.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);

        this.init();
    }

    async init() {
        try {
            console.log('Initializing Mobile Menu component');

            // Set up event listeners
            this.setupEventListeners();

            // Set initial state
            this.updateMenuState();

            emit('component:mobile-menu:initialized', { element: this.element });

        } catch (error) {
            console.error('Mobile menu initialization failed:', error);
            emit('component:mobile-menu:error', { element: this.element, error });
        }
    }

    setupEventListeners() {
        // Toggle button click
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', this.handleToggle);
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown);

        // Click outside to close
        document.addEventListener('click', this.handleClickOutside);

        // Handle menu link clicks
        if (this.menuList) {
            this.menuList.addEventListener('click', this.handleLinkClick);
        }
    }

    handleToggle(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.isAnimating) return;

        this.state.isOpen = !this.state.isOpen;
        this.animateMenu();
        this.updateMenuState();

        emit('mobile-menu:toggle', {
            element: this.element,
            isOpen: this.state.isOpen
        });
    }

    handleKeydown(event) {
        // Close menu on Escape
        if (event.key === 'Escape' && this.state.isOpen) {
            this.closeMenu();
        }
    }

    handleClickOutside(event) {
        if (this.state.isOpen &&
            !this.element.contains(event.target)) {
            this.closeMenu();
        }
    }

    handleLinkClick(event) {
        // Close menu when clicking menu links
        if (event.target.tagName === 'A') {
            this.closeMenu();

            emit('mobile-menu:link-clicked', {
                element: this.element,
                link: event.target
            });
        }
    }

    openMenu() {
        if (this.state.isOpen || this.state.isAnimating) return;

        this.state.isOpen = true;
        this.animateMenu();
        this.updateMenuState();

        emit('mobile-menu:opened', { element: this.element });
    }

    closeMenu() {
        if (!this.state.isOpen || this.state.isAnimating) return;

        this.state.isOpen = false;
        this.animateMenu();
        this.updateMenuState();

        emit('mobile-menu:closed', { element: this.element });
    }

    animateMenu() {
        this.state.isAnimating = true;

        // Animate hamburger icon
        this.animateHamburger();

        // Animate menu panel
        this.animateMenuPanel();

        // Reset animation flag after transition
        setTimeout(() => {
            this.state.isAnimating = false;
        }, 300);
    }

    animateHamburger() {
        const spans = this.hamburgerSpans;

        if (this.state.isOpen) {
            // Transform to X
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            // Reset to hamburger
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    animateMenuPanel() {
        if (!this.menuPanel) return;

        if (this.state.isOpen) {
            this.menuPanel.style.transform = 'translateX(0)';
            this.menuPanel.style.opacity = '1';
            this.element.classList.add('menu-open');
        } else {
            this.menuPanel.style.transform = 'translateX(100%)';
            this.menuPanel.style.opacity = '0';
            this.element.classList.remove('menu-open');
        }
    }

    updateMenuState() {
        // Update ARIA attributes
        if (this.toggleButton) {
            this.toggleButton.setAttribute('aria-expanded', this.state.isOpen);
        }

        // Update body scroll lock
        document.body.style.overflow = this.state.isOpen ? 'hidden' : '';

        // Update classes
        this.element.classList.toggle('is-open', this.state.isOpen);
    }

    /**
     * Get current menu state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Set menu items programmatically
     */
    setMenuItems(items) {
        if (!this.menuList) return;

        this.menuList.innerHTML = items;
    }

    /**
     * Destroy component
     */
    destroy() {
        // Remove event listeners
        if (this.toggleButton) {
            this.toggleButton.removeEventListener('click', this.handleToggle);
        }

        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleClickOutside);

        if (this.menuList) {
            this.menuList.removeEventListener('click', this.handleLinkClick);
        }

        // Reset body styles
        document.body.style.overflow = '';

        // Reset classes
        this.element.classList.remove('is-open', 'menu-open');

        emit('component:mobile-menu:destroyed', { element: this.element });
    }
}
