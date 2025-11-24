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

            // Initialize cards
            this.initCards();

            // Initialize calculator module
            await this.initCalculator();
            
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
     * Initialize calculator module
     */
    async initCalculator() {
        try {
            // Load calculator module
            const { SolarCalculator } = await import('/modules/calculator/calculator.js');

            // Find calculator container (it should be in the DOM now that template is inserted)
            const calculatorContainer = document.querySelector('#solar-calculator');
            if (calculatorContainer) {
                // Initialize calculator with the container
                const calculatorInstance = new SolarCalculator();
                await calculatorInstance.init(calculatorContainer);

                // Store reference
                this.calculator = calculatorInstance;

                console.log('Calculator module initialized successfully');
            } else {
                console.warn('Calculator container not found');
            }
        } catch (error) {
            console.error('Failed to initialize calculator module:', error);
        }
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
                        <div class="animated-counter" data-component="counter" data-target="2847">
                            <span class="counter-value">0</span>
                            <span class="counter-suffix">Homes Powered</span>
                        </div>
                        <div class="animated-counter" data-component="counter" data-target="4200">
                            <span class="counter-prefix">£</span>
                            <span class="counter-value">0</span>
                            <span class="counter-suffix">Avg Yearly Savings</span>
                        </div>
                        <div class="animated-counter" data-component="counter" data-target="25">
                            <span class="counter-value">0</span>
                            <span class="counter-suffix">Year Warranty</span>
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
            
            <!-- Futuristic Solar Calculator Section -->
            <section id="calculator" class="section calculator-section">
                <div class="container">
                    <div class="section-header text-center mb-16">
                        <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            ⚡ Solar Power Calculator
                        </h2>
                        <p class="text-xl text-light-darker max-w-3xl mx-auto">
                            Discover your path to energy independence with our advanced solar simulation
                        </p>
                    </div>

                    <!-- Futuristic Calculator Interface -->
                    <div class="solar-calculator-futuristic" id="solar-calculator">
                        <!-- Control Panel -->
                        <div class="control-panel">
                            <div class="panel-header">
                                <div class="panel-icon">⚡</div>
                                <h3 class="panel-title">Energy Configuration</h3>
                            </div>

                            <!-- Interactive Controls -->
                            <div class="controls-grid">
                                <!-- Electricity Bill Slider -->
                                <div class="control-group">
                                    <label class="control-label">
                                        <span class="label-icon">💡</span>
                                        Monthly Electricity Bill
                                    </label>
                                    <div class="slider-container-futuristic">
                                        <input type="range" min="50" max="500" value="120" step="5" class="futuristic-slider" data-input="bill" id="bill-slider">
                                        <div class="slider-track">
                                            <div class="slider-fill" id="bill-fill"></div>
                                        </div>
                                        <div class="slider-value-display">
                                            <span class="currency-symbol">£</span>
                                            <span class="value-number" data-value="bill">120</span>
                                        </div>
                                    </div>
                                    <div class="slider-labels">
                                        <span>£50</span>
                                        <span>£500</span>
                                    </div>
                                </div>

                                <!-- Property Type Selector -->
                                <div class="control-group">
                                    <label class="control-label">
                                        <span class="label-icon">🏠</span>
                                        Property Type
                                    </label>
                                    <div class="property-selector">
                                        <button class="property-btn" data-property="terraced">
                                            <div class="property-icon">🏠</div>
                                            <div class="property-name">Terraced</div>
                                        </button>
                                        <button class="property-btn active" data-property="semi">
                                            <div class="property-icon">🏡</div>
                                            <div class="property-name">Semi-Detached</div>
                                        </button>
                                        <button class="property-btn" data-property="detached">
                                            <div class="property-icon">🏘️</div>
                                            <div class="property-name">Detached</div>
                                        </button>
                                        <button class="property-btn" data-property="bungalow">
                                            <div class="property-icon">🏚️</div>
                                            <div class="property-name">Bungalow</div>
                                        </button>
                                    </div>
                                </div>

                                <!-- Roof Orientation -->
                                <div class="control-group">
                                    <label class="control-label">
                                        <span class="label-icon">☀️</span>
                                        Solar Orientation
                                    </label>
                                    <div class="orientation-selector">
                                        <button class="orientation-btn active" data-orientation="south">
                                            <div class="orientation-visual">
                                                <div class="sun-icon">☀️</div>
                                                <div class="orientation-lines south-lines"></div>
                                            </div>
                                            <div class="orientation-label">South</div>
                                        </button>
                                        <button class="orientation-btn" data-orientation="east-west">
                                            <div class="orientation-visual">
                                                <div class="sun-icon">🌅</div>
                                                <div class="orientation-lines east-west-lines"></div>
                                            </div>
                                            <div class="orientation-label">East/West</div>
                                        </button>
                                        <button class="orientation-btn" data-orientation="north">
                                            <div class="orientation-visual">
                                                <div class="sun-icon">🌙</div>
                                                <div class="orientation-lines north-lines"></div>
                                            </div>
                                            <div class="orientation-label">North</div>
                                        </button>
                                    </div>
                                </div>

                                <!-- System Size Override -->
                                <div class="control-group">
                                    <label class="control-label">
                                        <span class="label-icon">🔋</span>
                                        System Size (kWp)
                                    </label>
                                    <div class="size-selector">
                                        <button class="size-btn" data-size="auto">
                                            <div class="size-icon">🎯</div>
                                            <div class="size-label">Auto</div>
                                        </button>
                                        <button class="size-btn" data-size="2.5">
                                            <div class="size-icon">🔋</div>
                                            <div class="size-label">2.5 kWp</div>
                                        </button>
                                        <button class="size-btn" data-size="3.5">
                                            <div class="size-icon">🔋</div>
                                            <div class="size-label">3.5 kWp</div>
                                        </button>
                                        <button class="size-btn" data-size="4.5">
                                            <div class="size-icon">🔋</div>
                                            <div class="size-label">4.5 kWp</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Results Dashboard -->
                        <div class="results-dashboard">
                            <div class="dashboard-header">
                                <div class="dashboard-icon">📊</div>
                                <h3 class="dashboard-title">Energy Savings Analysis</h3>
                            </div>

                            <!-- Key Metrics -->
                            <div class="metrics-grid">
                                <div class="metric-card savings-card">
                                    <div class="metric-icon">💰</div>
                                    <div class="metric-content">
                                        <div class="metric-value">£<span data-result="annual">0</span></div>
                                        <div class="metric-label">Annual Savings</div>
                                        <div class="metric-trend" data-trend="annual">↗️ +0%</div>
                                    </div>
                                </div>

                                <div class="metric-card roi-card">
                                    <div class="metric-icon">📈</div>
                                    <div class="metric-content">
                                        <div class="metric-value"><span data-result="roi">0</span>%</div>
                                        <div class="metric-label">25 Year ROI</div>
                                        <div class="metric-trend" data-trend="roi">↗️ +0%</div>
                                    </div>
                                </div>

                                <div class="metric-card payback-card">
                                    <div class="metric-icon">⏱️</div>
                                    <div class="metric-content">
                                        <div class="metric-value"><span data-result="payback">0</span> yrs</div>
                                        <div class="metric-label">Payback Period</div>
                                        <div class="metric-trend" data-trend="payback">↗️ +0%</div>
                                    </div>
                                </div>

                                <div class="metric-card system-card">
                                    <div class="metric-icon">⚡</div>
                                    <div class="metric-content">
                                        <div class="metric-value"><span data-result="systemSize">0</span> kWp</div>
                                        <div class="metric-label">System Size</div>
                                        <div class="metric-trend" data-trend="system">↗️ +0%</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Interactive Chart -->
                            <div class="chart-section">
                                <div class="chart-header">
                                    <h4 class="chart-title">25-Year Financial Projection</h4>
                                    <div class="chart-controls">
                                        <button class="chart-toggle active" data-chart="savings">Savings</button>
                                        <button class="chart-toggle" data-chart="generation">Generation</button>
                                        <button class="chart-toggle" data-chart="roi">ROI</button>
                                    </div>
                                </div>
                                <div class="chart-container">
                                    <canvas id="savings-chart" width="800" height="300"></canvas>
                                    <div class="chart-overlay">
                                        <div class="chart-particle" id="chart-particle-1"></div>
                                        <div class="chart-particle" id="chart-particle-2"></div>
                                        <div class="chart-particle" id="chart-particle-3"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- System Visualization -->
                            <div class="system-visualization">
                                <div class="roof-preview">
                                    <div class="roof-outline">
                                        <div class="solar-panels" id="solar-panels-viz">
                                            <!-- Panels will be generated dynamically -->
                                        </div>
                                        <div class="sun-position" id="sun-position"></div>
                                        <div class="energy-flow" id="energy-flow"></div>
                                    </div>
                                    <div class="viz-stats">
                                        <div class="viz-stat">
                                            <span class="viz-icon">☀️</span>
                                            <span class="viz-value"><span data-result="annualGeneration">0</span> kWh/year</span>
                                        </div>
                                        <div class="viz-stat">
                                            <span class="viz-icon">💡</span>
                                            <span class="viz-value">£<span data-result="systemCost">0</span> total</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CTA Section -->
                            <div class="calculator-cta">
                                <div class="cta-content">
                                    <h4 class="cta-title">Ready to Go Solar?</h4>
                                    <p class="cta-subtitle">Get your personalized solar proposal today</p>
                                    <div class="cta-buttons">
                                        <button class="cta-btn primary" data-action="show-quote-form">
                                            <span class="btn-icon">⚡</span>
                                            Get Free Quote
                                            <span class="btn-arrow">→</span>
                                        </button>
                                        <button class="cta-btn secondary" data-action="download-report">
                                            <span class="btn-icon">📄</span>
                                            Download Report
                                        </button>
                                    </div>
                                </div>
                                <div class="cta-visual">
                                    <div class="energy-pulse"></div>
                                    <div class="solar-flare"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Background Effects -->
                <div class="calculator-bg-effects">
                    <div class="electricity-arc arc-1"></div>
                    <div class="electricity-arc arc-2"></div>
                    <div class="electricity-arc arc-3"></div>
                    <div class="particle-field" id="calculator-particles"></div>
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
            <div class="modal" data-component="modal" id="quote-modal">
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close">×</button>
                    <div class="modal-header">
                        <h2 class="modal-title">Get Your Free Solar Quote</h2>
                    </div>
                    <div class="modal-body">
                        <form class="quote-form" id="quote-form">
                            <div class="form-group">
                                <div class="form-field" data-component="form-field">
                                    <input type="text" class="animated-input" name="name" id="quote-name" required>
                                    <label for="quote-name" class="animated-label">Full Name</label>
                                    <span class="field-line"></span>
                                    <span class="field-error"></span>
                                </div>
                                <div class="form-field" data-component="form-field">
                                    <input type="email" class="animated-input" name="email" id="quote-email" required>
                                    <label for="quote-email" class="animated-label">Email Address</label>
                                    <span class="field-line"></span>
                                    <span class="field-error"></span>
                                </div>
                                <div class="form-field" data-component="form-field">
                                    <input type="tel" class="animated-input" name="phone" id="quote-phone" required>
                                    <label for="quote-phone" class="animated-label">Phone Number</label>
                                    <span class="field-line"></span>
                                    <span class="field-error"></span>
                                </div>
                                <div class="form-field" data-component="form-field">
                                    <input type="text" class="animated-input" name="postcode" id="quote-postcode" required>
                                    <label for="quote-postcode" class="animated-label">Postcode</label>
                                    <span class="field-line"></span>
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
        if (this.calculator) {
            data.calculator_results = this.calculator.getState();
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
     * Show quote modal using modal component
     */
    async showQuoteModal() {
        const modal = document.querySelector('#quote-modal');
        if (modal && modal._componentInstance) {
            await modal._componentInstance.show();
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
        // Destroy calculator instance
        if (this.calculator && typeof this.calculator.destroy === 'function') {
            this.calculator.destroy();
        }

        this.initialized = false;
        emit('module:home:destroyed');
    }
};

export { HomePage as default };