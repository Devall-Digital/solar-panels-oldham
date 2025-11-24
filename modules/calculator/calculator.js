/**
 * Module: Solar Calculator
 * Purpose: Interactive solar panel savings calculator
 * Dependencies: /core/state.js, /core/events.js
 * Author: Development Agent
 * Date: November 2024
 * Version: 1.0 - Extracted from home.js for proper modularization
 */

import { emit, on } from '/core/events.js';
import { setState, getState } from '/core/state.js';

class SolarCalculator {
    constructor() {
        this.element = null;
        this.chart = null;
        this.initialized = false;

        // Calculator state
        this.state = {
            monthlyBill: 120, // More realistic UK average
            propertyType: 'semi',
            roofOrientation: 'south',
            investmentPeriod: 25, // Default investment period
            shading: 'none'
        };

        // Configuration (realistic UK values)
        this.config = {
            systemSpecs: {
                terraced: { size: 2.5, cost: 3800 },
                semi: { size: 3.5, cost: 4800 },
                detached: { size: 4.5, cost: 6200 },
                bungalow: { size: 4.0, cost: 5500 }
            },
            orientationFactors: {
                south: 1.0,
                'east-west': 0.75,
                north: 0.5
            },
            electricityPrice: 0.34, // £ per kWh (2024 UK)
            exportRate: 0.15, // Smart Export Guarantee
            selfConsumption: 0.65, // 65% self-consumption (realistic)
            baseGeneration: 900 // kWh per kWp per year (conservative)
        };

        // Bind methods
        this.handleInputChange = this.handleInputChange.bind(this);
        this.calculateSavings = this.calculateSavings.bind(this);
        this.updateUI = this.updateUI.bind(this);
    }

    /**
     * Initialize calculator
     */
    async init(container) {
        try {
            console.log('Initializing Solar Calculator module');
            this.element = container;

            // Set up inputs
            this.setupInputs();

            // Initialize chart
            this.initChart();

            // Load initial state from global state if available
            this.loadState();

            // Set initial period labels
            this.updatePeriodLabels(this.state.investmentPeriod);

            // Calculate initial results
            this.calculateSavings();

            // Set up event listeners
            this.setupEventListeners();

            this.initialized = true;
            emit('calculator:initialized');

        } catch (error) {
            console.error('Calculator initialization failed:', error);
            emit('calculator:error', error);
        }
    }

    /**
     * Set up input elements
     */
    setupInputs() {
        // Futuristic bill slider
        this.setupFuturisticSlider();

        // Property type buttons
        this.setupPropertyButtons();

        // Orientation buttons
        this.setupOrientationButtons();

        // Size selector buttons
        this.setupSizeButtons();

        // Chart toggle buttons
        this.setupChartToggles();

        // Initialize particles
        this.initParticles();
    }

    /**
     * Setup futuristic slider with real-time updates
     */
    setupFuturisticSlider() {
        const slider = this.element.querySelector('#bill-slider');
        const fill = this.element.querySelector('#bill-fill');
        const valueDisplay = this.element.querySelector('[data-value="bill"]');

        if (slider && fill && valueDisplay) {
            const updateSlider = (value) => {
                const percentage = ((value - 50) / (500 - 50)) * 100;
                fill.style.width = `${percentage}%`;
                valueDisplay.textContent = value;

                this.state.monthlyBill = parseFloat(value);
                this.calculateSavings();
                this.createSliderParticles(value);
                this.saveState();
            };

            slider.addEventListener('input', (e) => {
                updateSlider(e.target.value);
            });

            // Initialize
            slider.value = this.state.monthlyBill;
            updateSlider(this.state.monthlyBill);
        }
    }

    /**
     * Setup property type buttons
     */
    setupPropertyButtons() {
        const buttons = this.element.querySelectorAll('[data-property]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                this.state.propertyType = button.dataset.property;
                this.calculateSavings();
                this.createButtonParticles(button);
                this.saveState();
            });
        });
    }

    /**
     * Setup orientation buttons
     */
    setupOrientationButtons() {
        const buttons = this.element.querySelectorAll('[data-orientation]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                this.state.roofOrientation = button.dataset.orientation;
                this.calculateSavings();
                this.createButtonParticles(button);
                this.updateSunPosition(button.dataset.orientation);
                this.saveState();
            });
        });
    }

    /**
     * Setup size selector buttons
     */
    setupSizeButtons() {
        const buttons = this.element.querySelectorAll('[data-size]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const size = button.dataset.size === 'auto' ? null : parseFloat(button.dataset.size);
                this.state.systemSizeOverride = size;
                this.calculateSavings();
                this.createButtonParticles(button);
                this.updateSolarPanels(size);
                this.saveState();
            });
        });
    }

    /**
     * Setup chart toggle buttons
     */
    setupChartToggles() {
        const buttons = this.element.querySelectorAll('.chart-toggle');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                this.currentChartType = button.dataset.chart;
                this.updateChartDisplay();
                this.createButtonParticles(button);
            });
        });
    }

    /**
     * Update period labels in results
     */
    updatePeriodLabels(period) {
        const periodLabels = this.element.querySelectorAll('[data-period]');
        periodLabels.forEach(label => {
            label.textContent = period;
        });
    }

    /**
     * Initialize particle effects
     */
    initParticles() {
        this.particleContainer = this.element.querySelector('#calculator-particles');
        if (this.particleContainer) {
            this.createAmbientParticles();
        }
    }

    /**
     * Create ambient particle field
     */
    createAmbientParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'ambient-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

            // Random colors for electricity theme
            const colors = ['#ffd700', '#00bfff', '#ff4500', '#ff8c00'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            this.particleContainer.appendChild(particle);
        }
    }

    /**
     * Create particles on slider interaction
     */
    createSliderParticles(value) {
        const slider = this.element.querySelector('#bill-slider');
        if (!slider) return;

        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'slider-particle';
            particle.style.left = (slider.offsetLeft + slider.offsetWidth * (value - 50) / 450) + 'px';
            particle.style.top = (slider.offsetTop + slider.offsetHeight / 2) + 'px';

            const colors = ['#ffd700', '#00bfff', '#ff4500'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animation = `particleBurst ${0.5 + Math.random() * 0.5}s ease-out forwards`;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    /**
     * Create particles on button click
     */
    createButtonParticles(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'button-particle';

            const angle = (i / 8) * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            const colors = ['#ffd700', '#00bfff', '#ff4500', '#00ff88'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animation = `particleExplode ${0.6 + Math.random() * 0.4}s ease-out forwards`;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    /**
     * Update sun position based on orientation
     */
    updateSunPosition(orientation) {
        const sun = this.element.querySelector('#sun-position');
        if (!sun) return;

        const positions = {
            'south': 'right: 20px; top: -20px;',
            'east-west': 'left: 50%; top: -20px; transform: translateX(-50%);',
            'north': 'left: 20px; top: -20px;'
        };

        sun.style.cssText = positions[orientation] || positions['south'];
    }

    /**
     * Update solar panel visualization
     */
    updateSolarPanels(size) {
        const container = this.element.querySelector('#solar-panels-viz');
        if (!container) return;

        // Clear existing panels
        container.innerHTML = '';

        // Calculate number of panels based on system size
        const panelCount = size ? Math.max(2, Math.min(8, Math.round(size / 0.5))) : 4;

        for (let i = 0; i < panelCount; i++) {
            const panel = document.createElement('div');
            panel.className = 'solar-panel';
            panel.style.animationDelay = (i * 0.1) + 's';
            container.appendChild(panel);
        }
    }

    /**
     * Update chart display based on selected type
     */
    updateChartDisplay() {
        // This would switch between different chart types
        // For now, just update the existing chart
        this.drawChart(this.state.results?.annual || 0);
    }

    /**
     * Set up toggle button groups
     */
    setupToggleGroup(inputType, callback) {
        const toggles = this.element.querySelectorAll(`[data-input="${inputType}"]`);

        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                // Remove active class from siblings
                const siblings = toggle.parentElement.querySelectorAll(`[data-input="${inputType}"]`);
                siblings.forEach(sibling => sibling.classList.remove('active'));

                // Add active class to clicked toggle
                toggle.classList.add('active');

                // Call callback with value
                const value = toggle.dataset.value;
                callback(value);
            });
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for CTA clicks
        on('cta:click', (data) => {
            const { action } = data;
            if (action === 'get-quote') {
                this.handleQuoteRequest();
            }
        });

        // Listen for form submissions
        on('input:change', (data) => {
            // Update calculator state when form inputs change
            this.updateFromForm(data);
        });
    }

    /**
     * Load state from global state
     */
    loadState() {
        const savedState = getState('calculator');
        if (savedState) {
            this.state = { ...this.state, ...savedState };
            this.updateUI();
        }
    }

    /**
     * Save state to global state
     */
    saveState() {
        setState('calculator', this.state);
    }

    /**
     * Update UI to match current state
     */
    updateUI() {
        // Update bill slider and display
        const billSlider = this.element.querySelector('[data-input="bill"]');
        const billDisplay = this.element.querySelector('[data-value="bill"]');

        if (billSlider) billSlider.value = this.state.monthlyBill;
        if (billDisplay) billDisplay.textContent = this.state.monthlyBill;

        // Update toggle buttons
        this.updateToggleGroup('property', this.state.propertyType);
        this.updateToggleGroup('facing', this.state.roofOrientation);
    }

    /**
     * Update toggle group active states
     */
    updateToggleGroup(inputType, activeValue) {
        const toggles = this.element.querySelectorAll(`[data-input="${inputType}"]`);
        toggles.forEach(toggle => {
            if (toggle.dataset.value === activeValue) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        });
    }

    /**
     * Handle input changes
     */
    handleInputChange(type, value) {
        this.state[type] = value;
        this.calculateSavings();
        this.saveState();
    }

    /**
     * Calculate solar savings with realistic formulas
     */
    calculateSavings() {
        // Get inputs
        const monthlyBill = this.state.monthlyBill;
        const annualBill = monthlyBill * 12;

        // System specifications based on property type (more conservative)
        const systemSpecs = {
            terraced: { size: 2.5, cost: 3800 },
            semi: { size: 3.5, cost: 4800 },
            detached: { size: 4.5, cost: 6200 },
            bungalow: { size: 4.0, cost: 5500 }
        };

        const system = systemSpecs[this.state.propertyType] || systemSpecs.semi;

        // Orientation efficiency (more realistic factors)
        const orientationFactors = {
            south: 1.0,
            'east-west': 0.75,
            north: 0.5
        };

        const orientationFactor = orientationFactors[this.state.roofOrientation] || 1.0;

        // UK solar generation: ~850-950 kWh per kWp per year (conservative)
        const baseGeneration = 900; // kWh per kWp
        const annualGeneration = system.size * baseGeneration * orientationFactor;

        // Electricity rates (2024 UK averages)
        const unitRate = 0.34; // £ per kWh
        const exportRate = 0.15; // Smart Export Guarantee

        // Self-consumption estimate (60-70% for typical UK homes)
        const selfConsumptionRate = 0.65;

        // Calculate savings
        const selfConsumed = annualGeneration * selfConsumptionRate;
        const exported = annualGeneration * (1 - selfConsumptionRate);

        const savingsFromConsumption = selfConsumed * unitRate;
        const earningsFromExport = exported * exportRate;
        const totalAnnualSavings = savingsFromConsumption + earningsFromExport;

        // Cap savings at 80% of bill (realistic maximum)
        const realisticSavings = Math.min(totalAnnualSavings, annualBill * 0.8);

        // System economics
        const systemCost = system.cost;
        const netCost = systemCost; // Assuming no grants for simplicity

        // Payback period (years)
        const paybackYears = netCost / realisticSavings;

        // ROI calculation (simple payback method)
        const lifetimeYears = this.state.investmentPeriod;
        const totalLifetimeSavings = realisticSavings * lifetimeYears;
        const netLifetimeBenefit = totalLifetimeSavings - netCost;
        const roi = lifetimeYears >= paybackYears ? (netLifetimeBenefit / netCost) * 100 : 0;

        // Update results with realistic values
        this.updateResults({
            annualSavings: Math.round(realisticSavings),
            paybackYears: paybackYears.toFixed(1),
            roi: Math.round(Math.max(0, Math.min(roi, 25))), // Cap at realistic 25%
            systemSize: system.size.toFixed(1),
            annualGeneration: Math.round(annualGeneration),
            systemCost: systemCost.toLocaleString(),
            investmentPeriod: lifetimeYears
        });

        // Update chart
        this.drawChart(realisticSavings);

        emit('calculator:calculated', {
            annualSavings: realisticSavings,
            paybackYears,
            roi,
            systemSize: system.size,
            annualGeneration
        });
    }

    /**
     * Update results display
     */
    updateResults(results) {
        // Store previous results for trend calculation
        const previousResults = this.state.results || {};

        const updateElement = (selector, value, formatter = (v) => v.toString(), duration = 1000) => {
            const element = this.element.querySelector(`[data-result="${selector}"]`);
            if (element) {
                // Animate number change
                this.animateNumber(element, value, formatter, duration);

                // Update trend indicator
                const trendElement = this.element.querySelector(`[data-trend="${selector}"]`);
                if (trendElement && previousResults[selector] !== undefined) {
                    const change = value - previousResults[selector];
                    const percentage = previousResults[selector] !== 0 ? (change / previousResults[selector]) * 100 : 0;

                    if (Math.abs(percentage) > 1) {
                        const isPositive = change > 0;
                        trendElement.textContent = `${isPositive ? '↗️' : '↘️'} ${isPositive ? '+' : ''}${Math.abs(percentage).toFixed(1)}%`;
                        trendElement.style.color = isPositive ? '#10b981' : '#ef4444';
                        trendElement.style.animation = 'trendPulse 0.5s ease-out';
                    }
                }
            }
        };

        updateElement('annual', results.annualSavings, (v) => `£${Math.floor(v).toLocaleString()}`);
        updateElement('roi', results.roi, (v) => `${Math.floor(v)}%`);
        updateElement('payback', results.paybackYears, (v) => `${parseFloat(v).toFixed(1)} years`);
        updateElement('systemSize', results.systemSize, (v) => v.toFixed(1));
        updateElement('systemCost', results.systemCost, (v) => v.toLocaleString());
        updateElement('annualGeneration', results.annualGeneration, (v) => Math.round(v).toLocaleString());

        // Update system size display
        this.updateSolarPanels(results.systemSize);

        // Trigger success animation on results update
        this.animateResultsUpdate();

        // Store results for quote requests
        this.state.results = results;
        this.saveState();
    }

    /**
     * Animate results update with dopamine-inducing effects
     */
    animateResultsUpdate() {
        const cards = this.element.querySelectorAll('.metric-card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `cardUpdate 0.6s ease-out ${index * 0.1}s`;
            }, 10);
        });
    }

    /**
     * Initialize savings chart
     */
    initChart() {
        const canvas = this.element.querySelector('#savings-chart');
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

        // Draw points and labels
        data.forEach((value, index) => {
            if (index % 5 === 0) {
                const x = padding + (chartWidth / years) * index;
                const y = height - padding - (value / maxValue) * chartHeight;

                // Draw point
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
    animateNumber(element, targetValue, formatter = (v) => v.toString(), duration = 1000) {
        const current = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
        const target = parseFloat(targetValue);
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(progress);

            const value = current + (target - current) * easedProgress;

            // Apply the formatter function
            element.textContent = formatter(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Handle quote request
     */
    handleQuoteRequest() {
        // Include calculator results in quote request
        emit('calculator:quote-request', {
            calculatorData: this.state,
            results: this.state.results
        });
    }

    /**
     * Update calculator from form input changes
     */
    updateFromForm(data) {
        // This could be used to sync with external form changes
        // For now, the calculator manages its own state
    }

    /**
     * Get current calculator state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Reset calculator to defaults
     */
    reset() {
        this.state = {
            monthlyBill: 100,
            propertyType: 'semi',
            roofOrientation: 'south',
            shading: 'none'
        };

        this.updateUI();
        this.calculateSavings();
        this.saveState();

        emit('calculator:reset');
    }

    /**
     * Destroy calculator
     */
    destroy() {
        // Clean up event listeners
        this.initialized = false;
        emit('calculator:destroyed');
    }
}

// Create and export singleton instance
const calculator = new SolarCalculator();

export { calculator as default, SolarCalculator };
