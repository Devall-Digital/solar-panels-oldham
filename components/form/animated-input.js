/**
 * Component: Animated Input
 * Module: Components
 * Purpose: Form input fields with floating labels and validation animations
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class AnimatedInput {
    constructor(element) {
        this.element = element;
        this.input = element.querySelector('.animated-input');
        this.label = element.querySelector('.animated-label');
        this.line = element.querySelector('.field-line');
        this.error = element.querySelector('.field-error');
        this.initialized = false;

        // Configuration
        this.config = {
            validation: true,
            showErrors: true,
            floatLabel: true,
            animateLine: true,
            validationDelay: 300,
            errorTimeout: 5000
        };

        // State
        this.state = {
            isValid: true,
            isDirty: false,
            isFocused: false,
            hasValue: false,
            errorMessage: '',
            validationTimeout: null,
            errorTimeout: null
        };

        // Bind methods
        this.handleFocus = this.onFocus.bind(this);
        this.handleBlur = this.onBlur.bind(this);
        this.handleInput = this.onInput.bind(this);
        this.handleChange = this.onChange.bind(this);
    }

    async init() {
        try {
            console.log('Initializing Animated Input component');

            // Parse data attributes
            this.parseDataAttributes();

            // Set up event listeners
            this.setupEventListeners();

            // Initialize state
            this.updateState();

            // Set up validation if enabled
            if (this.config.validation) {
                this.setupValidation();
            }

            this.initialized = true;
            emit('component:input:initialized', { element: this.element });

        } catch (error) {
            console.error('Animated input initialization failed:', error);
            emit('component:input:error', { element: this.element, error });
        }
    }

    /**
     * Parse data attributes for configuration
     */
    parseDataAttributes() {
        // Validation settings
        const validationAttr = this.element.dataset.validation;
        if (validationAttr !== undefined) {
            this.config.validation = validationAttr !== 'false';
        }

        // Show errors
        const errorsAttr = this.element.dataset.showErrors;
        if (errorsAttr !== undefined) {
            this.config.showErrors = errorsAttr !== 'false';
        }

        // Float label
        const floatAttr = this.element.dataset.floatLabel;
        if (floatAttr !== undefined) {
            this.config.floatLabel = floatAttr !== 'false';
        }

        // Animate line
        const lineAttr = this.element.dataset.animateLine;
        if (lineAttr !== undefined) {
            this.config.animateLine = lineAttr !== 'false';
        }

        // Validation delay
        const delayAttr = this.element.dataset.validationDelay;
        if (delayAttr) {
            this.config.validationDelay = parseInt(delayAttr);
        }

        // Error timeout
        const timeoutAttr = this.element.dataset.errorTimeout;
        if (timeoutAttr) {
            this.config.errorTimeout = parseInt(timeoutAttr);
        }

        // Custom validation rules
        const rulesAttr = this.element.dataset.validationRules;
        if (rulesAttr) {
            try {
                this.config.customRules = JSON.parse(rulesAttr);
            } catch (e) {
                console.warn('Invalid validation rules JSON:', rulesAttr);
            }
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (!this.input) return;

        this.input.addEventListener('focus', this.handleFocus);
        this.input.addEventListener('blur', this.handleBlur);
        this.input.addEventListener('input', this.handleInput);
        this.input.addEventListener('change', this.handleChange);
    }

    /**
     * Set up validation
     */
    setupValidation() {
        // Built-in validation rules
        this.validationRules = {
            required: (value) => {
                return value.trim().length > 0 || 'This field is required';
            },
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) || 'Please enter a valid email address';
            },
            phone: (value) => {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanValue = value.replace(/[\s\-\(\)]/g, '');
                return phoneRegex.test(cleanValue) || 'Please enter a valid phone number';
            },
            postcode: (value) => {
                // UK postcode validation (basic)
                const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
                return postcodeRegex.test(value.toUpperCase()) || 'Please enter a valid UK postcode';
            },
            minLength: (value, min) => {
                return value.length >= min || `Minimum ${min} characters required`;
            },
            maxLength: (value, max) => {
                return value.length <= max || `Maximum ${max} characters allowed`;
            }
        };
    }

    /**
     * Update component state
     */
    updateState() {
        if (!this.input) return;

        const hasValue = this.input.value.trim().length > 0;
        const wasDirty = this.state.isDirty;

        this.state.hasValue = hasValue;
        this.state.isDirty = this.state.isDirty || hasValue;

        // Update classes
        this.updateClasses();

        // Validate if dirty and validation enabled
        if (this.state.isDirty && this.config.validation && !this.state.isFocused) {
            this.validate();
        }

        // Emit state change
        if (wasDirty !== this.state.isDirty) {
            emit('input:state:changed', {
                element: this.element,
                hasValue,
                isDirty: this.state.isDirty
            });
        }
    }

    /**
     * Update CSS classes based on state
     */
    updateClasses() {
        // Label floating
        if (this.label) {
            if (this.state.hasValue || this.state.isFocused) {
                this.label.classList.add('label-float');
            } else {
                this.label.classList.remove('label-float');
            }
        }

        // Field states
        this.element.classList.toggle('field-focused', this.state.isFocused);
        this.element.classList.toggle('field-has-value', this.state.hasValue);
        this.element.classList.toggle('field-dirty', this.state.isDirty);
        this.element.classList.toggle('field-valid', this.state.isValid);
        this.element.classList.toggle('field-invalid', !this.state.isValid);
    }

    /**
     * Validate input value
     */
    validate(force = false) {
        if (!this.input || !this.config.validation) return true;

        // Clear existing timeout
        if (this.state.validationTimeout) {
            clearTimeout(this.state.validationTimeout);
        }

        // Debounce validation
        this.state.validationTimeout = setTimeout(() => {
            const value = this.input.value.trim();
            const type = this.input.type;
            let isValid = true;
            let errorMessage = '';

            // Check HTML5 validation first
            if (this.input.checkValidity && !force) {
                isValid = this.input.checkValidity();
                if (!isValid) {
                    errorMessage = this.input.validationMessage;
                }
            }

            // Custom validation rules
            if (isValid || force) {
                // Required validation
                if (this.input.hasAttribute('required')) {
                    const result = this.validationRules.required(value);
                    if (result !== true) {
                        isValid = false;
                        errorMessage = result;
                    }
                }

                // Type-specific validation
                if (isValid && type === 'email') {
                    const result = this.validationRules.email(value);
                    if (result !== true) {
                        isValid = false;
                        errorMessage = result;
                    }
                }

                if (isValid && (type === 'tel' || this.input.name === 'phone')) {
                    const result = this.validationRules.phone(value);
                    if (result !== true) {
                        isValid = false;
                        errorMessage = result;
                    }
                }

                if (isValid && this.input.name === 'postcode') {
                    const result = this.validationRules.postcode(value);
                    if (result !== true) {
                        isValid = false;
                        errorMessage = result;
                    }
                }

                // Min/max length
                if (isValid && this.input.minLength) {
                    const result = this.validationRules.minLength(value, this.input.minLength);
                    if (result !== true) {
                        isValid = false;
                        errorMessage = result;
                    }
                }

                if (isValid && this.input.maxLength) {
                    const result = this.validationRules.maxLength(value, this.input.maxLength);
                    if (result !== true) {
                        isValid = false;
                        errorMessage = result;
                    }
                }

                // Custom rules
                if (isValid && this.config.customRules) {
                    for (const rule of this.config.customRules) {
                        if (this.validationRules[rule.type]) {
                            const result = this.validationRules[rule.type](value, rule.param);
                            if (result !== true) {
                                isValid = false;
                                errorMessage = result;
                                break;
                            }
                        }
                    }
                }
            }

            // Update state
            const wasValid = this.state.isValid;
            this.state.isValid = isValid;
            this.state.errorMessage = errorMessage;

            // Update display
            this.updateValidationDisplay();

            // Emit validation event
            emit('input:validation:complete', {
                element: this.element,
                isValid,
                errorMessage,
                changed: wasValid !== isValid
            });

        }, this.config.validationDelay);
    }

    /**
     * Update validation display
     */
    updateValidationDisplay() {
        // Update error message
        if (this.error) {
            if (!this.state.isValid && this.config.showErrors && this.state.errorMessage) {
                this.error.textContent = this.state.errorMessage;
                this.error.style.display = 'block';

                // Auto-hide error after timeout
                if (this.config.errorTimeout > 0) {
                    if (this.state.errorTimeout) {
                        clearTimeout(this.state.errorTimeout);
                    }
                    this.state.errorTimeout = setTimeout(() => {
                        this.error.style.display = 'none';
                    }, this.config.errorTimeout);
                }
            } else {
                this.error.style.display = 'none';
            }
        }

        // Update classes
        this.updateClasses();
    }

    /**
     * Focus event handler
     */
    onFocus(event) {
        this.state.isFocused = true;
        this.updateClasses();

        emit('input:focus', { element: this.element });
    }

    /**
     * Blur event handler
     */
    onBlur(event) {
        this.state.isFocused = false;
        this.updateClasses();

        // Validate on blur
        if (this.config.validation) {
            this.validate();
        }

        emit('input:blur', { element: this.element });
    }

    /**
     * Input event handler
     */
    onInput(event) {
        this.updateState();

        emit('input:input', {
            element: this.element,
            value: this.input.value
        });
    }

    /**
     * Change event handler
     */
    onChange(event) {
        emit('input:change', {
            element: this.element,
            value: this.input.value
        });
    }

    /**
     * Set field value programmatically
     */
    setValue(value) {
        if (this.input) {
            this.input.value = value;
            this.updateState();
        }
    }

    /**
     * Get field value
     */
    getValue() {
        return this.input ? this.input.value : '';
    }

    /**
     * Set error message
     */
    setError(message) {
        this.state.isValid = false;
        this.state.errorMessage = message;
        this.updateValidationDisplay();

        emit('input:error:set', {
            element: this.element,
            message
        });
    }

    /**
     * Clear error
     */
    clearError() {
        this.state.isValid = true;
        this.state.errorMessage = '';
        this.updateValidationDisplay();

        emit('input:error:cleared', { element: this.element });
    }

    /**
     * Check if field is valid
     */
    isValid() {
        return this.state.isValid;
    }

    /**
     * Focus the input
     */
    focus() {
        if (this.input) {
            this.input.focus();
        }
    }

    /**
     * Blur the input
     */
    blur() {
        if (this.input) {
            this.input.blur();
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Reset field to initial state
     */
    reset() {
        if (this.input) {
            this.input.value = '';
        }

        this.state.isValid = true;
        this.state.isDirty = false;
        this.state.hasValue = false;
        this.state.errorMessage = '';

        this.updateClasses();
        this.updateValidationDisplay();

        emit('input:reset', { element: this.element });
    }

    /**
     * Destroy component
     */
    destroy() {
        // Clear timeouts
        if (this.state.validationTimeout) {
            clearTimeout(this.state.validationTimeout);
        }
        if (this.state.errorTimeout) {
            clearTimeout(this.state.errorTimeout);
        }

        // Remove event listeners
        if (this.input) {
            this.input.removeEventListener('focus', this.handleFocus);
            this.input.removeEventListener('blur', this.handleBlur);
            this.input.removeEventListener('input', this.handleInput);
            this.input.removeEventListener('change', this.handleChange);
        }

        // Reset classes
        this.element.classList.remove(
            'field-focused',
            'field-has-value',
            'field-dirty',
            'field-valid',
            'field-invalid'
        );

        if (this.label) {
            this.label.classList.remove('label-float');
        }

        this.initialized = false;
        emit('component:input:destroyed', { element: this.element });
    }
}
