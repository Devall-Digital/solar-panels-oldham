/* Solar Panels Oldham - Main JavaScript */
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
});

// Custom Cursor
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
    
    // Smooth cursor animation
    function animateCursor() {
        // Outline follows with delay
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Dot follows directly
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .interactive');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
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

// Navigation Effects
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;
    
    // Navbar scroll effects
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for nav links
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
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
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

// Hero Section Effects
function initHeroEffects() {
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroStats = document.querySelectorAll('.stat');
    
    // Create animated particles
    createParticles();
    
    // Animated counter for stats
    heroStats.forEach(stat => {
        const number = stat.querySelector('.stat-number');
        const finalValue = number.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('£');
        const isYear = finalValue.includes('yr');
        let numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        
        // Animate number on page load
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            if (isCurrency) displayValue = '£' + displayValue + '+';
            else if (isPercentage) displayValue = displayValue + '%';
            else if (isYear) displayValue = displayValue + 'yr';
            else displayValue = displayValue + '+';
            
            number.textContent = displayValue;
        }, 30);
    });
    
    // Hero parallax on mouse move
    hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const heroImage = hero.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
    
    // Floating animation for cards
    const floatingElements = document.querySelectorAll('.floating-card, .stat-card');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

// Scroll Effects
function initScrollEffects() {
    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax Effects
function initParallax() {
    // Create parallax elements
    const parallaxContainer = document.createElement('div');
    parallaxContainer.style.position = 'fixed';
    parallaxContainer.style.top = '0';
    parallaxContainer.style.left = '0';
    parallaxContainer.style.width = '100%';
    parallaxContainer.style.height = '100%';
    parallaxContainer.style.pointerEvents = 'none';
    parallaxContainer.style.zIndex = '1';
    document.body.appendChild(parallaxContainer);
    
    // Add floating shapes
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'parallax-element';
        
        if (i % 2 === 0) {
            shape.classList.add('parallax-circle');
        } else {
            shape.classList.add('parallax-square');
        }
        
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        parallaxContainer.appendChild(shape);
    }
    
    // Parallax on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Reveal Animations
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-item');
    
    function checkReveals() {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveals);
    checkReveals(); // Check on load
    
    // Add reveal classes to elements
    document.querySelectorAll('.service-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
    });
    
    document.querySelectorAll('.area-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
    });
    
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Magnetic buttons
    const magneticButtons = document.querySelectorAll('.btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
    
    // Hover effects for cards
    const cards = document.querySelectorAll('.service-card, .area-card, .testimonial-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.1)';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.transition = 'width 0.6s, height 0.6s';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.width = '300px';
                ripple.style.height = '300px';
            }, 10);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Quick calculator interaction
    const quickCalc = document.getElementById('quick-calc');
    if (quickCalc) {
        quickCalc.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const monthlyBill = parseFloat(e.target[0].value);
            const annualSaving = monthlyBill * 12 * 0.7; // 70% savings estimate
            const systemCost = 8000; // Average system cost
            const paybackYears = (systemCost / annualSaving).toFixed(1);
            
            const resultDiv = document.getElementById('calc-result');
            const savingsSpan = document.getElementById('savings-amount');
            const paybackSpan = document.getElementById('payback-years');
            
            savingsSpan.textContent = Math.round(annualSaving);
            paybackSpan.textContent = paybackYears;
            
            resultDiv.style.display = 'block';
            resultDiv.classList.add('reveal');
            setTimeout(() => resultDiv.classList.add('active'), 10);
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
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

// Loading Effects
function initLoadingEffects() {
    // Add loading state to forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('loading')) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    });
    
    // Page load animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-content > *, .hero-visual > *');
        heroElements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 100);
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    // Only initialize on mobile devices
    if (window.innerWidth <= 768) {
        navToggle.style.display = 'flex';
        
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on link click
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    } else {
        // Hide toggle on desktop
        navToggle.style.display = 'none';
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            navToggle.style.display = 'none';
        } else {
            navToggle.style.display = 'flex';
        }
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

// Create Particles Effect
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.pointerEvents = 'none';
    hero.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'rgba(255, 215, 0, 0.5)' : 'rgba(14, 165, 233, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.filter = 'blur(1px)';
        
        // Random animation
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        particle.style.animation = `particleFloat ${duration}s ${delay}s infinite ease-in-out`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS animation
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(0.5);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, -100vh) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Performance optimization
const optimizedScroll = throttle(() => {
    window.dispatchEvent(new Event('optimizedScroll'));
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Cost Calculator Functionality
function initCostCalculator() {
    const billSlider = document.getElementById('bill-slider');
    const billValue = document.getElementById('bill-value');
    const increaseSlider = document.getElementById('increase-slider');
    const increaseValue = document.getElementById('increase-value');
    const systemSize = document.getElementById('system-size');
    
    // Result elements
    const withoutSolar = document.getElementById('without-solar');
    const withSolar = document.getElementById('with-solar');
    const totalSavings = document.getElementById('total-savings');
    
    if (!billSlider || !increaseSlider) return;
    
    function calculateSavings() {
        const monthlyBill = parseFloat(billSlider.value);
        const annualIncrease = parseFloat(increaseSlider.value) / 100;
        const years = 25;
        
        // Calculate system size based on monthly bill
        let systemKw = 4;
        if (monthlyBill > 100) systemKw = 6;
        if (monthlyBill > 150) systemKw = 8;
        if (monthlyBill > 200) systemKw = 10;
        if (monthlyBill > 300) systemKw = 12;
        
        systemSize.textContent = `${systemKw}kW System`;
        
        // Calculate 25-year cost without solar (with annual increases)
        let totalWithoutSolar = 0;
        let currentBill = monthlyBill * 12;
        for (let i = 0; i < years; i++) {
            totalWithoutSolar += currentBill;
            currentBill *= (1 + annualIncrease);
        }
        
        // Calculate with solar (system cost + reduced bills)
        const systemCost = systemKw * 1500; // £1500 per kW rough estimate
        const annualSavings = monthlyBill * 12 * 0.8; // 80% savings
        const totalWithSolar = systemCost + (monthlyBill * 12 * 0.2 * years); // 20% remaining bills
        
        // Update displays with animation
        animateValue(withoutSolar, Math.round(totalWithoutSolar));
        animateValue(withSolar, Math.round(totalWithSolar));
        animateValue(totalSavings, Math.round(totalWithoutSolar - totalWithSolar));
        
        // Update chart if it exists
        if (window.savingsChart) {
            updateSavingsChart(monthlyBill, annualIncrease);
        }
    }
    
    function animateValue(element, value) {
        const current = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 500;
        const increment = (value - current) / (duration / 16);
        let temp = current;
        
        const timer = setInterval(() => {
            temp += increment;
            if ((increment > 0 && temp >= value) || (increment < 0 && temp <= value)) {
                temp = value;
                clearInterval(timer);
            }
            element.textContent = Math.round(temp).toLocaleString();
        }, 16);
    }
    
    // Update values on slider change
    billSlider.addEventListener('input', function() {
        billValue.textContent = this.value;
        calculateSavings();
    });
    
    increaseSlider.addEventListener('input', function() {
        increaseValue.textContent = this.value;
        calculateSavings();
    });
    
    // Initial calculation
    calculateSavings();
}

// Initialize Charts
function initCharts() {
    const canvas = document.getElementById('savings-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.8)');
    
    window.savingsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 5', 'Year 10', 'Year 15', 'Year 20', 'Year 25'],
            datasets: [
                {
                    label: 'Cumulative Cost Without Solar',
                    data: [1800, 10000, 25000, 45000, 70000, 100000],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4
                },
                {
                    label: 'Cumulative Cost With Solar',
                    data: [12000, 13000, 14000, 15000, 16000, 17000],
                    borderColor: '#0EA5E9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': £' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return '£' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateSavingsChart(monthlyBill, annualIncrease) {
    if (!window.savingsChart) return;
    
    const years = [1, 5, 10, 15, 20, 25];
    const withoutSolar = [];
    const withSolar = [];
    
    let totalWithoutSolar = 0;
    let currentBill = monthlyBill * 12;
    
    // Calculate system cost
    let systemKw = 4;
    if (monthlyBill > 100) systemKw = 6;
    if (monthlyBill > 150) systemKw = 8;
    if (monthlyBill > 200) systemKw = 10;
    if (monthlyBill > 300) systemKw = 12;
    const systemCost = systemKw * 1500;
    
    // Calculate data points
    for (let year = 1; year <= 25; year++) {
        totalWithoutSolar += currentBill;
        currentBill *= (1 + annualIncrease);
        
        if (years.includes(year)) {
            withoutSolar.push(Math.round(totalWithoutSolar));
            withSolar.push(Math.round(systemCost + (monthlyBill * 12 * 0.2 * year)));
        }
    }
    
    // Update chart data
    window.savingsChart.data.datasets[0].data = withoutSolar;
    window.savingsChart.data.datasets[1].data = withSolar;
    window.savingsChart.update();
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Smooth height animation
            if (!isActive) {
                const height = answer.scrollHeight;
                answer.style.maxHeight = height + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}

// Export functions for use in other scripts
window.solarPanelsOldham = {
    debounce,
    throttle,
    initCustomCursor,
    initRevealAnimations,
    initCostCalculator,
    initCharts,
    initFAQ
};