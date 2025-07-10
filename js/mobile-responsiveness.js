// Solar Panels Oldham - Mobile Responsiveness Enhancement
// Comprehensive mobile optimization and responsive interactions

(function() {
    'use strict';

    const MobileResponsiveness = {
        isMobile: false,
        isTablet: false,
        isTouchDevice: false,
        viewportWidth: 0,
        viewportHeight: 0,
        orientation: 'portrait',
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        },
        
        init: function() {
            this.detectDevice();
            this.setupViewportMonitoring();
            this.enhanceTouchInteractions();
            this.optimizeMobileNavigation();
            this.improveFormExperience();
            this.enhanceScrollBehavior();
            this.optimizeImages();
            this.setupOrientationHandling();
            this.enhanceAccessibility();
        },
        
        detectDevice: function() {
            const userAgent = navigator.userAgent;
            this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            this.isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
            this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            // Add device classes to body
            document.body.classList.add(this.isMobile ? 'mobile-device' : 'desktop-device');
            if (this.isTablet) document.body.classList.add('tablet-device');
            if (this.isTouchDevice) document.body.classList.add('touch-device');
            
            // Set initial viewport dimensions
            this.updateViewportDimensions();
        },
        
        setupViewportMonitoring: function() {
            // Monitor viewport changes
            window.addEventListener('resize', this.debounce(() => {
                this.updateViewportDimensions();
                this.handleViewportChange();
            }, 250));
            
            // Monitor orientation changes
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.updateViewportDimensions();
                    this.handleOrientationChange();
                }, 100);
            });
        },
        
        updateViewportDimensions: function() {
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;
            this.orientation = this.viewportWidth > this.viewportHeight ? 'landscape' : 'portrait';
            
            // Update CSS custom properties
            document.documentElement.style.setProperty('--viewport-width', this.viewportWidth + 'px');
            document.documentElement.style.setProperty('--viewport-height', this.viewportHeight + 'px');
        },
        
        handleViewportChange: function() {
            // Adjust mobile menu behavior
            if (this.viewportWidth > this.breakpoints.mobile) {
                this.closeMobileMenu();
            }
            
            // Recalculate any dynamic layouts
            this.recalculateLayouts();
            
            // Optimize animations based on screen size
            this.optimizeAnimationsForScreen();
        },
        
        handleOrientationChange: function() {
            // Adjust hero section height
            const hero = document.querySelector('.hero');
            if (hero) {
                if (this.orientation === 'landscape' && this.isMobile) {
                    hero.style.minHeight = '100vh';
                } else {
                    hero.style.minHeight = '';
                }
            }
            
            // Recalculate floating elements
            this.recalculateFloatingElements();
        },
        
        enhanceTouchInteractions: function() {
            if (!this.isTouchDevice) return;
            
            // Enhanced touch feedback
            const touchElements = document.querySelectorAll('a, button, .interactive, .service-card, .link-item');
            touchElements.forEach(element => {
                element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
                element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            });
            
            // Prevent zoom on double tap
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (event) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Improve scroll performance
            this.optimizeScrollPerformance();
        },
        
        handleTouchStart: function(event) {
            const element = event.currentTarget;
            element.classList.add('touch-active');
            
            // Add ripple effect for touch devices
            this.createTouchRipple(event);
        },
        
        handleTouchEnd: function(event) {
            const element = event.currentTarget;
            setTimeout(() => {
                element.classList.remove('touch-active');
            }, 150);
        },
        
        createTouchRipple: function(event) {
            const element = event.currentTarget;
            const ripple = document.createElement('div');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.touches[0].clientX - rect.left - size / 2;
            const y = event.touches[0].clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: touchRipple 0.6s ease-out;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 1000;
            `;
            
            element.style.position = 'relative';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        },
        
        optimizeMobileNavigation: function() {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!navToggle || !navMenu) return;
            
            // Enhanced mobile menu behavior
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
            
            // Close menu on backdrop tap
            navMenu.addEventListener('click', (e) => {
                if (e.target === navMenu) {
                    this.closeMobileMenu();
                }
            });
            
            // Swipe to close menu
            this.setupSwipeToClose(navMenu);
        },
        
        toggleMobileMenu: function() {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!navToggle || !navMenu) return;
            
            const isOpen = navMenu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },
        
        openMobileMenu: function() {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            
            // Announce to screen readers
            this.announceToScreenReader('Navigation menu opened');
        },
        
        closeMobileMenu: function() {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            // Announce to screen readers
            this.announceToScreenReader('Navigation menu closed');
        },
        
        setupSwipeToClose: function(element) {
            let startX = 0;
            let startY = 0;
            let isDragging = false;
            
            element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isDragging = false;
            }, { passive: true });
            
            element.addEventListener('touchmove', (e) => {
                if (!isDragging) {
                    const deltaX = Math.abs(e.touches[0].clientX - startX);
                    const deltaY = Math.abs(e.touches[0].clientY - startY);
                    
                    if (deltaX > 10 && deltaX > deltaY) {
                        isDragging = true;
                    }
                }
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                if (isDragging) {
                    const deltaX = e.changedTouches[0].clientX - startX;
                    if (deltaX > 100) {
                        this.closeMobileMenu();
                    }
                }
            }, { passive: true });
        },
        
        improveFormExperience: function() {
            if (!this.isMobile) return;
            
            // Auto-focus first field on mobile
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const firstInput = form.querySelector('input, textarea, select');
                if (firstInput && !firstInput.value) {
                    setTimeout(() => {
                        firstInput.focus();
                    }, 500);
                }
            });
            
            // Optimize input types for mobile
            const inputs = document.querySelectorAll('input[type="tel"]');
            inputs.forEach(input => {
                input.setAttribute('inputmode', 'tel');
                input.setAttribute('pattern', '[0-9]*');
            });
            
            // Enhance form validation feedback
            this.enhanceFormValidation();
        },
        
        enhanceFormValidation: function() {
            const formFields = document.querySelectorAll('input, select, textarea');
            
            formFields.forEach(field => {
                field.addEventListener('invalid', (e) => {
                    e.preventDefault();
                    this.showMobileValidationError(field);
                });
                
                field.addEventListener('input', () => {
                    this.clearMobileValidationError(field);
                });
            });
        },
        
        showMobileValidationError: function(field) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;
            
            formGroup.classList.add('error');
            
            // Scroll to error field on mobile
            setTimeout(() => {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            
            // Vibrate on error (if supported)
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        },
        
        clearMobileValidationError: function(field) {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
            }
        },
        
        enhanceScrollBehavior: function() {
            if (!this.isMobile) return;
            
            // Smooth scroll for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.smoothScrollTo(target);
                    }
                });
            });
            
            // Optimize scroll performance
            this.optimizeScrollPerformance();
        },
        
        smoothScrollTo: function(target) {
            const offset = 80; // Account for fixed header
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },
        
        optimizeScrollPerformance: function() {
            // Use passive event listeners for better scroll performance
            const scrollOptions = { passive: true };
            
            // Optimize scroll event handlers
            const scrollElements = document.querySelectorAll('.scroll-effect, .parallax');
            scrollElements.forEach(element => {
                element.addEventListener('scroll', () => {}, scrollOptions);
            });
        },
        
        optimizeImages: function() {
            // Lazy load images on mobile
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            }
            
            // Optimize image loading for mobile
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (this.isMobile) {
                    img.loading = 'lazy';
                }
            });
        },
        
        setupOrientationHandling: function() {
            // Handle orientation-specific layouts
            const handleOrientation = () => {
                if (this.orientation === 'landscape' && this.isMobile) {
                    document.body.classList.add('mobile-landscape');
                } else {
                    document.body.classList.remove('mobile-landscape');
                }
            };
            
            handleOrientation();
            window.addEventListener('orientationchange', handleOrientation);
        },
        
        enhanceAccessibility: function() {
            // Improve focus management on mobile
            const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
            
            focusableElements.forEach(element => {
                element.addEventListener('focus', () => {
                    if (this.isMobile) {
                        // Ensure focused element is visible
                        setTimeout(() => {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                });
            });
            
            // Enhance keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        },
        
        recalculateLayouts: function() {
            // Recalculate any dynamic layouts
            const floatingElements = document.querySelectorAll('.floating-card, .hero-visual');
            floatingElements.forEach(element => {
                // Trigger layout recalculation
                element.style.transform = 'translateZ(0)';
            });
        },
        
        recalculateFloatingElements: function() {
            // Adjust floating elements for orientation changes
            const floatingCards = document.querySelectorAll('.floating-card');
            floatingCards.forEach(card => {
                if (this.orientation === 'landscape' && this.isMobile) {
                    card.style.position = 'relative';
                    card.style.top = 'auto';
                    card.style.right = 'auto';
                } else {
                    card.style.position = '';
                    card.style.top = '';
                    card.style.right = '';
                }
            });
        },
        
        optimizeAnimationsForScreen: function() {
            // Adjust animation complexity based on screen size
            if (this.viewportWidth < this.breakpoints.mobile) {
                document.body.classList.add('reduced-animations');
            } else {
                document.body.classList.remove('reduced-animations');
            }
        },
        
        announceToScreenReader: function(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                announcement.remove();
            }, 1000);
        },
        
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Public API
        getDeviceInfo: function() {
            return {
                isMobile: this.isMobile,
                isTablet: this.isTablet,
                isTouchDevice: this.isTouchDevice,
                viewportWidth: this.viewportWidth,
                viewportHeight: this.viewportHeight,
                orientation: this.orientation
            };
        },
        
        isMobileViewport: function() {
            return this.viewportWidth <= this.breakpoints.mobile;
        },
        
        isTabletViewport: function() {
            return this.viewportWidth > this.breakpoints.mobile && this.viewportWidth <= this.breakpoints.tablet;
        }
    };

    // Add CSS for mobile enhancements
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        /* Touch ripple animation */
        @keyframes touchRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Touch active state */
        .touch-active {
            transform: scale(0.98);
            transition: transform 0.1s ease-out;
        }
        
        /* Mobile landscape adjustments */
        .mobile-landscape .hero {
            min-height: 100vh;
        }
        
        .mobile-landscape .floating-card {
            position: relative !important;
            top: auto !important;
            right: auto !important;
        }
        
        /* Reduced animations for mobile */
        .reduced-animations * {
            animation-duration: 0.3s !important;
            transition-duration: 0.2s !important;
        }
        
        /* Screen reader only */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* Mobile form enhancements */
        .mobile-device input,
        .mobile-device select,
        .mobile-device textarea {
            font-size: 16px !important; /* Prevents zoom on iOS */
        }
        
        .mobile-device .form-group.error {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        /* Mobile navigation enhancements */
        .mobile-device .nav-menu {
            transition: transform 0.3s ease-out;
        }
        
        .mobile-device .nav-menu.active {
            transform: translateX(0);
        }
        
        /* Mobile menu backdrop */
        .menu-open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
        }
    `;
    document.head.appendChild(mobileStyles);

    // Initialize mobile responsiveness
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MobileResponsiveness.init();
        });
    } else {
        MobileResponsiveness.init();
    }

    // Export for use in other modules
    window.MobileResponsiveness = MobileResponsiveness;
})();