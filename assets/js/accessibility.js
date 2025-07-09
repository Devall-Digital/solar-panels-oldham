// Solar Panels Oldham - Accessibility Enhancement Module
// Improves keyboard navigation, screen reader support, and ARIA management

(function() {
    'use strict';

    // ===== ACCESSIBILITY STATE =====
    
    let isKeyboardUser = false;
    let currentFocusElement = null;
    let skipLinkTarget = null;

    // ===== KEYBOARD NAVIGATION =====

    // Detect keyboard users
    function initKeyboardDetection() {
        // Listen for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter' || 
                e.key === 'Space' || e.key === 'Escape') {
                isKeyboardUser = true;
                document.body.classList.add('keyboard-user');
            }
        });

        // Listen for mouse usage
        document.addEventListener('mousedown', () => {
            isKeyboardUser = false;
            document.body.classList.remove('keyboard-user');
        });

        // Listen for touch usage
        document.addEventListener('touchstart', () => {
            isKeyboardUser = false;
            document.body.classList.remove('keyboard-user');
        });
    }

    // Enhanced focus management
    function initFocusManagement() {
        // Track current focus
        document.addEventListener('focusin', (e) => {
            currentFocusElement = e.target;
            
            // Add focus indicator for keyboard users
            if (isKeyboardUser) {
                e.target.classList.add('focus-visible');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });

        // Handle focus trapping in modals
        initFocusTrapping();
        
        // Handle skip links
        initSkipLinks();
    }

    // Focus trapping for modals and dropdowns
    function initFocusTrapping() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        function trapFocus(element) {
            const focusableContent = element.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];

            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                }
            });
        }

        // Apply focus trapping to modals
        const modals = document.querySelectorAll('.modal, .dropdown, .mobile-menu');
        modals.forEach(modal => trapFocus(modal));
    }

    // Skip links for keyboard users
    function initSkipLinks() {
        // Create skip links if they don't exist
        if (!document.getElementById('skip-to-main')) {
            const skipLink = document.createElement('a');
            skipLink.id = 'skip-to-main';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Handle skip link functionality
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.focus();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Announce to screen readers
                    announceToScreenReader('Navigated to ' + targetElement.textContent.trim());
                }
            });
        });
    }

    // ===== SCREEN READER SUPPORT =====

    // Live region for announcements
    function initLiveRegions() {
        // Create live region if it doesn't exist
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    // Announce messages to screen readers
    function announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear the message after a short delay
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Enhanced form labels and descriptions
    function enhanceFormAccessibility() {
        const formFields = document.querySelectorAll('input, select, textarea');
        
        formFields.forEach(field => {
            // Ensure proper labeling
            if (!field.id && !field.getAttribute('aria-label')) {
                const label = field.closest('.form-group')?.querySelector('label');
                if (label && !label.getAttribute('for')) {
                    const fieldId = 'field-' + Math.random().toString(36).substr(2, 9);
                    field.id = fieldId;
                    label.setAttribute('for', fieldId);
                }
            }

            // Add error announcements
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                const errorMessage = field.validationMessage;
                announceToScreenReader('Error: ' + errorMessage);
            });

            // Add success announcements
            field.addEventListener('input', (e) => {
                if (field.validity.valid && field.classList.contains('error')) {
                    announceToScreenReader('Field is now valid');
                }
            });
        });
    }

    // ===== ARIA ATTRIBUTE MANAGEMENT =====

    // Dynamic ARIA attributes
    function initARIAmanagement() {
        // Update ARIA attributes for interactive elements
        updateARIAattributes();
        
        // Handle dynamic content updates
        observeContentChanges();
    }

    // Update ARIA attributes
    function updateARIAattributes() {
        // Navigation menu
        const navMenu = document.querySelector('.navbar-nav');
        if (navMenu) {
            navMenu.setAttribute('role', 'menubar');
            navMenu.setAttribute('aria-label', 'Main navigation');
            
            const navItems = navMenu.querySelectorAll('.nav-link');
            navItems.forEach((item, index) => {
                item.setAttribute('role', 'menuitem');
                item.setAttribute('aria-haspopup', 'false');
                item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            });
        }

        // FAQ accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                const questionId = 'faq-question-' + Math.random().toString(36).substr(2, 9);
                const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
                
                question.id = questionId;
                answer.id = answerId;
                
                question.setAttribute('aria-expanded', 'false');
                question.setAttribute('aria-controls', answerId);
                answer.setAttribute('aria-labelledby', questionId);
                answer.setAttribute('aria-hidden', 'true');
            }
        });

        // Form validation
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const field = group.querySelector('input, select, textarea');
            const errorMessage = group.querySelector('.error-message');
            
            if (field && errorMessage) {
                field.setAttribute('aria-describedby', errorMessage.id || 'error-' + Math.random().toString(36).substr(2, 9));
                errorMessage.setAttribute('role', 'alert');
            }
        });
    }

    // Observe content changes for dynamic updates
    function observeContentChanges() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // Update ARIA attributes for new content
                        updateARIAattributes();
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // ===== ENHANCED INTERACTIONS =====

    // Enhanced button interactions
    function enhanceButtonAccessibility() {
        const buttons = document.querySelectorAll('button, .btn, [role="button"]');
        
        buttons.forEach(button => {
            // Add keyboard support for custom buttons
            if (button.getAttribute('role') === 'button') {
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        button.click();
                    }
                });
            }

            // Add loading state announcements
            if (button.classList.contains('loading')) {
                button.setAttribute('aria-busy', 'true');
                announceToScreenReader('Loading, please wait');
            } else {
                button.setAttribute('aria-busy', 'false');
            }
        });
    }

    // Enhanced modal accessibility
    function enhanceModalAccessibility() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            // Set proper ARIA attributes
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            
            // Handle modal focus management
            const closeButton = modal.querySelector('.modal-close, [data-dismiss="modal"]');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    announceToScreenReader('Modal closed');
                });
            }

            // Announce modal opening
            modal.addEventListener('show.bs.modal', () => {
                announceToScreenReader('Modal opened');
            });
        });
    }

    // ===== COLOR CONTRAST & VISUAL ACCESSIBILITY =====

    // Check color contrast
    function checkColorContrast() {
        // This would typically use a color contrast library
        // For now, we'll add high contrast mode support
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        
        if (highContrastToggle) {
            highContrastToggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                
                // Save preference
                localStorage.setItem('highContrast', isHighContrast);
                
                // Announce change
                announceToScreenReader(
                    isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled'
                );
            });
        }

        // Load saved preference
        const savedHighContrast = localStorage.getItem('highContrast');
        if (savedHighContrast === 'true') {
            document.body.classList.add('high-contrast');
        }
    }

    // ===== REDUCED MOTION SUPPORT =====

    // Handle reduced motion preferences
    function initReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        function handleMotionPreference(e) {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                // Disable animations
                const animatedElements = document.querySelectorAll('[data-animation]');
                animatedElements.forEach(el => {
                    el.style.animation = 'none';
                    el.style.transition = 'none';
                });
            } else {
                document.body.classList.remove('reduced-motion');
            }
        }

        // Initial check
        handleMotionPreference(prefersReducedMotion);
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
    }

    // ===== INITIALIZATION =====

    // Initialize accessibility enhancements
    function init() {
        // Initialize keyboard detection
        initKeyboardDetection();
        
        // Initialize focus management
        initFocusManagement();
        
        // Initialize live regions
        initLiveRegions();
        
        // Enhance form accessibility
        enhanceFormAccessibility();
        
        // Initialize ARIA management
        initARIAmanagement();
        
        // Enhance button accessibility
        enhanceButtonAccessibility();
        
        // Enhance modal accessibility
        enhanceModalAccessibility();
        
        // Check color contrast
        checkColorContrast();
        
        // Initialize reduced motion support
        initReducedMotion();
        
        console.log('Accessibility enhancements initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for use in other scripts
    window.AccessibilityEnhancer = {
        announceToScreenReader,
        updateARIAattributes,
        initFocusManagement,
        initLiveRegions,
        enhanceFormAccessibility
    };

})();