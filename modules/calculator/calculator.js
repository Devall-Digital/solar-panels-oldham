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
            monthlyBill: 100,
            propertyType: 'semi',
            roofOrientation: 'south',
            shading: 'none'
        };

        // Configuration
        this.config = {
            systemSizes: {
                terraced: 3.0,
                semi: 4.0,
                detached: 5.5,
                bungalow: 4.5
            },
            efficiencyFactors: {
                south: 1.0,
                'east-west': 0.85,
                north: 0.6
            },
            electricityPrice: 0.34, // £ per kWh (2024 UK)
            exportRate: 0.15, // SEG export rate
            selfConsumption: 0.6, // 60% self-consumption
            ukAverageGeneration: 900 // kWh per kWp per year
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
        // Bill slider
        const billSlider = this.element.querySelector('[data-input="bill"]');
        const billDisplay = this.element.querySelector('[data-value="bill"]');

        if (billSlider && billDisplay) {
            billSlider.addEventListener('input', (e) => {
                this.state.monthlyBill = parseFloat(e.target.value);
                billDisplay.textContent = e.target.value;
                this.calculateSavings();
            });
        }

        // Property type toggles
        this.setupToggleGroup('property', (value) => {
            this.state.propertyType = value;
            this.calculateSavings();
        });

        // Roof orientation toggles
        this.setupToggleGroup('facing', (value) => {
            this.state.roofOrientation = value;
            this.calculateSavings();
        });
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
        const annualBill = this.state.monthlyBill * 12;

        // System size based on property type
        const systemSize = this.config.systemSizes[this.state.propertyType] || 4.0;

        // Efficiency based on roof orientation
        const efficiency = this.config.efficiencyFactors[this.state.roofOrientation] || 1.0;

        // Annual generation calculation
        const annualGeneration = systemSize * this.config.ukAverageGeneration * efficiency;

        // Savings calculations
        const selfConsumption = annualGeneration * this.config.selfConsumption;
        const exportAmount = annualGeneration * (1 - this.config.selfConsumption);

        const savingsFromSelfUse = selfConsumption * this.config.electricityPrice;
        const earningsFromExport = exportAmount * this.config.exportRate;
        const annualSavings = Math.min(savingsFromSelfUse + earningsFromExport, annualBill * 0.85);

        // System cost and ROI
        const costPerKW = 1450; // £ per kWp installed (2024 UK average)
        const systemCost = systemSize * costPerKW;
        const paybackPeriod = systemCost / annualSavings;
        const lifetime25Savings = (annualSavings * 25) - systemCost;
        const roi25Year = (lifetime25Savings / systemCost) * 100;

        // Update results display
        this.updateResults({
            annual: Math.round(annualSavings),
            roi: Math.round(roi25Year),
            payback: paybackPeriod.toFixed(1),
            systemSize: systemSize.toFixed(1),
            annualGeneration: Math.round(annualGeneration)
        });

        // Update chart
        this.drawChart(annualSavings);

        emit('calculator:calculated', {
            annualSavings,
            roi25Year,
            paybackPeriod,
            systemSize,
            annualGeneration
        });
    }

    /**
     * Update results display
     */
    updateResults(results) {
        const updateElement = (selector, value, formatter = (v) => v) => {
            const element = this.element.querySelector(`[data-result="${selector}"]`);
            if (element) {
                this.animateNumber(element, formatter(value));
            }
        };

        updateElement('annual', results.annual, (v) => `£${v.toLocaleString()}`);
        updateElement('roi', results.roi, (v) => `${v}%`);
        updateElement('payback', results.payback, (v) => `${v} years`);

        // Store results for quote requests
        this.state.results = results;
        this.saveState();
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
    animateNumber(element, target, duration = 1000) {
        const current = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(progress);

            const value = current + (parseFloat(target.toString().replace(/[^0-9.-]/g, '')) - current) * easedProgress;

            // Format the display
            if (typeof target === 'string' && target.includes('£')) {
                element.textContent = `£${Math.floor(value).toLocaleString()}`;
            } else if (typeof target === 'string' && target.includes('%')) {
                element.textContent = `${Math.floor(value)}%`;
            } else if (typeof target === 'string' && target.includes('years')) {
                element.textContent = `${value} years`;
            } else {
                element.textContent = target;
            }

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
