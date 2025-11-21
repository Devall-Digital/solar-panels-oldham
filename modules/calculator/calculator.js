/**
 * Module: Solar Calculator
 * Purpose: Main calculator module with advanced calculations and analytics
 * Dependencies: components/calculator/calculator.js, Chart.js
 * Author: Solar Calculator Agent
 * Date: 2025-11-21
 */

class CalculatorModule {
    constructor() {
        this.isInitialized = false;
        this.calculators = new Map();
        this.analytics = {
            calculations: 0,
            averageBill: 0,
            popularPropertyType: null,
            conversionRate: 0
        };

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.loadDependencies();
        this.setupEventListeners();
        this.trackAnalytics();

        this.isInitialized = true;
        console.log('Solar Calculator Module initialized');
    }

    loadDependencies() {
        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            this.loadChartJS();
        }
    }

    loadChartJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.integrity = 'sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6YYMgYW713pf3rstl4ugLkUqWZhGCO8SxP';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    }

    setupEventListeners() {
        // Listen for calculator quote requests
        document.addEventListener('calculator:quote-request', (e) => {
            this.handleQuoteRequest(e.detail);
        });

        // Listen for calculator interactions for analytics
        document.addEventListener('calculator:calculate', (e) => {
            this.trackCalculation(e.detail);
        });
    }

    handleQuoteRequest(data) {
        // Store calculator data for lead generation
        sessionStorage.setItem('calculator_results', JSON.stringify(data));

        // Trigger lead capture modal or form
        this.triggerLeadCapture(data);
    }

    triggerLeadCapture(data) {
        // Dispatch event to lead capture system
        const event = new CustomEvent('lead-capture:start', {
            detail: {
                source: 'calculator',
                data: data,
                priority: 'high'
            }
        });

        document.dispatchEvent(event);
    }

    trackCalculation(data) {
        this.analytics.calculations++;

        // Update average bill
        const currentAvg = this.analytics.averageBill;
        const newCount = this.analytics.calculations;
        this.analytics.averageBill = (currentAvg * (newCount - 1) + data.bill) / newCount;

        // Track property type popularity
        this.trackPropertyType(data.property);

        // Send analytics event
        this.sendAnalytics('calculator_used', {
            bill_amount: data.bill,
            property_type: data.property,
            roof_facing: data.facing
        });
    }

    trackPropertyType(propertyType) {
        if (!this.propertyTypeCounts) {
            this.propertyTypeCounts = {};
        }

        this.propertyTypeCounts[propertyType] = (this.propertyTypeCounts[propertyType] || 0) + 1;

        // Update most popular
        const popular = Object.entries(this.propertyTypeCounts)
            .sort(([,a], [,b]) => b - a)[0];

        if (popular) {
            this.analytics.popularPropertyType = popular[0];
        }
    }

    sendAnalytics(eventName, data) {
        // Send to analytics system
        const event = new CustomEvent('analytics:event', {
            detail: {
                event: eventName,
                data: data,
                timestamp: Date.now()
            }
        });

        document.dispatchEvent(event);
    }

    // Public API methods
    getAnalytics() {
        return { ...this.analytics };
    }

    resetAnalytics() {
        this.analytics = {
            calculations: 0,
            averageBill: 0,
            popularPropertyType: null,
            conversionRate: 0
        };
    }

    // Calculator instance management
    registerCalculator(id, calculator) {
        this.calculators.set(id, calculator);
    }

    getCalculator(id) {
        return this.calculators.get(id);
    }

    getAllCalculators() {
        return Array.from(this.calculators.values());
    }
}

// Create global module instance
const calculatorModule = new CalculatorModule();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = calculatorModule;
}

// Make available globally
window.CalculatorModule = calculatorModule;
