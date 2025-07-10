/* Solar Panels Oldham - Enhanced Main JavaScript */
/* Ultra Modern Interactions & Effects with Mobile Optimizations */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initNavigation();
    initHeroEffects();
    initScrollEffects();
    initParallax();
    initRevealAnimations();
    initInteractiveElements();
    initBackToTop();
    initLoadingEffects();
    initMobileMenu();
    initCostCalculator();
    initCharts();
    initFAQ();
    initParticleSystem();
    initSmoothScrolling();
    initFormEnhancements();
    initMobileOptimizations();
});

// Enhanced Custom Cursor - Desktop Only
function initCustomCursor() {
    // Only initialize on desktop devices with good performance
    if (window.innerWidth < 768 || 
        !window.matchMedia('(hover: hover)').matches ||
        navigator.hardwareConcurrency < 4) {
        return;
    }
    
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');
    cursor.className = 'cursor-outline';
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation with improved performance
    function animateCursor() {
        // Outline follows with delay
        cursorX += (mouseX - cursorX) * 0.08;
        cursorY += (mouseY - cursorY) * 0.08;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Dot follows directly
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Enhanced cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .interactive, .service-card, .btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget) {
            cursor.style.opacity = '0';
            cursorDot.style.opacity = '0';
        }
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '0.5';
        cursorDot.style.opacity = '1';
    });
}

// Enhanced Navigation Effects
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;
    
    // Enhanced navbar scroll effects with performance optimization
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class with enhanced styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(255, 215, 0, 0.2)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottom = '1px solid rgba(255, 215, 0, 0.1)';
        }
        
        // Hide/show on scroll with smooth transition (desktop only)
        if (window.innerWidth > 768 && navigator.hardwareConcurrency >= 4) {
            if (currentScroll > lastScroll && currentScroll > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
    }, 16)); // 60fps throttle
    
    // Enhanced smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state with animation
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    l.style.transform = 'scale(1)';
                });
                link.classList.add('active');
                link.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Update active nav on scroll with enhanced detection
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// Enhanced Hero Section Effects
function initHeroEffects() {
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroStats = document.querySelectorAll('.stat');
    
    // Create enhanced animated particles (desktop only)
    if (window.innerWidth > 768) {
        createEnhancedParticles();
    }
    
    // Enhanced animated counter for stats
    heroStats.forEach((stat, index) => {
        const number = stat.querySelector('.stat-number');
        const finalValue = number.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('£');
        const isYear = finalValue.includes('yr');
        let numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        
        // Animate number on page load with staggered timing
        setTimeout(() => {
            let currentValue = 0;
            const increment = numericValue / 60;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                if (isCurrency) {
                    number.textContent = `£${Math.floor(currentValue).toLocaleString()}+`;
                } else if (isYear) {
                    number.textContent = `${Math.floor(currentValue)}yr`;
                } else {
                    number.textContent = `${Math.floor(currentValue)}+`;
                }
            }, 50);
        }, index * 200);
    });
    
    // Enhanced hero title animation
    if (heroTitle) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroTitle.style.opacity = '1';
                    heroTitle.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(heroTitle);
    }
}

// Enhanced Scroll Effects with Performance Optimization
function initScrollEffects() {
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    };
    
    const handleScrollAnimation = throttle(() => {
        const scrollElements = document.querySelectorAll('.scroll-animate');
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    }, 16);
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check
}

// Optimized Parallax Effect
function initParallax() {
    if (window.innerWidth < 768) return; // Disable on mobile for performance
    
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// Enhanced Reveal Animations
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    function checkReveals() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', throttle(checkReveals, 16));
        checkReveals();
    }
}

// Enhanced Interactive Elements
function initInteractiveElements() {
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        // Enhanced touch feedback for mobile
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Enhanced card interactions
    const cards = document.querySelectorAll('.service-card, .area-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }
        });
        
        // Enhanced touch feedback for mobile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Enhanced Back to Top
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }, 16));
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Loading Effects
function initLoadingEffects() {
    // Preload critical images
    const criticalImages = [
        '/images/hero/solar-panels-modern-home.jpg',
        '/images/hero/solar-installation.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Remove loading screen when page is ready
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Animate elements in sequence
        const animateElements = document.querySelectorAll('.hero-content, .hero-visual, .hero-stats');
        animateElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
}

// Enhanced Mobile Menu
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });
}

// Enhanced Cost Calculator
function initCostCalculator() {
    const quickCalc = document.getElementById('quick-calc');
    const calcResult = document.getElementById('calc-result');
    
    if (!quickCalc) return;
    
    quickCalc.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = quickCalc.querySelector('input');
        const monthlyBill = parseFloat(input.value);
        
        if (monthlyBill && monthlyBill > 0) {
            const savings = calculateSavings(monthlyBill);
            displayResults(savings);
        }
    });
    
    function calculateSavings(monthlyBill) {
        const annualBill = monthlyBill * 12;
        const solarEfficiency = 0.85; // 85% efficiency
        const annualSavings = annualBill * solarEfficiency;
        const installationCost = 8000; // Average installation cost
        const paybackYears = Math.ceil(installationCost / annualSavings);
        
        return {
            annualSavings: Math.round(annualSavings),
            paybackYears: paybackYears
        };
    }
    
    function displayResults(savings) {
        const savingsAmount = document.getElementById('savings-amount');
        const paybackYears = document.getElementById('payback-years');
        
        if (savingsAmount) {
            animateValue(savingsAmount, savings.annualSavings);
        }
        if (paybackYears) {
            paybackYears.textContent = savings.paybackYears;
        }
        
        calcResult.classList.add('show');
    }
    
    function animateValue(element, value) {
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (value - startValue) * progress);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    }
}

// Enhanced Charts
function initCharts() {
    const chartCanvas = document.getElementById('savings-chart');
    if (!chartCanvas) return;
    
    // Only initialize charts on desktop for performance
    if (window.innerWidth > 768) {
        createEnhancedChart(chartCanvas);
    }
}

function createEnhancedChart(canvas) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
    
    // Chart data
    const data = {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [{
            label: 'Cumulative Savings',
            data: [2000, 4200, 6600, 9200, 12000],
            borderColor: '#FFD700',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Enhanced FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Enhanced Particle System (Desktop Only)
function initParticleSystem() {
    if (window.innerWidth < 768) return; // Disable on mobile for performance
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    
    createEnhancedParticles();
}

function createEnhancedParticles() {
    const particleContainer = document.querySelector('.particle-container');
    if (!particleContainer) return;
    
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 215, 0, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particleContainer.appendChild(particle);
    }
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced Form Enhancements
function initFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label effect
            if (input.type !== 'submit' && input.type !== 'button') {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            }
            
            // Real-time validation
            input.addEventListener('input', () => {
                validateInput(input);
            });
        });
        
        // Form submission enhancement
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitButton.textContent = 'Sent!';
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        form.reset();
                    }, 2000);
                }, 1500);
            }
        });
    });
}

// Mobile-specific optimizations
function initMobileOptimizations() {
    // Detect device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isSlowConnection = navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' ||
         navigator.connection.effectiveType === '3g');
    
    // Disable hover effects on touch devices
    if (window.matchMedia('(hover: none)').matches) {
        document.body.classList.add('touch-device');
    }
    
    // Optimize for low-end devices
    if (isLowEndDevice) {
        document.body.classList.add('low-end-device');
        
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 5) {
                particle.remove();
            }
        });
        
        // Simplify animations
        const animatedElements = document.querySelectorAll('.hero::before, .hero::after, .hero-highlight::before, .hero-highlight::after');
        animatedElements.forEach(el => {
            if (el.style.animation) {
                el.style.animationDuration = '30s';
                el.style.animationTimingFunction = 'ease-out';
            }
        });
        
        // Disable 3D transforms
        const style = document.createElement('style');
        style.textContent = `
            .stat:hover, .btn:hover, .floating-card:hover {
                transform: translateY(-5px) scale(1.02) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize for touch devices
    if ('ontouchstart' in window) {
        // Add touch feedback with haptic feedback
        const touchElements = document.querySelectorAll('.btn, .nav-link, .service-card, .area-card');
        touchElements.forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.transform = 'scale(0.95)';
                // Haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
            el.addEventListener('touchend', () => {
                el.style.transform = '';
            });
        });
        
        // Improve scroll performance
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    // Optimize for slow connections
    if (isSlowConnection) {
        // Load low-quality images first
        const images = document.querySelectorAll('img[data-src-low]');
        images.forEach(img => {
            if (img.dataset.srcLow) {
                img.src = img.dataset.srcLow;
            }
        });
        
        // Disable non-essential animations
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
    
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.fontSize = '16px';
        });
    });
}

// Utility Functions
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

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();
    
    function countFrames() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            if (fps < 30) {
                // Reduce animations for better performance
                document.body.classList.add('low-performance');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    requestAnimationFrame(countFrames);
}

// Initialize performance monitoring
initPerformanceMonitoring();