/* Solar Panels Oldham - Enhanced Main JavaScript */
/* Ultra Modern Interactions & Effects */

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
});

// Enhanced Custom Cursor
function initCustomCursor() {
    if (window.innerWidth < 768) return; // Disable on mobile
    
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
    
    // Enhanced navbar scroll effects
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class with enhanced styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show on scroll with smooth transition
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
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
    window.addEventListener('scroll', () => {
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
    });
}

// Enhanced Hero Section Effects
function initHeroEffects() {
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroStats = document.querySelectorAll('.stat');
    
    // Create enhanced animated particles
    createEnhancedParticles();
    
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
                    // Add completion effect
                    stat.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }
                
                let displayValue = Math.floor(currentValue);
                if (isCurrency) displayValue = '£' + displayValue + '+';
                else if (isPercentage) displayValue = displayValue + '%';
                else if (isYear) displayValue = displayValue + 'yr';
                else displayValue = displayValue + '+';
                
                number.textContent = displayValue;
            }, 20);
        }, index * 200);
    });
    
    // Enhanced hero parallax on mouse move
    hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        const heroImage = hero.querySelector('.hero-image');
        const heroContent = hero.querySelector('.hero-content');
        
        if (heroImage) {
            heroImage.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
        }
        
        if (heroContent) {
            heroContent.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
        }
    });
    
    // Reset transform on mouse leave
    hero.addEventListener('mouseleave', () => {
        const heroImage = hero.querySelector('.hero-image');
        const heroContent = hero.querySelector('.hero-content');
        
        if (heroImage) {
            heroImage.style.transform = 'translate(0, 0) scale(1.02)';
        }
        
        if (heroContent) {
            heroContent.style.transform = 'translate(0, 0)';
        }
    });
}

// Enhanced Scroll Effects
function initScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('revealed');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('revealed');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check
    handleScrollAnimation();
}

// Enhanced Parallax Effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced Reveal Animations
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    function checkReveals() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
                
                // Add staggered animation for child elements
                const staggerItems = element.querySelectorAll('.stagger-item');
                staggerItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, index * 100);
                });
            }
        });
    }
    
    window.addEventListener('scroll', checkReveals);
    checkReveals(); // Initial check
}

// Enhanced Interactive Elements
function initInteractiveElements() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.service-card, .tech-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Enhanced form input effects
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
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
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Loading Effects
function initLoadingEffects() {
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add skeleton loading for content
    const skeletonElements = document.querySelectorAll('.skeleton');
    skeletonElements.forEach(element => {
        element.classList.add('loading');
        setTimeout(() => {
            element.classList.remove('loading');
        }, 2000);
    });
}

// Enhanced Mobile Menu
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Enhanced animation for menu items
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                if (navMenu.classList.contains('active')) {
                    link.style.animationDelay = `${index * 0.1}s`;
                    link.style.animation = 'slideInRight 0.3s ease forwards';
                } else {
                    link.style.animation = 'none';
                }
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }
}

// Enhanced Cost Calculator
function initCostCalculator() {
    const calculator = document.getElementById('quick-calc');
    const billSlider = document.getElementById('bill-slider');
    const billValue = document.getElementById('bill-value');
    
    if (calculator) {
        calculator.addEventListener('submit', function(e) {
            e.preventDefault();
            const monthlyBill = parseFloat(this.querySelector('input').value);
            calculateSavings(monthlyBill);
        });
    }
    
    if (billSlider && billValue) {
        billSlider.addEventListener('input', function() {
            billValue.textContent = this.value;
            const monthlyBill = parseFloat(this.value);
            calculateSavings(monthlyBill);
        });
    }
    
    function calculateSavings(monthlyBill) {
        const annualBill = monthlyBill * 12;
        const solarEfficiency = 0.85; // 85% efficiency
        const annualSavings = annualBill * solarEfficiency;
        const installationCost = 8000; // Average installation cost
        const paybackYears = installationCost / annualSavings;
        
        // Animate the results
        animateValue(document.getElementById('savings-amount'), Math.round(annualSavings));
        animateValue(document.getElementById('payback-years'), paybackYears.toFixed(1));
        
        // Show results with animation
        const resultElement = document.getElementById('calc-result');
        resultElement.classList.add('show');
        
        // Add success animation
        resultElement.style.animation = 'fadeInUp 0.5s ease-out';
    }
    
    function animateValue(element, value) {
        if (!element) return;
        
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.round(startValue + (value - startValue) * progress);
            element.textContent = currentValue;
            
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
    if (chartCanvas) {
        createEnhancedChart(chartCanvas);
    }
}

function createEnhancedChart(canvas) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
    
    // Chart configuration
    const config = {
        type: 'line',
        data: {
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
        },
        options: {
            responsive: true,
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
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
}

// Enhanced Particle System
function initParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 50;
    const particles = [];
    
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
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 10}s;
        `;
        
        hero.appendChild(particle);
        particles.push(particle);
    }
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
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
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            }
        });
        
        // Add form submission enhancement
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = 'Sent!';
                    submitBtn.style.background = '#10B981';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = 'Submit';
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 2000);
                }, 1500);
            }
        });
    });
}

// Utility functions
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

// Enhanced particle creation
function createEnhancedParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'enhanced-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: enhancedFloat ${Math.random() * 20 + 15}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 10}s;
            z-index: 1;
        `;
        
        hero.appendChild(particle);
    }
}

// Add enhanced float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes enhancedFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .enhanced-particle {
        filter: blur(0.5px);
    }
`;
document.head.appendChild(style);