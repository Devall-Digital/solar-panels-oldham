// Solar Panels Oldham - Analytics JavaScript
// Google Analytics, call tracking, and performance monitoring

// ===== GOOGLE ANALYTICS SETUP =====

// Initialize Google Analytics
function initializeGoogleAnalytics() {
    // Google Analytics 4 configuration
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    // Replace GA_MEASUREMENT_ID with your actual measurement ID
    gtag('config', 'GA_MEASUREMENT_ID', {
        // Enhanced ecommerce for lead tracking
        custom_map: {
            'custom_parameter_1': 'lead_source',
            'custom_parameter_2': 'form_type'
        },
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
    });
    
    console.log('Google Analytics initialized');
}

// ===== ENHANCED ECOMMERCE TRACKING =====

// Track lead as conversion
function trackLeadConversion(formType, leadData) {
    if (typeof gtag === 'undefined') return;
    
    // Assign lead value based on form type
    const leadValues = {
        'quote': 150,      // Quote requests are high value
        'contact': 50,     // General contact forms
        'callback': 100    // Callback requests
    };
    
    gtag('event', 'purchase', {
        transaction_id: generateTransactionId(),
        value: leadValues[formType] || 50,
        currency: 'GBP',
        items: [{
            item_id: 'solar_lead_' + formType,
            item_name: 'Solar Panel Lead - ' + formType.charAt(0).toUpperCase() + formType.slice(1),
            category: 'Lead Generation',
            quantity: 1,
            price: leadValues[formType] || 50
        }],
        // Custom parameters
        lead_source: getLeadSource(),
        form_type: formType,
        lead_quality: calculateLeadQuality(leadData)
    });
}

// Generate unique transaction ID
function generateTransactionId() {
    return 'solar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Calculate lead quality score
function calculateLeadQuality(leadData) {
    let score = 0;
    
    // Phone number provided
    if (leadData.phone) score += 30;
    
    // Address in target area
    if (leadData.address) {
        const targetAreas = ['oldham', 'saddleworth', 'uppermill', 'delph', 'dobcross', 'greenfield'];
        const address = leadData.address.toLowerCase();
        if (targetAreas.some(area => address.includes(area))) {
            score += 40;
        } else {
            score += 20;
        }
    }
    
    // Interest in complete system
    if (leadData.interest && leadData.interest.includes('complete-system')) {
        score += 30;
    } else if (leadData.interest && leadData.interest.includes('battery-storage')) {
        score += 20;
    }
    
    // High monthly bill (indicates bigger potential system)
    if (leadData.monthlyBill) {
        const billRange = leadData.monthlyBill;
        if (billRange === '300+') score += 30;
        else if (billRange === '200-300') score += 20;
        else if (billRange === '150-200') score += 10;
    }
    
    // Return quality rating
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

// ===== CALL TRACKING =====

// Track phone calls
function trackPhoneCall(phoneNumber, source = 'unknown') {
    if (typeof gtag === 'undefined') return;
    
    gtag('event', 'phone_call', {
        event_category: 'contact',
        event_label: phoneNumber,
        value: 100, // Assign value to phone calls
        phone_number: phoneNumber,
        call_source: source,
        timestamp: new Date().toISOString()
    });
    
    // Track as conversion
    gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your conversion ID
        value: 100,
        currency: 'GBP',
        transaction_id: generateTransactionId()
    });
    
    console.log('Phone call tracked:', phoneNumber, source);
}

// Enhanced call tracking with call duration simulation
function trackCallDuration(phoneNumber, estimatedDuration = null) {
    // Simulate call duration tracking (in real implementation, this would come from call tracking service)
    const duration = estimatedDuration || Math.floor(Math.random() * 300) + 30; // 30-330 seconds
    
    if (typeof gtag === 'undefined') return;
    
    gtag('event', 'call_duration', {
        event_category: 'call_quality',
        event_label: phoneNumber,
        value: duration,
        call_duration_seconds: duration,
        call_quality: duration > 120 ? 'high' : duration > 60 ? 'medium' : 'low'
    });
}

// ===== PAGE TRACKING =====

// Track page views with additional context
function trackPageView(page = null) {
    if (typeof gtag === 'undefined') return;
    
    const pageData = {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        // Additional context
        visitor_type: getVisitorType(),
        traffic_source: getTrafficSource(),
        device_type: getDeviceType(),
        time_of_day: getTimeOfDay(),
        day_of_week: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    };
    
    if (page) {
        pageData.custom_page_name = page;
    }
    
    gtag('config', 'GA_MEASUREMENT_ID', pageData);
}

// ===== USER BEHAVIOR TRACKING =====

// Track scroll depth
function initializeScrollTracking() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = [];
    
    function trackScrollDepth() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.includes(threshold)) {
                    trackedThresholds.push(threshold);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            event_category: 'engagement',
                            event_label: threshold + '%',
                            value: threshold
                        });
                    }
                }
            });
        }
    }
    
    // Throttled scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });
}

// Track time on page
function initializeTimeTracking() {
    const startTime = Date.now();
    let maxTimeReached = 0;
    const timeThresholds = [30, 60, 120, 300, 600]; // seconds
    const trackedTimeThresholds = [];
    
    function trackTimeOnPage() {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        if (timeSpent > maxTimeReached) {
            maxTimeReached = timeSpent;
            
            timeThresholds.forEach(threshold => {
                if (timeSpent >= threshold && !trackedTimeThresholds.includes(threshold)) {
                    trackedTimeThresholds.push(threshold);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'timing_complete', {
                            name: 'time_on_page',
                            value: timeSpent * 1000, // Convert to milliseconds
                            event_category: 'engagement',
                            event_label: threshold + 's'
                        });
                    }
                }
            });
        }
    }
    
    // Track time every 10 seconds
    setInterval(trackTimeOnPage, 10000);
    
    // Track on page unload
    window.addEventListener('beforeunload', () => {
        const finalTime = Math.floor((Date.now() - startTime) / 1000);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'session_duration',
                value: finalTime * 1000,
                event_category: 'engagement',
                event_label: 'page_session'
            });
        }
    });
}

// ===== INTERACTION TRACKING =====

// Track click events on important elements
function initializeClickTracking() {
    // Track CTA button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonHref = this.getAttribute('href') || '';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'cta_interaction',
                    event_label: buttonText,
                    button_text: buttonText,
                    button_href: buttonHref,
                    button_location: getElementLocation(this)
                });
            }
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.textContent.trim();
            const linkHref = this.getAttribute('href') || '';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'navigation',
                    event_label: linkText,
                    link_text: linkText,
                    link_href: linkHref
                });
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Get visitor type (new vs returning)
function getVisitorType() {
    const hasVisited = localStorage.getItem('solar_panels_oldham_visited');
    if (!hasVisited) {
        localStorage.setItem('solar_panels_oldham_visited', 'true');
        return 'new_visitor';
    }
    return 'returning_visitor';
}

// Get traffic source
function getTrafficSource() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for UTM parameters
    if (urlParams.get('utm_source')) {
        return urlParams.get('utm_source');
    }
    
    // Check referrer
    if (!referrer) return 'direct';
    
    if (referrer.includes('google.')) return 'google_organic';
    if (referrer.includes('bing.')) return 'bing_organic';
    if (referrer.includes('facebook.')) return 'facebook';
    if (referrer.includes('twitter.')) return 'twitter';
    if (referrer.includes('linkedin.')) return 'linkedin';
    
    return 'referral';
}

// Get device type
function getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
}

// Get time of day category
function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

// Get lead source from URL parameters
function getLeadSource() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || urlParams.get('source') || getTrafficSource();
}

// Get element location on page
function getElementLocation(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return {
        section: getElementSection(element),
        position_from_top: Math.round(rect.top + scrollTop),
        viewport_position: rect.top < window.innerHeight ? 'visible' : 'below_fold'
    };
}

// Get section containing element
function getElementSection(element) {
    const section = element.closest('section');
    if (section) {
        return section.id || section.className.split(' ')[0] || 'unknown_section';
    }
    return 'no_section';
}

// ===== PERFORMANCE MONITORING =====

// Track Core Web Vitals
function initializePerformanceTracking() {
    // Track page load time
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'page_load_time',
                    value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    event_category: 'performance'
                });
            }
        }, 0);
    });
    
    // Track First Contentful Paint (if available)
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'timing_complete', {
                            name: 'first_contentful_paint',
                            value: Math.round(entry.startTime),
                            event_category: 'performance'
                        });
                    }
                }
            }
        });
        
        observer.observe({ entryTypes: ['paint'] });
    }
}

// ===== ERROR TRACKING =====

// Track JavaScript errors
function initializeErrorTracking() {
    window.addEventListener('error', (event) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: event.error.message + ' at ' + event.filename + ':' + event.lineno,
                fatal: false,
                error_type: 'javascript_error',
                error_source: event.filename,
                error_line: event.lineno
            });
        }
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: 'Unhandled Promise Rejection: ' + event.reason,
                fatal: false,
                error_type: 'promise_rejection'
            });
        }
    });
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Analytics
    initializeGoogleAnalytics();
    
    // Initialize tracking modules
    initializeScrollTracking();
    initializeTimeTracking();
    initializeClickTracking();
    initializePerformanceTracking();
    initializeErrorTracking();
    
    // Track initial page view
    trackPageView('home');
    
    console.log('Solar Panels Oldham - Analytics initialized successfully');
});

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====

// Make tracking functions globally available
window.solarAnalytics = {
    trackPhoneCall,
    trackLeadConversion,
    trackPageView,
    trackCallDuration
};