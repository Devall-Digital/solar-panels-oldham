/**
 * Component: Home Page Module
 * Module: Home
 * Purpose: Main landing page that combines all components
 * Dependencies: /core/state.js, /core/events.js, /core/components.js
 * Author: Initial Setup Agent
 * Date: November 2024
 * Version: 2.0 - Fixed export syntax
 */

console.log('Home.js Version 2.0 loaded');

import { emit } from '/core/events.js';
import { initComponents } from '/core/components.js';

const HomePage = class {
    constructor() {
        this.initialized = false;
    }
    
    /**
     * Initialize home page
     */
    async init(container, routeData = {}) {
        try {
            // Create home page content
            container.innerHTML = this.getTemplate();
            
            // Load component styles
            await this.loadStyles();
            
            // Initialize all components on the page
            await initComponents();
            
            // Initialize calculator inline
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
            <nav class="fixed top-0 left-0 right-0 bg-dark-light backdrop-blur-md z-50 border-b border-dark-lighter">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center h-16">
                        <div class="font-bold text-xl text-primary">Solar Panels Oldham</div>
                        <div class="hidden md:flex space-x-6">
                            <a href="#home" class="nav-link text-light hover:text-primary transition-colors">Home</a>
                            <a href="#services" class="nav-link text-light hover:text-primary transition-colors">Services</a>
                            <a href="#calculator" class="nav-link text-light hover:text-primary transition-colors">Calculator</a>
                            <a href="#contact" class="nav-link text-light hover:text-primary transition-colors">Contact</a>
                        </div>
                        <button class="btn-primary" data-action="get-quote">
                            Get Quote
                        </button>
                    </div>
                </div>
            </nav>

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
                    
                    <!-- Calculator Component -->
                    <div class="solar-calculator" data-component="calculator">
                        <div class="calc-inputs">
                            <div class="input-group">
                                <label>Monthly Electricity Bill</label>
                                <input type="range" class="range-input" 
                                       data-input="bill" 
                                       min="50" 
                                       max="500" 
                                       value="100"
                                       step="10">
                                <span class="range-value">£<span data-value="bill">100</span></span>
                            </div>
                            
                            <div class="input-group">
                                <label>Property Type</label>
                                <select class="select-input" data-input="property">
                                    <option value="terraced">Terraced House</option>
                                    <option value="semi" selected>Semi-Detached</option>
                                    <option value="detached">Detached House</option>
                                    <option value="bungalow">Bungalow</option>
                                </select>
                            </div>
                            
                            <div class="input-group">
                                <label>Roof Orientation</label>
                                <div class="toggle-group">
                                    <button class="toggle-option active" data-input="facing" data-value="south">South</button>
                                    <button class="toggle-option" data-input="facing" data-value="east-west">East/West</button>
                                    <button class="toggle-option" data-input="facing" data-value="north">North</button>
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
            <div class="modal" data-component="modal" id="quote-modal" style="display: none;">
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close">×</button>
                    <div class="modal-header">
                        <h2 class="modal-title">Get Your Free Solar Quote</h2>
                    </div>
                    <div class="modal-body">
                        <form class="progress-form" data-component="progress-form" id="quote-form">
                            <div class="form-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" data-progress="0"></div>
                                </div>
                            </div>
                            
                            <div class="form-screens">
                                <!-- Step 1 -->
                                <div class="form-screen active" data-screen="1">
                                    <h3 class="screen-title">Your Details</h3>
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
                                    </div>
                                    <button type="button" class="btn-next" data-next="2">
                                        Continue <span class="arrow">→</span>
                                    </button>
                                </div>
                            </div>
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
     * Initialize calculator
     */
    async initCalculator() {
        try {
            const { default: SolarCalculator } = await import('/modules/calculator/calculator.js');
            const calculatorElement = document.querySelector('.solar-calculator[data-component="calculator"]');
            if (calculatorElement) {
                // Create a mini container for calculator
                const calcModule = new SolarCalculator();
                // Initialize with just the calculator element
                const miniContainer = document.createElement('div');
                miniContainer.innerHTML = calculatorElement.outerHTML;
                await calcModule.init(miniContainer);
                // Replace with initialized content
                calculatorElement.parentNode.replaceChild(miniContainer.firstChild, calculatorElement);
            }
        } catch (error) {
            console.error('Failed to initialize inline calculator:', error);
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
        this.initialized = false;
        emit('module:home:destroyed');
    }
};

export { HomePage as default };