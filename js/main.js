// Solar Panels Oldham - Main JavaScript
// Navigation, interactions, and core functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION =====
    
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== SMOOTH SCROLLING =====
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== INTERACTIVE ELEMENTS =====
    
    // Savings calculator in hero section
    const quickCalc = document.getElementById('quick-calc');
    const calcResult = document.getElementById('calc-result');
    
    if (quickCalc && calcResult) {
        quickCalc.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const monthlyBill = parseFloat(this.querySelector('input').value);
            
            if (monthlyBill && monthlyBill >= 50) {
                // Simple savings calculation (example formula)
                const annualBill = monthlyBill * 12;
                const solarSavings = Math.round(annualBill * 0.7); // 70% savings
                const paybackYears = Math.round(15000 / solarSavings); // Rough payback calculation
                
                document.getElementById('savings-amount').textContent = solarSavings;
                document.getElementById('payback-years').textContent = paybackYears;
                
                calcResult.style.display = 'block';
                
                // Animate the result
                calcResult.style.opacity = '0';
                setTimeout(() => {
                    calcResult.style.transition = 'opacity 0.5s ease';
                    calcResult.style.opacity = '1';
                }, 100);
                
                // Track calculation event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'savings_calculation', {
                        'monthly_bill': monthlyBill,
                        'estimated_savings': solarSavings
                    });
                }
            } else {
                alert('Please enter a valid monthly electricity bill (£50 minimum)');
            }
        });
    }
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .area-card, .testimonial-card, .stat-card, .feature'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ===== LOADING STATES =====
    
    // Add loading states to buttons on click
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading state to navigation links
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Don't add loading state to tel: and mailto: links
            if (this.getAttribute('href') && 
                (this.getAttribute('href').startsWith('tel:') || 
                 this.getAttribute('href').startsWith('mailto:'))) {
                return;
            }
            
            // Add loading state for form submission buttons
            if (this.type === 'submit') {
                this.classList.add('loading');
                
                // Remove loading state after 3 seconds (fallback)
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 3000);
            }
        });
    });
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== CALL TRACKING =====
    
    // Track phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            
            // Track with Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'phone_number': phoneNumber,
                    'event_category': 'contact',
                    'event_label': 'phone_click'
                });
            }
            
            // Track with custom analytics if needed
            trackPhoneCall(phoneNumber);
        });
    });
    
    // ===== ACCESSIBILITY IMPROVEMENTS =====
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Focus management for mobile menu
    if (navToggle) {
        navToggle.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        navToggle.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    }
    
    // ===== PAGE LOADING OPTIMIZATION =====
    
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            '/css/main.css',
            '/css/components.css',
            '/css/responsive.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    // Initialize preloading
    preloadCriticalResources();
    
    // ===== ERROR HANDLING =====
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Track errors with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error.message,
                'fatal': false
            });
        }
    });
    
    // ===== UTILITY FUNCTIONS =====
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for scroll events
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
    
    // ===== CUSTOM EVENTS =====
    
    // Create custom events for tracking
    function createCustomEvent(name, data) {
        return new CustomEvent(name, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
    }
    
    // ===== INITIALIZATION COMPLETE =====
    
    // Dispatch ready event
    document.dispatchEvent(createCustomEvent('solarPanelsOldhamReady', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    }));
    
    console.log('Solar Panels Oldham - Main JavaScript loaded successfully');
});

// ===== EXTERNAL FUNCTIONS =====

// Phone call tracking function (can be customized)
function trackPhoneCall(phoneNumber) {
    // Custom phone call tracking logic
    console.log('Phone call tracked:', phoneNumber);
    
    // You can integrate with external tracking services here
    // Example: send to your CRM or analytics platform
}

// Email tracking function
function trackEmail(emailAddress) {
    console.log('Email click tracked:', emailAddress);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_click', {
            'email_address': emailAddress,
            'event_category': 'contact',
            'event_label': 'email_click'
        });
    }
}

// Quote request tracking
function trackQuoteRequest(source) {
    console.log('Quote request tracked from:', source);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quote_request', {
            'source': source,
            'event_category': 'lead_generation',
            'event_label': 'quote_form'
        });
    }
}

// ===== SERVICE WORKER REGISTRATION =====

// Register service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}