/**
 * Component: Home Page Module
 * Module: Home
 * Purpose: Main landing page that combines all components
 * Dependencies: /core/state.js, /core/events.js, /core/components.js
 * Author: Initial Setup Agent
 * Date: November 2024
 * Version: 3.0 - Complete single page with working components
 */

console.log('Home.js Version 3.0 loaded - Complete Fix');

import { emit } from '/core/events.js';
import { setState, getState, subscribe } from '/core/state.js';

const HomePage = class {
    constructor() {
        this.initialized = false;
        this.particles = [];
        this.animationFrame = null;
    }
    
    /**
     * Initialize home page
     */
    async init(container, routeData = {}) {
        try {
            console.log('HomePage init started');
            
            // Create home page content
            container.innerHTML = this.getTemplate();
            
            // Load component styles
            await this.loadStyles();
            
            // Initialize particles manually since component system isn't working
            this.initParticles();
            
            // Initialize counters
            this.initCounters();
            
            // Initialize cards
            this.initCards();
            
            // Initialize calculator
            this.initCalculator();
            
            // Add smooth scrolling
            this.setupSmoothScrolling();
            
            // Add scroll animations
            this.setupScrollAnimations();
            
            this.initialized = true;
            emit('module:home:initialized');
            
        } catch (error) {
            console.error('Home page initialization failed:', error);
            emit('module:home:error', error);
        }
    }
    
    /**
     * Initialize particle system directly
     */
    initParticles() {
        console.log('Initializing particles');
        const container = document.querySelector('.hero-particles');
        if (!container) {
            console.error('Particle container not found');
            return;
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width || window.innerWidth;
            canvas.height = rect.height || window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Mouse position
        let mouse = { x: null, y: null };
        container.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        container.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        // Create particles
        const particleCount = 80;
        const particles = [];
        const particleColors = ['#FFD700', '#FFED4A', '#F59E0B'];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1.5,
                color: particleColors[Math.floor(Math.random() * particleColors.length)]
            });
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, i) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off walls
                if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
                if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;
                
                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - particle.x;
                    const dy = mouse.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        const force = (100 - distance) / 100;
                        particle.vx -= (dx / distance) * force * 0.5;
                        particle.vy -= (dy / distance) * force * 0.5;
                    }
                }
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const dx = other.x - particle.x;
                    const dy = other.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = 1 - (distance / 150);
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Initialize counting animations
     */
    initCounters() {
        const counters = document.querySelectorAll('.stat-item');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const numberElement = counter.querySelector('.stat-number');
            
            if (!numberElement || isNaN(target)) return;
            
            // Use Intersection Observer
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(numberElement, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    /**
     * Animate counter
     */
    animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
    
    /**
     * Initialize interactive cards
     */
    initCards() {
        const cards = document.querySelectorAll('.interactive-card');
        
        cards.forEach(card => {
            const inner = card.querySelector('.card-inner');
            const glow = card.querySelector('.card-glow');
            
            if (!inner) return;
            
            // Only add tilt on desktop
            if (window.innerWidth > 768 && card.dataset.tilt !== 'false') {
                card.addEventListener('mouseenter', () => {
                    card.classList.add('is-hovering');
                });
                
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const tiltX = ((y - centerY) / centerY) * 15;
                    const tiltY = ((centerX - x) / centerX) * 15;
                    
                    inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
                    
                    if (glow) {
                        glow.style.opacity = '1';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    card.classList.remove('is-hovering');
                    inner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
                    
                    if (glow) {
                        glow.style.opacity = '0';
                    }
                });
            }
        });
    }
    
    /**
     * Initialize calculator inline
     */
    initCalculator() {
        // Calculator state
        const calcState = {
            monthlyBill: 100,
            propertyType: 'semi',
            roofOrientation: 'south',
            shading: 'none'
        };
        
        // Setup inputs
        const billSlider = document.querySelector('[data-input="bill"]');
        const billDisplay = document.querySelector('[data-value="bill"]');
        
        if (billSlider) {
            billSlider.addEventListener('input', (e) => {
                calcState.monthlyBill = parseFloat(e.target.value);
                billDisplay.textContent = e.target.value;
                this.calculateSavings();
            });
        }
        
        // Toggle buttons for both property type and roof orientation
        document.querySelectorAll('.toggle-option').forEach(button => {
            button.addEventListener('click', () => {
                const group = button.parentElement;
                const inputType = button.dataset.input;
                
                // Only remove active from buttons in the same group
                group.querySelectorAll('.toggle-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Update state based on input type
                if (inputType === 'facing') {
                    calcState.roofOrientation = button.dataset.value;
                } else if (inputType === 'property') {
                    calcState.propertyType = button.dataset.value;
                }
                
                this.calculateSavings();
            });
        });
        
        // Store calc state globally
        this.calcState = calcState;
        
        // Initialize chart
        this.initChart();
        
        // Initial calculation
        this.calculateSavings();
    }
    
    /**
     * Calculate solar savings with realistic formulas
     */
    calculateSavings() {
        const state = this.calcState;
        
        // More accurate UK solar calculations
        const annualBill = state.monthlyBill * 12;
        
        // System sizes (kW) based on property type - realistic for UK homes
        const systemSizes = { 
            terraced: 3.0,
            semi: 4.0, 
            detached: 5.5,
            bungalow: 4.5 
        };
        const systemSize = systemSizes[state.propertyType] || 4.0;
        
        // UK solar efficiency by orientation
        const efficiencyFactors = { 
            south: 1.0,
            'east-west': 0.85,
            north: 0.6
        };
        const efficiency = efficiencyFactors[state.roofOrientation] || 1.0;
        
        // UK average: 850-950 kWh per kWp per year
        const ukAverageGeneration = 900;
        const annualGeneration = systemSize * ukAverageGeneration * efficiency;
        
        // UK electricity price: ~£0.34 per kWh (2024)
        const electricityPrice = 0.34;
        
        // Assume 60% self-consumption, rest exported at lower rate
        const selfConsumption = annualGeneration * 0.6;
        const exportAmount = annualGeneration * 0.4;
        const exportRate = 0.15; // SEG export rate
        
        const savingsFromSelfUse = selfConsumption * electricityPrice;
        const earningsFromExport = exportAmount * exportRate;
        const annualSavings = Math.min(savingsFromSelfUse + earningsFromExport, annualBill * 0.85);
        
        // System cost: £1,400-1,600 per kWp installed (2024 UK average)
        const costPerKW = 1450;
        const systemCost = systemSize * costPerKW;
        
        // Calculations
        const paybackPeriod = systemCost / annualSavings;
        const lifetime25Savings = (annualSavings * 25) - systemCost;
        const roi25Year = (lifetime25Savings / systemCost) * 100;
        
        // Update display with smooth animations
        const updateElement = (selector, value) => {
            const element = document.querySelector(`[data-result="${selector}"]`);
            if (element) {
                this.animateNumber(element, value);
            }
        };
        
        updateElement('annual', Math.round(annualSavings));
        updateElement('roi', Math.round(roi25Year));
        updateElement('payback', paybackPeriod.toFixed(1));
        
        // Update chart
        this.drawChart(annualSavings);
    }
    
    /**
     * Initialize savings chart
     */
    initChart() {
        const canvas = document.querySelector('#savings-chart');
        if (!canvas) return;
        
        this.chartCanvas = canvas;
        this.chartCtx = canvas.getContext('2d');
        
        // Set canvas size
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = 300;
    }
    
    /**
     * Draw savings chart
     */
    drawChart(annualSavings) {
        if (!this.chartCtx || !this.chartCanvas) return;
        
        const ctx = this.chartCtx;
        const canvas = this.chartCanvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate cumulative savings over 25 years
        const years = 25;
        const data = [];
        let cumulative = 0;
        
        for (let i = 0; i <= years; i++) {
            cumulative += annualSavings * (i > 0 ? 1 : 0);
            data.push(cumulative);
        }
        
        const maxValue = Math.max(...data);
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw area gradient
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0.05)');
        
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / years) * index;
            const y = height - padding - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.lineTo(width - padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        data.forEach((value, index) => {
            const x = padding + (chartWidth / years) * index;
            const y = height - padding - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw points
        data.forEach((value, index) => {
            if (index % 5 === 0) {
                const x = padding + (chartWidth / years) * index;
                const y = height - padding - (value / maxValue) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#FFD700';
                ctx.fill();
                
                // Draw value labels
                ctx.fillStyle = '#F8FAFC';
                ctx.font = '12px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`Year ${index}`, x, height - padding + 20);
            }
        });
        
        // Draw title
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cumulative Savings Over 25 Years', width / 2, 20);
    }
    
    /**
     * Animate number change
     */
    animateNumber(element, target) {
        const current = parseFloat(element.textContent.replace(/,/g, '')) || 0;
        const duration = 1000;
        const steps = 30;
        const increment = (target - current) / steps;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            const value = current + (increment * step);
            
            if (step >= steps) {
                element.textContent = typeof target === 'string' ? target : target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.round(value).toLocaleString();
            }
        }, duration / steps);
    }
    
    /**
     * Load component styles
     */
    async loadStyles() {
        const styles = [
            '/components/hero/hero.css',
            '/components/card/interactive-card.css',
            '/components/form/progress-form.css',
            '/components/loader/loader.css',
            '/modules/calculator/calculator.css'
        ];
        
        // Load all styles
        styles.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        });
    }
    
    /**
     * Get home page template
     */
    getTemplate() {
        return `
            <!-- Navigation -->
            <header class="site-nav" data-nav-state="default">
                <div class="site-nav__container">
                    <a href="#home" class="nav-logo" aria-label="Solar Panels Oldham home section">
                        <span class="nav-logo-mark">&#9728;</span>
                        <span class="nav-logo-text">
                            <span class="nav-logo-title">Solar Panels Oldham</span>
                            <span class="nav-logo-subtitle">MCS Certified Installers</span>
                        </span>
                    </a>

                    <div class="site-nav__links" role="navigation" aria-label="Primary navigation">
                        <a href="#home" class="nav-link">Home</a>
                        <a href="#services" class="nav-link">Services</a>
                        <a href="#calculator" class="nav-link">Calculator</a>
                        <a href="#contact" class="nav-link">Contact</a>
                    </div>

                    <div class="site-nav__actions">
                        <div class="nav-contact">
                            <span class="nav-contact-label">Speak to an expert</span>
                            <a href="tel:01615550198" class="nav-contact-link">0161 555 0198</a>
                        </div>
                        <button class="btn-primary nav-cta" data-action="show-quote-form">
                            <span class="btn-text">Book a Survey</span>
                            <span class="btn-shine"></span>
                        </button>
                    </div>

                    <div class="mobile-menu" data-component="mobile-menu">
                        <button class="menu-toggle" aria-label="Toggle menu">
                            <span class="hamburger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                        <nav class="menu-panel" aria-label="Mobile navigation">
                            <ul class="menu-list">
                                <li class="menu-item">
                                    <a href="#home" class="nav-link">Home</a>
                                </li>
                                <li class="menu-item">
                                    <a href="#services" class="nav-link">Services</a>
                                </li>
                                <li class="menu-item">
                                    <a href="#calculator" class="nav-link">Calculator</a>
                                </li>
                                <li class="menu-item">
                                    <a href="#contact" class="nav-link">Contact</a>
                                </li>
                                <li class="menu-item menu-item-contact">
                                    <span class="nav-contact-label">Speak to an expert</span>
                                    <a href="tel:01615550198" class="nav-contact-link">0161 555 0198</a>
                                </li>
                                <li class="menu-item menu-item-cta">
                                    <button class="btn-primary" data-action="show-quote-form">
                                        <span class="btn-text">Book a Survey</span>
                                        <span class="btn-shine"></span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div class="site-nav__progress" aria-hidden="true">
                    <span class="site-nav__progress-bar"></span>
                </div>
            </header>

            <!-- Hero Section -->
            <section id="home" class="hero-section" data-component="hero">
                <div class="hero-particles" id="particles"></div>
                <div class="hero-content">
                    <h1 class="hero-title">
                        <span class="hero-title-line1">Save Money With</span>
                        <span class="hero-title-line2">Solar Power in</span>
                        <span class="hero-accent">Oldham</span>
                    </h1>
                    <p class="hero-subtitle">Professional solar panel installation for homes in Greater Manchester. Cut your electricity bills by up to 70% with renewable energy.</p>
                    <div class="hero-stats">
                        <div class="stat-item" data-count="2847">
                            <span class="stat-number">0</span>
                            <span class="stat-label">Homes Powered</span>
                        </div>
                        <div class="stat-item" data-count="4200">
                            <span class="stat-number">0</span>
                            <span class="stat-label">Avg Yearly Savings (£)</span>
                        </div>
                        <div class="stat-item" data-count="25">
                            <span class="stat-number">0</span>
                            <span class="stat-label">Year Warranty</span>
                        </div>
                    </div>
                    <div class="hero-cta">
                        <button class="btn-primary" data-action="scroll-to-calculator">
                            <span class="btn-text">Calculate Your Savings</span>
                            <span class="btn-shine"></span>
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Services Section -->
            <section id="services" class="section">
                <div class="container">
                    <div class="section-header text-center mb-12">
                        <h2 class="text-4xl font-bold mb-4">Why Choose Solar Panels Oldham?</h2>
                        <p class="text-xl text-light-darker">Expert installation, premium products, unbeatable service</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Service Card 1 -->
                        <div class="interactive-card" data-component="card" data-tilt>
                            <div class="card-glow"></div>
                            <div class="card-inner">
                                <div class="card-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                </svg>
                                </div>
                                <h3 class="card-title">Expert Installation</h3>
                                <p class="card-description">MCS certified installers with over 25 years of experience in renewable energy systems.</p>
                                <div class="card-features">
                                    <span class="feature-tag">MCS Certified</span>
                                    <span class="feature-tag">Fully Insured</span>
                                </div>
                                <button class="card-cta" data-action="learn-more">
                                    Learn More
                                    <span class="arrow">→</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Service Card 2 -->
                        <div class="interactive-card card-featured" data-component="card" data-tilt>
                            <div class="card-glow"></div>
                            <div class="card-inner">
                                <div class="card-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/>
                                </svg>
                                </div>
                                <h3 class="card-title">Premium Solar Panels</h3>
                                <p class="card-description">Top-tier panels from leading manufacturers with industry-best efficiency ratings.</p>
                                <div class="card-features">
                                    <span class="feature-tag">Tier 1 Panels</span>
                                    <span class="feature-tag">25 Year Warranty</span>
                                </div>
                                <button class="card-cta" data-action="view-products">
                                    View Products
                                    <span class="arrow">→</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Service Card 3 -->
                        <div class="interactive-card" data-component="card" data-tilt>
                            <div class="card-glow"></div>
                            <div class="card-inner">
                                <div class="card-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                </div>
                                <h3 class="card-title">Local Service</h3>
                                <p class="card-description">Based in Oldham, serving Saddleworth, Uppermill, and all of Greater Manchester.</p>
                                <div class="card-features">
                                    <span class="feature-tag">Same Day Quote</span>
                                    <span class="feature-tag">Local Team</span>
                                </div>
                                <button class="card-cta" data-action="service-areas">
                                    Service Areas
                                    <span class="arrow">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Calculator Section -->
            <section id="calculator" class="section bg-dark-light">
                <div class="container">
                    <div class="section-header text-center mb-12">
                        <h2 class="text-4xl font-bold mb-4">Calculate Your Solar Savings</h2>
                        <p class="text-xl text-light-darker">See how much you could save with solar panels</p>
                    </div>
                    
                    <!-- Calculator Component - no data-component attribute -->
                    <div class="solar-calculator" id="solar-calculator">
                        <div class="calc-inputs">
                            <div class="input-group">
                                <label>Monthly Electricity Bill</label>
                                <div class="slider-container">
                                    <input type="range" class="range-input" 
                                           data-input="bill" 
                                           min="50" 
                                           max="500" 
                                           value="100"
                                           step="10">
                                    <div class="slider-marks">
                                        <span>£50</span>
                                        <span>£250</span>
                                        <span>£500</span>
                                    </div>
                                </div>
                                <span class="range-value">£<span data-value="bill">100</span></span>
                            </div>
                            
                            <div class="input-group">
                                <label>Property Type</label>
                                <div class="toggle-group">
                                    <button class="toggle-option" data-input="property" data-value="terraced">
                                        <span class="toggle-icon">🏠</span>
                                        <span class="toggle-label">Terraced</span>
                                    </button>
                                    <button class="toggle-option active" data-input="property" data-value="semi">
                                        <span class="toggle-icon">🏡</span>
                                        <span class="toggle-label">Semi-Detached</span>
                                    </button>
                                    <button class="toggle-option" data-input="property" data-value="detached">
                                        <span class="toggle-icon">🏘️</span>
                                        <span class="toggle-label">Detached</span>
                                    </button>
                                    <button class="toggle-option" data-input="property" data-value="bungalow">
                                        <span class="toggle-icon">🏚️</span>
                                        <span class="toggle-label">Bungalow</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="input-group">
                                <label>Roof Orientation</label>
                                <div class="toggle-group">
                                    <button class="toggle-option active" data-input="facing" data-value="south">
                                        <span class="toggle-icon">☀️</span>
                                        <span class="toggle-label">South</span>
                                    </button>
                                    <button class="toggle-option" data-input="facing" data-value="east-west">
                                        <span class="toggle-icon">🌅</span>
                                        <span class="toggle-label">East/West</span>
                                    </button>
                                    <button class="toggle-option" data-input="facing" data-value="north">
                                        <span class="toggle-icon">🌙</span>
                                        <span class="toggle-label">North</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="calc-results">
                            <div class="result-card saving animate-scaleIn">
                                <div class="result-icon">💷</div>
                                <div class="result-value">
                                    £<span data-result="annual">0</span>
                                </div>
                                <div class="result-label">Annual Savings</div>
                            </div>
                            
                            <div class="result-card roi animate-scaleIn delay-100">
                                <div class="result-icon">📈</div>
                                <div class="result-value">
                                    <span data-result="roi">0</span>%
                                </div>
                                <div class="result-label">25 Year ROI</div>
                            </div>
                            
                            <div class="result-card payback animate-scaleIn delay-200">
                                <div class="result-icon">⏱️</div>
                                <div class="result-value">
                                    <span data-result="payback">0</span> years
                                </div>
                                <div class="result-label">Payback Period</div>
                            </div>
                        </div>
                        
                        <div class="calc-chart">
                            <canvas id="savings-chart" width="800" height="300"></canvas>
                        </div>
                        
                        <div class="calc-cta">
                            <button class="btn-primary btn-large" data-action="show-quote-form">
                                Get Your Personalized Quote
                                <span class="arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Contact Section -->
            <section id="contact" class="section">
                <div class="container text-center">
                    <h2 class="text-4xl font-bold mb-6">Ready to Start Saving?</h2>
                    <p class="text-xl mb-8 text-light-darker">Get your free, no-obligation quote today</p>
                    <button class="btn-primary btn-large" data-action="show-quote-form">
                        Get Your Free Quote
                        <span class="arrow">→</span>
                    </button>
                </div>
            </section>

            <!-- Quote Form Modal -->
            <div class="modal" id="quote-modal" style="display: none;">
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close">×</button>
                    <div class="modal-header">
                        <h2 class="modal-title">Get Your Free Solar Quote</h2>
                    </div>
                    <div class="modal-body">
                        <form class="quote-form" id="quote-form">
                            <div class="form-group">
                                <div class="form-field">
                                    <input type="text" name="name" id="name" required>
                                    <label for="name">Full Name</label>
                                    <span class="field-error"></span>
                                </div>
                                <div class="form-field">
                                    <input type="email" name="email" id="email" required>
                                    <label for="email">Email Address</label>
                                    <span class="field-error"></span>
                                </div>
                                <div class="form-field">
                                    <input type="tel" name="phone" id="phone" required>
                                    <label for="phone">Phone Number</label>
                                    <span class="field-error"></span>
                                </div>
                                <div class="form-field">
                                    <input type="text" name="postcode" id="postcode" required>
                                    <label for="postcode">Postcode</label>
                                    <span class="field-error"></span>
                                </div>
                            </div>
                            <button type="submit" class="btn-primary btn-large w-full">
                                Submit Quote Request
                                <span class="arrow">→</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup smooth scrolling
     */
    setupSmoothScrolling() {
        // Handle navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Handle button actions
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                
                if (action === 'scroll-to-calculator') {
                    document.querySelector('#calculator').scrollIntoView({ behavior: 'smooth' });
                } else if (action === 'show-quote-form') {
                    this.showQuoteModal();
                } else if (action === 'get-quote') {
                    this.showQuoteModal();
                } else if (action === 'toggle-mobile-menu') {
                    this.toggleMobileMenu();
                } else {
                    emit('home:action', { action });
                }
            });
        });

        // Setup modal close
        const modal = document.querySelector('#quote-modal');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            const backdrop = modal.querySelector('.modal-backdrop');
            
            closeBtn?.addEventListener('click', () => this.hideQuoteModal());
            backdrop?.addEventListener('click', () => this.hideQuoteModal());
        }

        // Handle form submission
        const form = document.querySelector('#quote-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmit(form);
            });
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add calculator results if available
        if (this.calcState) {
            data.calculator_results = this.calcState;
        }
        
        try {
            const response = await fetch('/api/leads.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    formId: 'quote-form',
                    timestamp: new Date().toISOString()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Thank you! We\'ll contact you within 24 hours with your personalized quote.');
                this.hideQuoteModal();
                form.reset();
            } else {
                alert('There was an error submitting your request. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    }

    /**
     * Show quote modal
     */
    showQuoteModal() {
        const modal = document.querySelector('#quote-modal');
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }

    /**
     * Hide quote modal
     */
    hideQuoteModal() {
        const modal = document.querySelector('#quote-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navLinks && navToggle) {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }
    
    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        // Add intersection observer for scroll reveals
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Update active nav on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 100)) {
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
    
    /**
     * Destroy module
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.initialized = false;
        emit('module:home:destroyed');
    }
};

export { HomePage as default };