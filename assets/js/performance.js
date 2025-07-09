// Solar Panels Oldham - Performance Optimization Module
// Handles lazy loading, code optimization, and performance monitoring

(function() {
    'use strict';

    // ===== PERFORMANCE MONITORING =====
    
    // Performance metrics tracking
    const performanceMetrics = {
        pageLoadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
    };

    // Initialize performance monitoring
    function initPerformanceMonitoring() {
        // Track page load time
        window.addEventListener('load', () => {
            performanceMetrics.pageLoadTime = performance.now();
            
            // Send performance data to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'performance_metric', {
                    event_category: 'performance',
                    event_label: 'page_load_time',
                    value: Math.round(performanceMetrics.pageLoadTime)
                });
            }
        });

        // Track DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            performanceMetrics.domContentLoaded = performance.now();
        });

        // Track Core Web Vitals
        trackCoreWebVitals();
        
        // Track resource loading
        trackResourceLoading();
        
        // Monitor memory usage
        monitorMemoryUsage();
    }

    // Track Core Web Vitals
    function trackCoreWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        performanceMetrics.firstContentfulPaint = entry.startTime;
                        reportPerformanceMetric('fcp', entry.startTime);
                    }
                }
            });
            paintObserver.observe({ entryTypes: ['paint'] });
        }

        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                reportPerformanceMetric('lcp', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                performanceMetrics.cumulativeLayoutShift = clsValue;
                reportPerformanceMetric('cls', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // First Input Delay
        if ('PerformanceObserver' in window) {
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime;
                    reportPerformanceMetric('fid', performanceMetrics.firstInputDelay);
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        }
    }

    // Report performance metric to analytics
    function reportPerformanceMetric(metric, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                event_category: 'core_web_vitals',
                event_label: metric,
                value: Math.round(value)
            });
        }
    }

    // Track resource loading performance
    function trackResourceLoading() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.initiatorType === 'script' || entry.initiatorType === 'css') {
                        if (entry.duration > 1000) { // Report slow resources
                            console.warn('Slow resource loaded:', entry.name, entry.duration + 'ms');
                        }
                    }
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    // Monitor memory usage
    function monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
                    console.warn('High memory usage detected:', 
                        Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB');
                }
            }, 30000); // Check every 30 seconds
        }
    }

    // ===== LAZY LOADING =====

    // Lazy load images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            loadAllImages();
        }
    }

    // Fallback image loading
    function loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
    }

    // Lazy load JavaScript modules
    function lazyLoadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        if (callback) {
            script.onload = callback;
        }
        
        document.head.appendChild(script);
    }

    // Lazy load CSS
    function lazyLoadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // ===== CODE OPTIMIZATION =====

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    // Throttle function for performance
    function throttle(func, limit) {
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
    }

    // Optimize scroll events
    function optimizeScrollEvents() {
        const scrollHandler = throttle(() => {
            // Handle scroll events efficiently
            const scrollTop = window.pageYOffset;
            
            // Update scroll-based animations
            updateScrollAnimations(scrollTop);
            
            // Track scroll depth for analytics
            trackScrollDepth(scrollTop);
        }, 16); // ~60fps

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // Update scroll-based animations
    function updateScrollAnimations(scrollTop) {
        const animatedElements = document.querySelectorAll('[data-scroll-animation]');
        
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                element.style.setProperty('--scroll-progress', progress);
            }
        });
    }

    // Track scroll depth for analytics
    function trackScrollDepth(scrollTop) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        // Track scroll milestones
        const milestones = [25, 50, 75, 90, 100];
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !window.scrollMilestones) {
                window.scrollMilestones = window.scrollMilestones || [];
                if (!window.scrollMilestones.includes(milestone)) {
                    window.scrollMilestones.push(milestone);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            event_category: 'engagement',
                            event_label: milestone + '%',
                            value: milestone
                        });
                    }
                }
            }
        });
    }

    // ===== RESOURCE OPTIMIZATION =====

    // Preload critical resources
    function preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.as = 'style';
        criticalCSS.href = '/css/main.css';
        document.head.appendChild(criticalCSS);

        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }

    // Defer non-critical JavaScript
    function deferNonCriticalScripts() {
        const nonCriticalScripts = [
            '/js/analytics.js',
            '/js/forms.js'
        ];

        // Load non-critical scripts after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                nonCriticalScripts.forEach(src => {
                    lazyLoadScript(src);
                });
            }, 1000);
        });
    }

    // ===== ERROR HANDLING =====

    // Global error handler
    function initErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            
            // Report error to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    description: event.error.message,
                    fatal: false
                });
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Report error to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    description: 'Unhandled promise rejection: ' + event.reason,
                    fatal: false
                });
            }
        });
    }

    // ===== INITIALIZATION =====

    // Initialize performance optimization
    function init() {
        // Start performance monitoring
        initPerformanceMonitoring();
        
        // Initialize lazy loading
        initLazyLoading();
        
        // Optimize scroll events
        optimizeScrollEvents();
        
        // Preload critical resources
        preloadCriticalResources();
        
        // Defer non-critical scripts
        deferNonCriticalScripts();
        
        // Initialize error handling
        initErrorHandling();
        
        console.log('Performance optimization initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for use in other scripts
    window.PerformanceOptimizer = {
        debounce,
        throttle,
        lazyLoadScript,
        lazyLoadCSS,
        performanceMetrics,
        initLazyLoading,
        optimizeScrollEvents
    };

})();