// Solar Panels Oldham - JavaScript Configuration
// Centralized configuration for all JavaScript modules

window.SolarConfig = {
    // Google Analytics Configuration
    analytics: {
        measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 measurement ID when available
        conversionId: 'AW-CONVERSION_ID', // Replace with actual conversion ID
        conversionLabel: 'CONVERSION_LABEL', // Replace with actual conversion label
        enabled: true
    },
    
    // Performance Configuration
    performance: {
        maxBundleSize: 40000, // 40KB target
        maxLoadTime: 3000, // 3 seconds
        coreWebVitals: {
            fcp: 1500, // 1.5 seconds
            lcp: 2500, // 2.5 seconds
            cls: 0.1,
            fid: 100 // 100ms
        }
    },
    
    // Form Configuration
    forms: {
        submissionUrl: '/php/contact-form.php',
        validation: {
            phonePattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
            emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            postcodePattern: /\b[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][ABD-HJLNP-UW-Z]{2}\b/i
        },
        targetAreas: ['oldham', 'saddleworth', 'uppermill', 'delph', 'dobcross', 'greenfield']
    },
    
    // Error Handling Configuration
    errorHandling: {
        maxErrors: 5,
        errorModeThreshold: 5,
        autoRecovery: true,
        showUserMessages: true
    },
    
    // Accessibility Configuration
    accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'normal',
        keyboardNavigation: true
    },
    
    // Contact Information
    contact: {
        phone: '01611234567',
        email: 'info@solarpanelsoldham.co.uk',
        emergencyPhone: '07800123456',
        businessHours: 'Mon-Fri 8AM-6PM'
    },
    
    // Solar Calculator Configuration
    calculator: {
        defaultSystemSize: 4, // kW
        costPerKw: 1500, // £ per kW
        annualIncrease: 0.05, // 5% annual increase
        solarEfficiency: 0.8, // 80% efficiency
        exportRate: 0.15 // 15p per kWh exported
    }
};

// Environment detection
window.SolarConfig.environment = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname.includes('solarpanelsoldham.co.uk'),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent)
};

// Feature detection
window.SolarConfig.features = {
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsPerformanceObserver: 'PerformanceObserver' in window,
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsWebP: (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })(),
    supportsWebGL: (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    })()
};

// Debug mode
window.SolarConfig.debug = window.SolarConfig.environment.isDevelopment;

// Console logging utility
window.SolarConfig.log = function(message, data = null) {
    if (window.SolarConfig.debug) {
        console.log(`[Solar Panels Oldham] ${message}`, data);
    }
};

// Error logging utility
window.SolarConfig.error = function(message, error = null) {
    if (window.SolarConfig.debug) {
        console.error(`[Solar Panels Oldham] ${message}`, error);
    }
    
    // Report to analytics if available
    if (typeof gtag !== 'undefined' && window.SolarConfig.analytics.enabled) {
        gtag('event', 'exception', {
            description: message,
            fatal: false,
            error_type: 'configuration_error'
        });
    }
};

// Initialize configuration
(function() {
    'use strict';
    
    // Validate required configuration
    const requiredConfigs = ['analytics', 'performance', 'forms'];
    requiredConfigs.forEach(config => {
        if (!window.SolarConfig[config]) {
            window.SolarConfig.error(`Missing required configuration: ${config}`);
        }
    });
    
    // Set up environment-specific overrides
    if (window.SolarConfig.environment.isDevelopment) {
        window.SolarConfig.analytics.enabled = false;
        window.SolarConfig.errorHandling.showUserMessages = false;
    }
    
    window.SolarConfig.log('Configuration initialized successfully');
})();