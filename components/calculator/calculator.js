/**
 * Component: Solar Calculator
 * Purpose: Interactive solar savings calculator with real-time calculations
 * Dependencies: Chart.js for visualization
 * Author: Solar Calculator Agent
 * Date: 2025-11-21
 */

class SolarCalculator {
    constructor(element) {
        this.element = element;
        this.chart = null;
        this.currentData = {
            bill: 250, // Default monthly bill
            property: 'semi',
            facing: 'south'
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.calculate();
        this.initializeChart();
    }

    bindEvents() {
        // Range input for monthly bill
        const billInput = this.element.querySelector('[data-input="bill"]');
        const billValue = this.element.querySelector('[data-value="bill"]');

        billInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (this.validateBill(value)) {
                this.currentData.bill = value;
                billValue.textContent = this.currentData.bill;
                this.clearError('bill');
                this.calculate();
            } else {
                this.showError('bill', 'Please enter a bill between £50 and £1000');
            }
        });

        // Property type select
        const propertySelect = this.element.querySelector('[data-input="property"]');
        propertySelect.addEventListener('change', (e) => {
            this.currentData.property = e.target.value;
            this.clearError('property');
            this.calculate();
        });

        // Roof facing toggles
        const facingButtons = this.element.querySelectorAll('[data-input="facing"]');
        facingButtons.forEach(button => {
            button.addEventListener('click', () => {
                facingButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentData.facing = button.dataset.value;
                this.clearError('facing');
                this.calculate();
            });
        });

        // CTA button
        const ctaButton = this.element.querySelector('[data-action="get-quote"]');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateAllInputs()) {
                    this.handleQuoteRequest();
                } else {
                    this.showError('general', 'Please complete all calculator inputs');
                }
            });
        }

        // Add input validation on blur for accessibility
        billInput.addEventListener('blur', (e) => {
            const value = parseInt(e.target.value);
            if (!this.validateBill(value)) {
                this.showError('bill', 'Monthly bill must be between £50 and £1000');
            }
        });
    }

    async calculate() {
        try {
            // Clear any previous general errors
            this.clearError('general');

            // Show loading state
            this.setLoading(true);

            const response = await fetch('/api/calculator.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.currentData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                this.updateResults(data.data);
                this.updateChart(data.data);
            } else {
                throw new Error(data.error || 'Calculation failed');
            }

        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('general', error.message || 'Unable to calculate savings. Please try again.');
        } finally {
            // Always hide loading state
            this.setLoading(false);
        }
    }

    updateResults(results) {
        // Update result values with animation
        this.animateValue('[data-result="annual"]', results.annualSavings);
        this.animateValue('[data-result="roi"]', results.roi);
        this.animateValue('[data-result="payback"]', results.paybackYears);
    }

    animateValue(selector, targetValue) {
        const element = this.element.querySelector(selector);
        if (!element) return;

        const startValue = parseFloat(element.textContent) || 0;
        const duration = 1000; // 1 second
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;

            if (selector.includes('roi')) {
                element.textContent = Math.round(currentValue);
            } else if (selector.includes('payback')) {
                element.textContent = Math.round(currentValue * 10) / 10;
            } else {
                element.textContent = Math.round(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initializeChart() {
        const canvas = this.element.querySelector('#savings-chart');
        if (!canvas) return;

        // Initialize Chart.js if available
        if (typeof Chart !== 'undefined') {
            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Annual Savings (£)',
                        data: [],
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 215, 0, 0.1)'
                            },
                            ticks: {
                                color: '#F8FAFC'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 215, 0, 0.1)'
                            },
                            ticks: {
                                color: '#F8FAFC',
                                callback: function(value) {
                                    return '£' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    elements: {
                        point: {
                            radius: 6,
                            hoverRadius: 8,
                            backgroundColor: '#FFD700',
                            borderColor: '#0F172A',
                            borderWidth: 2
                        }
                    }
                }
            });
        }
    }

    updateChart(results) {
        if (!this.chart) return;

        // Generate 25-year projection
        const labels = [];
        const savings = [];

        for (let year = 1; year <= 25; year++) {
            labels.push(`Year ${year}`);
            savings.push(results.annualSavings * year);
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = savings;
        this.chart.update('active');
    }

    handleQuoteRequest() {
        // Trigger lead capture flow
        const event = new CustomEvent('calculator:quote-request', {
            detail: {
                calculatorData: this.currentData,
                results: this.getCurrentResults()
            }
        });

        document.dispatchEvent(event);
    }

    getCurrentResults() {
        return {
            annualSavings: parseInt(this.element.querySelector('[data-result="annual"]').textContent) || 0,
            roi: parseInt(this.element.querySelector('[data-result="roi"]').textContent) || 0,
            paybackYears: parseFloat(this.element.querySelector('[data-result="payback"]').textContent) || 0
        };
    }

    // Validation methods
    validateBill(value) {
        return value >= 50 && value <= 1000 && !isNaN(value);
    }

    validateAllInputs() {
        const billValid = this.validateBill(this.currentData.bill);
        const propertyValid = ['terraced', 'semi', 'detached', 'bungalow'].includes(this.currentData.property);
        const facingValid = ['south', 'east-west', 'east', 'west', 'north'].includes(this.currentData.facing);

        return billValid && propertyValid && facingValid;
    }

    // Error handling methods
    showError(field, message) {
        this.clearError(field);

        let errorElement;
        let targetElement;

        if (field === 'general') {
            // Create general error message
            errorElement = document.createElement('div');
            errorElement.className = 'calculator-error calculator-error-general';
            errorElement.textContent = message;

            // Insert at top of calculator
            const firstElement = this.element.querySelector('.calc-inputs');
            if (firstElement) {
                firstElement.parentNode.insertBefore(errorElement, firstElement);
            }
        } else {
            // Field-specific error
            errorElement = document.createElement('div');
            errorElement.className = `calculator-error calculator-error-${field}`;
            errorElement.textContent = message;

            // Find the input group and append error
            targetElement = this.element.querySelector(`[data-input="${field}"]`);
            if (targetElement) {
                const inputGroup = targetElement.closest('.input-group');
                if (inputGroup) {
                    inputGroup.appendChild(errorElement);
                    targetElement.classList.add('error');
                }
            }
        }
    }

    clearError(field) {
        if (field === 'general') {
            const generalErrors = this.element.querySelectorAll('.calculator-error-general');
            generalErrors.forEach(error => error.remove());
        } else {
            // Clear field-specific errors
            const fieldErrors = this.element.querySelectorAll(`.calculator-error-${field}`);
            fieldErrors.forEach(error => error.remove());

            // Remove error class from input
            const inputElement = this.element.querySelector(`[data-input="${field}"]`);
            if (inputElement) {
                inputElement.classList.remove('error');
            }
        }
    }

    setLoading(isLoading) {
        const calculator = this.element;
        const resultsSection = calculator.querySelector('.calc-results');

        if (isLoading) {
            calculator.classList.add('calculator-loading');
            resultsSection.classList.add('loading');
        } else {
            calculator.classList.remove('calculator-loading');
            resultsSection.classList.remove('loading');
        }
    }

    showError() {
        // Legacy method - show general error
        this.showError('general', 'Unable to calculate savings. Please check your inputs and try again.');
    }
}

// Auto-initialize component
document.addEventListener('DOMContentLoaded', () => {
    const calculators = document.querySelectorAll('[data-component="calculator"]');
    calculators.forEach(calc => new SolarCalculator(calc));
});
