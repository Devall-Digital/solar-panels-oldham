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
        firstInputDelay: 0,
        mobileOptimizations: {
            reducedAnimations: false,
            lowEndDevice: false,
            touchDevice: false
        }
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
        
        // Initialize mobile optimizations
        initMobileOptimizations();
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
                    
                    // Apply memory optimizations
                    applyMemoryOptimizations();
                }
            }, 30000); // Check every 30 seconds
        }
    }

    // Apply memory optimizations
    function applyMemoryOptimizations() {
        // Clear non-essential animations
        const animatedElements = document.querySelectorAll('.hero::before, .hero::after, .floating-card');
        animatedElements.forEach(el => {
            if (el.style.animation) {
                el.style.animation = 'none';
            }
        });
        
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        if (particles.length > 20) {
            particles.forEach((particle, index) => {
                if (index > 20) {
                    particle.remove();
                }
            });
        }
    }

    // ===== MOBILE OPTIMIZATIONS =====
    
    function initMobileOptimizations() {
        // Detect device capabilities
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        const isSlowConnection = navigator.connection && 
            (navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g' ||
             navigator.connection.effectiveType === '3g');
        
        performanceMetrics.mobileOptimizations.touchDevice = isTouchDevice;
        performanceMetrics.mobileOptimizations.lowEndDevice = isLowEndDevice;
        
            // Apply optimizations based on device capabilities
    if (isTouchDevice) {
        applyTouchOptimizations();
    }
    
    if (isLowEndDevice) {
        applyLowEndDeviceOptimizations();
    }
    
    if (isSlowConnection) {
        applySlowConnectionOptimizations();
    }
    
    // Monitor and adapt to performance changes
    monitorFrameRate();
    monitorBatteryLevel();
        
        // Monitor frame rate and apply dynamic optimizations
        monitorFrameRate();
    }
    
    function applyTouchOptimizations() {
        // Disable hover effects on touch devices
        document.body.classList.add('touch-device');
        
        // Optimize touch targets
        const touchTargets = document.querySelectorAll('.btn, .nav-link, .service-card, .area-card');
        touchTargets.forEach(target => {
            target.style.minHeight = '48px';
            target.style.minWidth = '48px';
            target.style.touchAction = 'manipulation';
        });
        
        // Remove custom cursor
        const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline');
        cursorElements.forEach(el => el.remove());
    }
    
    function applyLowEndDeviceOptimizations() {
        document.body.classList.add('low-end-device');
        
        // Reduce animation complexity
        const animatedElements = document.querySelectorAll('.hero::before, .hero::after, .floating-card');
        animatedElements.forEach(el => {
            if (el.style.animation) {
                el.style.animation = 'none';
            }
        });
        
        // Disable particle effects
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
        
        // Reduce backdrop-filter usage
        const backdropElements = document.querySelectorAll('[style*="backdrop-filter"]');
        backdropElements.forEach(el => {
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
        });
    }
    
    function applySlowConnectionOptimizations() {
        // Load lower quality images
        const images = document.querySelectorAll('img[data-src-low]');
        images.forEach(img => {
            if (img.dataset.srcLow) {
                img.src = img.dataset.srcLow;
            }
        });
        
        // Disable non-essential animations
        const nonEssentialAnimations = document.querySelectorAll('.floating-card, .stat::before');
        nonEssentialAnimations.forEach(el => {
            if (el.style.animation) {
                el.style.animation = 'none';
            }
        });
    }
    
    function monitorFrameRate() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        function countFrames() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    // Apply low performance optimizations
                    document.body.classList.add('low-performance');
                    applyLowPerformanceOptimizations();
                } else {
                    document.body.classList.remove('low-performance');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        }
        
        requestAnimationFrame(countFrames);
    }
    
    function applyLowPerformanceOptimizations() {
        // Reduce animation complexity
        const animatedElements = document.querySelectorAll('.hero::before, .hero::after, .floating-card, .stat::before');
        animatedElements.forEach(el => {
            if (el.style.animation) {
                el.style.animation = 'none';
            }
        });
        
        // Disable particle effects
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
        
        // Reduce shadow complexity
        const shadowElements = document.querySelectorAll('[style*="box-shadow"]');
        shadowElements.forEach(el => {
            el.style.boxShadow = 'none';
        });
    }

    // ===== ENHANCED LAZY LOADING =====

    // Lazy load images with intersection observer
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
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

    // Enhanced image loading with quality detection
    function loadImage(img) {
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        const isSlowConnection = navigator.connection && 
            (navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g');
        
        let src = img.dataset.src;
        
        // Use lower quality images for low-end devices or slow connections
        if ((isLowEndDevice || isSlowConnection) && img.dataset.srcLow) {
            src = img.dataset.srcLow;
        }
        
        // Create a new image to preload
        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            // Add fade-in effect
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 50);
        };
        
        tempImage.onerror = () => {
            // Fallback to original source if low-quality fails
            if (src !== img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.remove('lazy');
            img.classList.add('loaded');
        };
        
        tempImage.src = src;
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

    // ===== PERFORMANCE UTILITIES =====

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
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
        let ticking = false;
        
        function updateScrollAnimations(scrollTop) {
            // Update scroll-based animations
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Update scroll progress
            const scrollProgress = (scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
        }
        
        function trackScrollDepth(scrollTop) {
            const scrollPercentage = (scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            // Track scroll depth for analytics
            if (typeof gtag !== 'undefined') {
                if (scrollPercentage > 25 && !window.scroll25Tracked) {
                    gtag('event', 'scroll', { event_category: 'engagement', event_label: '25%' });
                    window.scroll25Tracked = true;
                }
                if (scrollPercentage > 50 && !window.scroll50Tracked) {
                    gtag('event', 'scroll', { event_category: 'engagement', event_label: '50%' });
                    window.scroll50Tracked = true;
                }
                if (scrollPercentage > 75 && !window.scroll75Tracked) {
                    gtag('event', 'scroll', { event_category: 'engagement', event_label: '75%' });
                    window.scroll75Tracked = true;
                }
            }
        }
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollAnimations(scrollTop);
                    trackScrollDepth(scrollTop);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalImages = [
            '/images/hero/solar-panels-modern-home.jpg',
            '/images/hero/solar-installation.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    // Defer non-critical scripts
    function deferNonCriticalScripts() {
        const nonCriticalScripts = [
            'js/analytics.js',
            'js/forms.js'
        ];
        
        nonCriticalScripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            document.head.appendChild(script);
        });
    }

    // ===== ERROR HANDLING =====

    function initErrorHandling() {
        // Handle image loading errors
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.style.display = 'none';
                console.warn('Image failed to load:', e.target.src);
            }
        }, true);
        
        // Handle script loading errors
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'SCRIPT') {
                console.error('Script failed to load:', e.target.src);
            }
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // ===== INITIALIZATION =====

    function init() {
        // Initialize performance monitoring
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
        
        // Add performance class to body
        document.body.classList.add('performance-optimized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for global use
    window.PerformanceOptimizer = {
        debounce,
        throttle,
        lazyLoadScript,
        lazyLoadCSS,
        preloadCriticalResources,
        applyMobileOptimizations: initMobileOptimizations
    };

})();