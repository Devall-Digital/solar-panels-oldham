// Solar Panels Oldham - Mobile Optimization Module
// Fixes mobile jittering and performance issues

(function() {
    'use strict';

    // Mobile detection and optimization
    const MobileOptimizer = {
        isMobile: false,
        isTablet: false,
        isLowEndDevice: false,
        reducedMotion: false,
        animationFrameId: null,
        activeAnimations: new Set(),
        
        init: function() {
            this.detectDevice();
            this.setupOptimizations();
            this.preventConflicts();
            this.optimizeAnimations();
        },
        
        detectDevice: function() {
            const userAgent = navigator.userAgent;
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            // Mobile detection
            this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            this.isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
            
            // Low-end device detection
            const memory = navigator.deviceMemory || 4;
            const cores = navigator.hardwareConcurrency || 4;
            this.isLowEndDevice = memory < 4 || cores < 4;
            
            // Reduced motion preference
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Connection quality
            if (connection) {
                const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                       connection.effectiveType === '2g' || 
                                       connection.effectiveType === '3g';
                if (isSlowConnection) {
                    this.isLowEndDevice = true;
                }
            }
            
            // Add device classes to body
            document.body.classList.add(this.isMobile ? 'mobile-device' : 'desktop-device');
            if (this.isTablet) document.body.classList.add('tablet-device');
            if (this.isLowEndDevice) document.body.classList.add('low-end-device');
            if (this.reducedMotion) document.body.classList.add('reduced-motion');
        },
        
        setupOptimizations: function() {
            if (this.isMobile || this.isLowEndDevice) {
                // Disable heavy animations on mobile/low-end devices
                this.disableHeavyAnimations();
                
                // Optimize scroll performance
                this.optimizeScrollPerformance();
                
                // Reduce animation complexity
                this.reduceAnimationComplexity();
            }
            
            if (this.reducedMotion) {
                this.disableAllAnimations();
            }
        },
        
        disableHeavyAnimations: function() {
            // Disable custom cursor on mobile
            const cursorElements = document.querySelectorAll('.cursor-outline, .cursor-dot, .cursor-follower');
            cursorElements.forEach(el => {
                el.style.display = 'none';
            });
            
            // Disable particle effects
            const particleElements = document.querySelectorAll('.particle, .pulse-circle, .rotating-border');
            particleElements.forEach(el => {
                el.style.animation = 'none';
                el.style.display = 'none';
            });
            
            // Disable complex parallax
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                el.removeAttribute('data-parallax');
            });
        },
        
        optimizeScrollPerformance: function() {
            // Use passive event listeners for better scroll performance
            const scrollOptions = { passive: true };
            
            // Optimize scroll event handlers
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'scroll' || type === 'touchmove') {
                    options = { ...options, passive: true };
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
            
            // Throttle scroll events more aggressively on mobile
            if (this.isMobile) {
                this.throttleScrollEvents();
            }
        },
        
        throttleScrollEvents: function() {
            let ticking = false;
            const scrollHandlers = [];
            
            // Intercept scroll event handlers
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'scroll') {
                    const throttledListener = function(e) {
                        if (!ticking) {
                            requestAnimationFrame(() => {
                                listener.call(this, e);
                                ticking = false;
                            });
                            ticking = true;
                        }
                    };
                    scrollHandlers.push({ original: listener, throttled: throttledListener });
                    return originalAddEventListener.call(this, type, throttledListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        },
        
        reduceAnimationComplexity: function() {
            // Reduce animation duration and complexity
            const style = document.createElement('style');
            style.textContent = `
                .mobile-device *,
                .low-end-device * {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.2s !important;
                }
                
                .mobile-device .floating-card,
                .low-end-device .floating-card {
                    animation: none !important;
                    transform: none !important;
                }
                
                .mobile-device .hero-image,
                .low-end-device .hero-image {
                    transform: none !important;
                }
                
                .mobile-device .stat,
                .low-end-device .stat {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        disableAllAnimations: function() {
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion *,
                .reduced-motion *::before,
                .reduced-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        preventConflicts: function() {
            // Prevent multiple animation loops from running simultaneously
            this.manageAnimationLoops();
            
            // Prevent touch event conflicts
            this.preventTouchConflicts();
            
            // Prevent scroll event conflicts
            this.preventScrollConflicts();
        },
        
        manageAnimationLoops: function() {
            // Track all requestAnimationFrame calls
            const originalRequestAnimationFrame = window.requestAnimationFrame;
            window.requestAnimationFrame = (callback) => {
                const id = originalRequestAnimationFrame.call(window, callback);
                this.activeAnimations.add(id);
                return id;
            };
            
            // Track all cancelAnimationFrame calls
            const originalCancelAnimationFrame = window.cancelAnimationFrame;
            window.cancelAnimationFrame = (id) => {
                this.activeAnimations.delete(id);
                return originalCancelAnimationFrame.call(window, id);
            };
            
            // Clean up animations on page unload
            window.addEventListener('beforeunload', () => {
                this.activeAnimations.forEach(id => {
                    cancelAnimationFrame(id);
                });
                this.activeAnimations.clear();
            });
        },
        
        preventTouchConflicts: function() {
            if (this.isMobile) {
                // Prevent default touch behaviors that might cause jittering
                document.addEventListener('touchstart', (e) => {
                    // Only prevent default for specific elements
                    if (e.target.closest('.cursor-follower, .particle, .pulse-circle')) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // Optimize touch move events
                document.addEventListener('touchmove', (e) => {
                    // Prevent default only for elements that don't need scrolling
                    if (e.target.closest('.cursor-follower, .particle, .pulse-circle')) {
                        e.preventDefault();
                    }
                }, { passive: false });
            }
        },
        
        preventScrollConflicts: function() {
            // Ensure only one scroll handler runs at a time
            let scrollTimeout;
            
            const originalScrollTo = window.scrollTo;
            window.scrollTo = function(options) {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                
                scrollTimeout = setTimeout(() => {
                    originalScrollTo.call(window, options);
                }, 16); // One frame delay
            };
        },
        
        optimizeAnimations: function() {
            // Use CSS transforms instead of changing layout properties
            this.useTransformOptimizations();
            
            // Optimize repaints and reflows
            this.optimizeRepaints();
            
            // Use hardware acceleration where possible
            this.enableHardwareAcceleration();
        },
        
        useTransformOptimizations: function() {
            // Replace layout-changing animations with transform-based ones
            const style = document.createElement('style');
            style.textContent = `
                .mobile-device .floating-card {
                    transform: translateZ(0);
                    will-change: transform;
                }
                
                .mobile-device .hero-image {
                    transform: translateZ(0);
                    will-change: transform;
                }
                
                .mobile-device .stat {
                    transform: translateZ(0);
                    will-change: transform;
                }
            `;
            document.head.appendChild(style);
        },
        
        optimizeRepaints: function() {
            // Batch DOM updates
            const batchedUpdates = [];
            let updateTimeout;
            
            window.batchDOMUpdate = function(updateFunction) {
                batchedUpdates.push(updateFunction);
                
                if (updateTimeout) {
                    clearTimeout(updateTimeout);
                }
                
                updateTimeout = setTimeout(() => {
                    // Use requestAnimationFrame to batch all updates
                    requestAnimationFrame(() => {
                        batchedUpdates.forEach(update => update());
                        batchedUpdates.length = 0;
                    });
                }, 16);
            };
        },
        
        enableHardwareAcceleration: function() {
            // Add hardware acceleration to animated elements
            const animatedElements = document.querySelectorAll('.floating-card, .hero-image, .stat, .reveal');
            animatedElements.forEach(el => {
                el.style.transform = 'translateZ(0)';
                el.style.willChange = 'transform, opacity';
            });
        },
        
        // Performance monitoring
        monitorPerformance: function() {
            if (this.isMobile) {
                // Monitor frame rate
                let frameCount = 0;
                let lastTime = performance.now();
                
                const countFrames = () => {
                    frameCount++;
                    const currentTime = performance.now();
                    
                    if (currentTime - lastTime >= 1000) {
                        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                        
                        if (fps < 30) {
                            console.warn('Low frame rate detected:', fps, 'fps');
                            this.enableEmergencyOptimizations();
                        }
                        
                        frameCount = 0;
                        lastTime = currentTime;
                    }
                    
                    requestAnimationFrame(countFrames);
                };
                
                requestAnimationFrame(countFrames);
            }
        },
        
        enableEmergencyOptimizations: function() {
            // Emergency optimizations for very low performance
            const style = document.createElement('style');
            style.textContent = `
                .emergency-mode * {
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                }
                
                .emergency-mode .floating-card,
                .emergency-mode .hero-image,
                .emergency-mode .stat {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('emergency-mode');
        }
    };

    // Initialize mobile optimization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MobileOptimizer.init();
        });
    } else {
        MobileOptimizer.init();
    }

    // Export for use in other modules
    window.MobileOptimizer = MobileOptimizer;
})();