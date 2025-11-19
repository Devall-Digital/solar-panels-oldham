/**
 * Component: Solar Calculator Module
 * Module: Calculator
 * Purpose: Interactive solar savings calculator with real-time feedback
 * Dependencies: /core/state.js, /core/events.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { setState, getState, subscribe } from '/core/state.js';
import { emit, on } from '/core/events.js';

const SolarCalculator = class {
    constructor() {
        this.initialized = false;
        
        // Calculator configuration
        this.config = {
            // Average costs and savings
            systemCostPerKw: 1500,
            averageSystemSize: 4, // kW
            electricityRate: 0.34, // £ per kWh
            feedInTariff: 0.05, // £ per kWh
            annualIncrease: 0.05, // 5% electricity price increase
            
            // System efficiency factors
            efficiencyLoss: 0.008, // 0.8% per year
            peakSunHours: {
                south: 4.5,
                'east-west': 3.8,
                north: 3.0
            },
            
            // Property size factors
            propertySystemSize: {
                terraced: 3,
                semi: 4,
                detached: 6,
                bungalow: 4
            }
        };
        
        // Current calculation state
        this.state = {
            monthlyBill: 100,
            propertyType: 'semi',
            roofOrientation: 'south',
            shading: 'none',
            
            // Results
            systemSize: 0,
            annualGeneration: 0,
            annualSavings: 0,
            paybackPeriod: 0,
            co2Saved: 0,
            roi25Year: 0
        };
        
        // Chart instance
        this.chart = null;
    }
    
    /**
     * Initialize calculator module
     */
    async init(container, routeData = {}) {
        try {
            // Create calculator UI
            container.innerHTML = this.getTemplate();
            
            // Set up state
            setState('calculator', this.state);
            
            // Initialize components
            this.setupInputHandlers();
            this.setupChart();
            
            // Perform initial calculation
            this.calculate();
            
            // Subscribe to state changes
            subscribe('calculator', (state) => {
                this.calculate();
            });
            
            this.initialized = true;
            emit('module:calculator:initialized');
            
        } catch (error) {
            console.error('Calculator initialization failed:', error);
            emit('module:calculator:error', error);
        }
    }
    
    /**
     * Get calculator template
     */
    getTemplate() {
        return `
            <div class="calculator-module">
                <div class="container">
                    <header class="module-header">
                        <h1 class="module-title">Solar Savings Calculator</h1>
                        <p class="module-subtitle">Discover how much you could save with solar panels</p>
                    </header>
                    
                    <div class="calculator-content">
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
                                
                                <div class="input-group">
                                    <label>Shading</label>
                                    <div class="toggle-group">
                                        <button class="toggle-option active" data-input="shading" data-value="none">None</button>
                                        <button class="toggle-option" data-input="shading" data-value="partial">Partial</button>
                                        <button class="toggle-option" data-input="shading" data-value="heavy">Heavy</button>
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
                                
                                <div class="result-card co2 animate-scaleIn delay-300">
                                    <div class="result-icon">🌍</div>
                                    <div class="result-value">
                                        <span data-result="co2">0</span> tons
                                    </div>
                                    <div class="result-label">CO2 Saved/Year</div>
                                </div>
                            </div>
                            
                            <div class="calc-chart">
                                <canvas id="savings-chart"></canvas>
                            </div>
                            
                            <div class="calc-breakdown">
                                <h3>System Details</h3>
                                <div class="breakdown-grid">
                                    <div class="breakdown-item">
                                        <span class="breakdown-label">Recommended System Size</span>
                                        <span class="breakdown-value"><span data-result="system-size">0</span> kW</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span class="breakdown-label">Annual Generation</span>
                                        <span class="breakdown-value"><span data-result="generation">0</span> kWh</span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span class="breakdown-label">System Cost (estimate)</span>
                                        <span class="breakdown-value">£<span data-result="cost">0</span></span>
                                    </div>
                                    <div class="breakdown-item">
                                        <span class="breakdown-label">25 Year Savings</span>
                                        <span class="breakdown-value">£<span data-result="total-savings">0</span></span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="calc-cta">
                                <button class="btn-primary btn-large" data-action="get-quote">
                                    Get Your Personalized Quote
                                    <span class="arrow">→</span>
                                </button>
                                <p class="cta-subtext">No obligation • Free survey • Expert advice</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup input handlers
     */
    setupInputHandlers() {
        // Range inputs
        document.querySelectorAll('.range-input').forEach(input => {
            const updateValue = () => {
                const valueDisplay = document.querySelector(`[data-value="${input.dataset.input}"]`);
                if (valueDisplay) {
                    valueDisplay.textContent = input.value;
                }
                this.updateState(input.dataset.input, parseFloat(input.value));
            };
            
            input.addEventListener('input', updateValue);
            input.addEventListener('change', updateValue);
        });
        
        // Select inputs
        document.querySelectorAll('.select-input').forEach(select => {
            select.addEventListener('change', () => {
                this.updateState(select.dataset.input, select.value);
            });
        });
        
        // Toggle buttons
        document.querySelectorAll('.toggle-option').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active from siblings
                const group = button.parentElement;
                group.querySelectorAll('.toggle-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active to clicked
                button.classList.add('active');
                
                // Update state
                this.updateState(button.dataset.input, button.dataset.value);
            });
        });
        
        // CTA button
        const ctaButton = document.querySelector('[data-action="get-quote"]');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.handleGetQuote();
            });
        }
    }
    
    /**
     * Update calculator state
     */
    updateState(key, value) {
        const currentState = getState('calculator') || this.state;
        
        // Map input keys to state keys
        const keyMap = {
            'bill': 'monthlyBill',
            'property': 'propertyType',
            'facing': 'roofOrientation',
            'shading': 'shading'
        };
        
        const stateKey = keyMap[key] || key;
        
        setState('calculator', {
            ...currentState,
            [stateKey]: value
        });
    }
    
    /**
     * Perform calculation
     */
    calculate() {
        const state = getState('calculator') || this.state;
        
        // Calculate annual electricity cost
        const annualElectricityCost = state.monthlyBill * 12;
        
        // Determine system size based on property type
        const systemSize = this.config.propertySystemSize[state.propertyType] || 4;
        
        // Calculate peak sun hours based on orientation
        let peakSunHours = this.config.peakSunHours[state.roofOrientation] || 4;
        
        // Apply shading factor
        const shadingFactors = {
            'none': 1.0,
            'partial': 0.8,
            'heavy': 0.6
        };
        peakSunHours *= shadingFactors[state.shading] || 1.0;
        
        // Calculate annual generation
        const annualGeneration = systemSize * peakSunHours * 365;
        
        // Calculate savings
        const electricitySaved = Math.min(annualGeneration * this.config.electricityRate, annualElectricityCost);
        const feedInIncome = annualGeneration * 0.3 * this.config.feedInTariff; // Assume 30% exported
        const annualSavings = electricitySaved + feedInIncome;
        
        // Calculate system cost
        const systemCost = systemSize * this.config.systemCostPerKw;
        
        // Calculate payback period
        const paybackPeriod = systemCost / annualSavings;
        
        // Calculate 25-year savings with inflation
        let totalSavings = 0;
        let currentSavings = annualSavings;
        for (let year = 1; year <= 25; year++) {
            totalSavings += currentSavings;
            currentSavings *= (1 + this.config.annualIncrease);
            currentSavings *= (1 - this.config.efficiencyLoss);
        }
        
        // Calculate ROI
        const roi = ((totalSavings - systemCost) / systemCost) * 100;
        
        // Calculate CO2 saved (0.233 kg CO2 per kWh)
        const co2Saved = (annualGeneration * 0.233) / 1000; // Convert to tons
        
        // Update results
        this.updateResults({
            systemSize: systemSize.toFixed(1),
            annualGeneration: Math.round(annualGeneration),
            annualSavings: Math.round(annualSavings),
            paybackPeriod: paybackPeriod.toFixed(1),
            co2Saved: co2Saved.toFixed(1),
            roi25Year: Math.round(roi),
            systemCost: Math.round(systemCost),
            totalSavings: Math.round(totalSavings)
        });
        
        // Update chart
        this.updateChart(annualSavings, systemCost);
        
        // Emit calculation complete
        emit('calculator:calculated', {
            ...state,
            results: this.state
        });
    }
    
    /**
     * Update results display
     */
    updateResults(results) {
        // Update result values with animation
        const updates = {
            'annual': results.annualSavings,
            'roi': results.roi25Year,
            'payback': results.paybackPeriod,
            'co2': results.co2Saved,
            'system-size': results.systemSize,
            'generation': results.annualGeneration.toLocaleString(),
            'cost': results.systemCost.toLocaleString(),
            'total-savings': results.totalSavings.toLocaleString()
        };
        
        Object.entries(updates).forEach(([key, value]) => {
            const element = document.querySelector(`[data-result="${key}"]`);
            if (element) {
                // Animate number change
                this.animateNumber(element, value);
            }
        });
        
        // Add celebration for good results
        if (results.paybackPeriod < 8) {
            this.celebrate();
        }
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
     * Setup chart
     */
    setupChart() {
        const canvas = document.getElementById('savings-chart');
        if (!canvas) return;
        
        // Create Chart.js chart (we'll use a simple canvas implementation)
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        this.chart = { canvas, ctx };
    }
    
    /**
     * Update chart
     */
    updateChart(annualSavings, systemCost) {
        if (!this.chart) return;
        
        const { canvas, ctx } = this.chart;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple cumulative savings chart
        const years = 25;
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        
        // Calculate cumulative savings
        const data = [];
        let cumulative = -systemCost;
        for (let year = 0; year <= years; year++) {
            data.push({
                year,
                value: cumulative
            });
            cumulative += annualSavings * Math.pow(1.05, year);
        }
        
        // Find max value
        const maxValue = Math.max(...data.map(d => Math.abs(d.value)));
        
        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw zero line
        const zeroY = padding + (chartHeight * (maxValue / (maxValue * 2)));
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(padding, zeroY);
        ctx.lineTo(canvas.width - padding, zeroY);
        ctx.stroke();
        
        // Draw chart line
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth * (point.year / years));
            const y = padding + (chartHeight * (1 - ((point.value + maxValue) / (maxValue * 2))));
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill area above zero
        ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth * (point.year / years));
            const y = padding + (chartHeight * (1 - ((point.value + maxValue) / (maxValue * 2))));
            
            if (index === 0) {
                ctx.moveTo(x, Math.min(y, zeroY));
            } else {
                ctx.lineTo(x, Math.min(y, zeroY));
            }
        });
        
        ctx.lineTo(canvas.width - padding, zeroY);
        ctx.lineTo(padding, zeroY);
        ctx.closePath();
        ctx.fill();
        
        // Add labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Years', canvas.width / 2, canvas.height - 10);
        
        // Payback point
        const paybackYear = systemCost / annualSavings;
        const paybackX = padding + (chartWidth * (paybackYear / years));
        
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(paybackX, zeroY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#10B981';
        ctx.font = '14px Inter';
        ctx.fillText(`Payback: ${paybackYear.toFixed(1)} years`, paybackX, zeroY - 15);
    }
    
    /**
     * Celebrate good results
     */
    celebrate() {
        const results = document.querySelectorAll('.result-card');
        results.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('celebrate');
                setTimeout(() => {
                    card.classList.remove('celebrate');
                }, 600);
            }, index * 100);
        });
    }
    
    /**
     * Handle get quote
     */
    handleGetQuote() {
        const state = getState('calculator');
        
        // Save calculator results
        setState('quote', {
            calculatorResults: state,
            timestamp: new Date().toISOString()
        });
        
        // Navigate to quote form
        emit('router:navigate', '/quote');
    }
    
    /**
     * Destroy module
     */
    destroy() {
        this.initialized = false;
        this.chart = null;
        emit('module:calculator:destroyed');
    }
};

export { SolarCalculator as default };
