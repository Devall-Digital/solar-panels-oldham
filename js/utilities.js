// Solar Panels Oldham - Utilities Module
// Handles inline JavaScript functions and utility operations

(function() {
    'use strict';

    const Utilities = {
        init: function() {
            this.setupAnalytics();
            this.ensureContentVisibility();
            this.handlePageSpecificFunctions();
            this.setupGlobalUtilities();
        },
        
        setupAnalytics: function() {
            // Google Analytics setup (moved from inline HTML)
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
            
            // Track 404 errors
            if (window.location.pathname === '/404.html' || window.location.pathname === '/404') {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_view', {
                        page_title: '404 Error',
                        page_location: window.location.href,
                        page_path: '/404'
                    });
                }
            }
            
            // Track thank you page
            if (window.location.pathname.includes('thank-you')) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        send_to: 'G-XXXXXXXXXX/conversion'
                    });
                }
            }
        },
        
        ensureContentVisibility: function() {
            // Remove no-js class immediately if JavaScript is working
            document.documentElement.classList.remove('no-js');
            document.documentElement.classList.add('js');
            
            // Force show all hidden content (moved from inline HTML)
            document.addEventListener('DOMContentLoaded', function() {
                // Force show all hidden content
                const hiddenElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-item');
                hiddenElements.forEach(el => {
                    el.classList.add('active');
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                
                // Remove any performance mode notifications
                setTimeout(() => {
                    const perfNotifications = document.querySelectorAll('.error-mode-notification');
                    perfNotifications.forEach(notification => notification.remove());
                }, 100);
                
                // Fix any layout issues
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 500);
            });
        },
        
        handlePageSpecificFunctions: function() {
            // Handle thank you page redirect
            if (window.location.pathname.includes('thank-you')) {
                this.setupThankYouRedirect();
            }
            
            // Handle 404 page specific functions
            if (window.location.pathname === '/404.html' || window.location.pathname === '/404') {
                this.setup404PageFunctions();
            }
        },
        
        setupThankYouRedirect: function() {
            // Redirect to home after 10 seconds (moved from inline HTML)
            setTimeout(() => {
                window.location.href = '/';
            }, 10000);
        },
        
        setup404PageFunctions: function() {
            // Any 404 page specific functionality can be added here
            console.log('404 page loaded - tracking error');
        },
        
        setupGlobalUtilities: function() {
            // Global utility functions
            this.setupErrorHandling();
            this.setupPerformanceMonitoring();
            this.setupAccessibilityEnhancements();
        },
        
        setupErrorHandling: function() {
            // Global error handler
            window.addEventListener('error', (e) => {
                console.error('Global error caught:', e.error);
                
                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'exception', {
                        description: e.error?.message || 'Unknown error',
                        fatal: false
                    });
                }
            });
            
            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', (e) => {
                console.error('Unhandled promise rejection:', e.reason);
                
                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'exception', {
                        description: 'Unhandled promise rejection: ' + e.reason,
                        fatal: false
                    });
                }
            });
        },
        
        setupPerformanceMonitoring: function() {
            // Monitor page load performance
            window.addEventListener('load', () => {
                if ('performance' in window) {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                        
                        // Send performance data to analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'timing_complete', {
                                name: 'load',
                                value: Math.round(loadTime)
                            });
                        }
                        
                        // Log performance metrics
                        if (window.SolarConfig && window.SolarConfig.debug) {
                            console.log('Page load time:', loadTime + 'ms');
                        }
                    }
                }
            });
        },
        
        setupAccessibilityEnhancements: function() {
            // Skip link functionality
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
            
            // Announce page changes to screen readers
            this.announcePageChange();
        },
        
        announcePageChange: function() {
            // Announce page title changes to screen readers
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
                        const newTitle = document.title;
                        this.announceToScreenReader('Page loaded: ' + newTitle);
                    }
                });
            });
            
            observer.observe(document.head, {
                childList: true,
                subtree: true
            });
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
        
        // Utility functions
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
        
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // DOM utilities
        createElement: function(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            
            // Set attributes
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'textContent') {
                    element.textContent = attributes[key];
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            // Add children
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
            
            return element;
        },
        
        // String utilities
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        formatPhoneNumber: function(phone) {
            // Format UK phone numbers
            const cleaned = phone.replace(/\D/g, '');
            if (cleaned.length === 11 && cleaned.startsWith('0')) {
                return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
            }
            return phone;
        },
        
        formatCurrency: function(amount, currency = 'GBP') {
            return new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },
        
        // Date utilities
        formatDate: function(date) {
            return new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date));
        },
        
        // Validation utilities
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        isValidPhone: function(phone) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
            return phoneRegex.test(phone);
        },
        
        // Storage utilities
        setLocalStorage: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
                return false;
            }
        },
        
        getLocalStorage: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },
        
        // Network utilities
        isOnline: function() {
            return navigator.onLine;
        },
        
        // Device utilities
        getDeviceType: function() {
            const userAgent = navigator.userAgent;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
                return 'mobile';
            } else if (/iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)) {
                return 'tablet';
            }
            return 'desktop';
        },
        
        // Public API
        getUtilities: function() {
            return {
                debounce: this.debounce,
                throttle: this.throttle,
                createElement: this.createElement,
                capitalize: this.capitalize,
                formatPhoneNumber: this.formatPhoneNumber,
                formatCurrency: this.formatCurrency,
                formatDate: this.formatDate,
                isValidEmail: this.isValidEmail,
                isValidPhone: this.isValidPhone,
                setLocalStorage: this.setLocalStorage,
                getLocalStorage: this.getLocalStorage,
                isOnline: this.isOnline,
                getDeviceType: this.getDeviceType
            };
        }
    };

    // Add CSS for utilities
    const utilityStyles = document.createElement('style');
    utilityStyles.textContent = `
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
        
        /* Skip link */
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        }
        
        .skip-link:focus {
            top: 6px;
        }
    `;
    document.head.appendChild(utilityStyles);

    // Initialize utilities
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            Utilities.init();
        });
    } else {
        Utilities.init();
    }

    // Export for use in other modules
    window.Utilities = Utilities;
})();