/**
 * Component: Navigation Header
 * Module: Navigation
 * Purpose: Interactive navigation with scroll detection and mobile menu
 * Dependencies: core/state.js, core/events.js, assets/css/animations.css
 * Author: Nav-Dev-Agent-001
 * Date: 2025-11-21
 */

class NavigationComponent {
    constructor(element) {
        this.element = element;
        this.header = element;
        this.container = element.querySelector('.nav-container');
        this.menuToggle = element.querySelector('.menu-toggle');
        this.mobilePanel = element.querySelector('.mobile-menu-panel');
        this.mobileClose = element.querySelector('.mobile-menu-close');
        this.navLinks = element.querySelectorAll('.nav-link, .mobile-nav-link');

        // State tracking
        this.state = {
            isVisible: false,
            isSticky: false,
            isMobileMenuOpen: false,
            lastScrollY: 0,
            scrollThreshold: 100
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setInitialState();
        this.handleScroll();

        // Listen for route changes
        if (window.app && window.app.eventBus) {
            window.app.eventBus.on('route:changed', (data) => {
                this.updateActiveLink(data.path);
            });
        }
    }

    bindEvents() {
        // Scroll detection
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Mobile menu close
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', this.closeMobileMenu.bind(this));
        }

        // Mobile menu overlay click
        if (this.mobilePanel) {
            this.mobilePanel.addEventListener('click', (e) => {
                if (e.target === this.mobilePanel) {
                    this.closeMobileMenu();
                }
            });
        }

        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setInitialState() {
        // Check if we're on a specific page and set active state
        const currentPath = window.location.pathname;
        this.updateActiveLink(currentPath);

        // Show navigation immediately if not at top
        if (window.scrollY > 50) {
            this.showNavigation();
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - this.state.lastScrollY;

        // Show/hide based on scroll direction and position
        if (currentScrollY > this.state.scrollThreshold) {
            if (scrollDelta < 0 && !this.state.isVisible) {
                // Scrolling up - show navigation
                this.showNavigation();
            } else if (scrollDelta > 0 && this.state.isVisible && currentScrollY > 200) {
                // Scrolling down - hide navigation
                this.hideNavigation();
            }
        } else {
            // At top - hide navigation
            if (this.state.isVisible) {
                this.hideNavigation();
            }
        }

        // Sticky state
        const shouldBeSticky = currentScrollY > 100;
        if (shouldBeSticky !== this.state.isSticky) {
            this.state.isSticky = shouldBeSticky;
            this.updateStickyState();
        }

        this.state.lastScrollY = currentScrollY;
    }

    showNavigation() {
        this.state.isVisible = true;
        this.header.classList.add('is-visible');

        // Trigger dopamine effect - slight bounce
        this.animateLogo();

        // Emit event for other components
        if (window.app && window.app.eventBus) {
            window.app.eventBus.emit('nav:shown');
        }
    }

    hideNavigation() {
        this.state.isVisible = false;
        this.header.classList.remove('is-visible');

        // Close mobile menu if open
        if (this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Emit event for other components
        if (window.app && window.app.eventBus) {
            window.app.eventBus.emit('nav:hidden');
        }
    }

    updateStickyState() {
        if (this.state.isSticky) {
            this.header.classList.add('is-sticky');
        } else {
            this.header.classList.remove('is-sticky');
        }
    }

    animateLogo() {
        const logo = this.header.querySelector('.nav-logo');
        if (logo) {
            logo.style.animation = 'none';
            logo.offsetHeight; // Trigger reflow
            logo.style.animation = 'logoBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }
    }

    toggleMobileMenu() {
        if (this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.state.isMobileMenuOpen = true;
        this.mobilePanel.classList.add('is-open');
        this.menuToggle.classList.add('is-active');
        this.menuToggle.setAttribute('aria-expanded', 'true');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        this.mobilePanel.focus();

        // Emit event
        if (window.app && window.app.eventBus) {
            window.app.eventBus.emit('mobile-menu:opened');
        }
    }

    closeMobileMenu() {
        this.state.isMobileMenuOpen = false;
        this.mobilePanel.classList.remove('is-open');
        this.menuToggle.classList.remove('is-active');
        this.menuToggle.setAttribute('aria-expanded', 'false');

        // Restore body scroll
        document.body.style.overflow = '';

        // Emit event
        if (window.app && window.app.eventBus) {
            window.app.eventBus.emit('mobile-menu:closed');
        }
    }

    handleNavClick(e) {
        const link = e.currentTarget;
        const action = link.getAttribute('data-action');
        const href = link.getAttribute('href');

        // Handle SPA routing if applicable
        if (action && action !== '#') {
            e.preventDefault();

            if (window.app && window.app.router) {
                window.app.router.navigate(href);
            } else {
                // Fallback to normal navigation
                window.location.href = href;
            }

            // Close mobile menu
            if (this.state.isMobileMenuOpen) {
                this.closeMobileMenu();
            }

            // Emit navigation event
            if (window.app && window.app.eventBus) {
                window.app.eventBus.emit('nav:link-clicked', { action, href });
            }
        }
    }

    updateActiveLink(currentPath) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Find and activate current page link
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (href === '/' && currentPath === '/')) {
                link.classList.add('active');
            }
        });
    }

    handleKeydown(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    // Public API methods
    show() {
        this.showNavigation();
    }

    hide() {
        this.hideNavigation();
    }

    setActiveLink(path) {
        this.updateActiveLink(path);
    }

    // Cleanup method
    destroy() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('keydown', this.handleKeydown.bind(this));

        if (this.menuToggle) {
            this.menuToggle.removeEventListener('click', this.toggleMobileMenu.bind(this));
        }

        if (this.mobileClose) {
            this.mobileClose.removeEventListener('click', this.mobileClose.bind(this));
        }

        if (this.mobilePanel) {
            this.mobilePanel.removeEventListener('click', this.closeMobileMenu.bind(this));
        }

        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavClick.bind(this));
        });
    }
}

// CSS Animation for logo bounce
const logoBounceKeyframes = `
@keyframes logoBounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
`;

// Inject keyframes if not already present
if (!document.querySelector('#logo-bounce-keyframes')) {
    const style = document.createElement('style');
    style.id = 'logo-bounce-keyframes';
    style.textContent = logoBounceKeyframes;
    document.head.appendChild(style);
}

// Auto-initialize component
document.addEventListener('DOMContentLoaded', () => {
    const navElement = document.querySelector('[data-component="navigation"]');
    if (navElement) {
        navElement.navigationComponent = new NavigationComponent(navElement);
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationComponent;
}
