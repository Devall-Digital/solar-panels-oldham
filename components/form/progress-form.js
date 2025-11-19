/**
 * Component: Progress Form
 * Module: Components
 * Purpose: Multi-step form with progress indication and celebrations
 * Dependencies: /core/events.js, /core/state.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { emit, on } from '/core/events.js';
import { setState, getState } from '/core/state.js';

export default class ProgressForm {
    constructor(element) {
        this.element = element;
        this.formId = element.id;
        this.initialized = false;
        
        // Elements
        this.progressBar = null;
        this.progressFill = null;
        this.screens = [];
        this.currentScreen = 1;
        this.totalScreens = 0;
        
        // Form data
        this.formData = {};
        this.isSubmitting = false;
        
        // Validation rules
        this.validators = {
            required: (value) => value && value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
            postcode: (value) => /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(value)
        };
    }
    
    async init() {
        try {
            // Get elements
            this.progressBar = this.element.querySelector('.progress-bar');
            this.progressFill = this.element.querySelector('.progress-fill');
            this.screens = Array.from(this.element.querySelectorAll('.form-screen'));
            this.totalScreens = this.screens.length;
            
            // Initialize form
            this.setupEventListeners();
            this.updateProgress();
            this.loadSavedData();
            
            // Focus first input
            this.focusFirstInput();
            
            this.initialized = true;
            emit('component:progress-form:initialized', { formId: this.formId });
            
        } catch (error) {
            console.error('Progress form initialization failed:', error);
            emit('component:progress-form:error', { formId: this.formId, error });
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        this.element.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const nextScreen = parseInt(btn.dataset.next);
                this.navigateToScreen(nextScreen);
            });
        });
        
        this.element.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prevScreen = parseInt(btn.dataset.prev);
                this.navigateToScreen(prevScreen);
            });
        });
        
        // Form submission
        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Input changes
        this.element.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('change', () => this.saveFormData());
            
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            
            // Clear error on input
            input.addEventListener('input', () => {
                const fieldGroup = input.closest('.form-field');
                if (fieldGroup) {
                    fieldGroup.classList.remove('has-error');
                }
            });
        });
        
        // Keyboard navigation
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                const currentBtn = this.screens[this.currentScreen - 1].querySelector('.btn-next');
                if (currentBtn) {
                    e.preventDefault();
                    currentBtn.click();
                }
            }
        });
    }
    
    /**
     * Navigate to screen
     */
    navigateToScreen(screenNumber) {
        // Validate current screen before moving forward
        if (screenNumber > this.currentScreen && !this.validateCurrentScreen()) {
            this.shakeScreen();
            return;
        }
        
        // Hide current screen
        this.screens[this.currentScreen - 1].classList.remove('active');
        this.screens[this.currentScreen - 1].classList.add('exit');
        
        // Show new screen
        setTimeout(() => {
            this.screens[this.currentScreen - 1].classList.remove('exit');
            this.currentScreen = screenNumber;
            this.screens[this.currentScreen - 1].classList.add('active', 'enter');
            
            // Update progress
            this.updateProgress();
            
            // Update step indicators
            this.updateStepIndicators();
            
            // Focus first input
            this.focusFirstInput();
            
            // Save progress
            this.saveProgress();
            
            // Emit navigation event
            emit('form:navigate', {
                formId: this.formId,
                screen: this.currentScreen,
                direction: screenNumber > this.currentScreen ? 'forward' : 'back'
            });
            
            setTimeout(() => {
                this.screens[this.currentScreen - 1].classList.remove('enter');
            }, 300);
            
        }, 300);
    }
    
    /**
     * Update progress bar
     */
    updateProgress() {
        const progress = ((this.currentScreen - 1) / (this.totalScreens - 1)) * 100;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
            this.progressFill.setAttribute('data-progress', progress);
        }
        
        // Celebrate milestones
        if (progress === 100) {
            this.celebrateProgress();
        }
    }
    
    /**
     * Update step indicators
     */
    updateStepIndicators() {
        this.element.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            
            if (stepNumber < this.currentScreen) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === this.currentScreen) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    /**
     * Validate current screen
     */
    validateCurrentScreen() {
        const currentScreenElement = this.screens[this.currentScreen - 1];
        const inputs = currentScreenElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate field
     */
    validateField(field) {
        const fieldGroup = field.closest('.form-field');
        if (!fieldGroup) return true;
        
        const value = field.value;
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Check if required
        if (required && !this.validators.required(value)) {
            this.showFieldError(fieldGroup, 'This field is required');
            return false;
        }
        
        // Type-specific validation
        if (value) {
            if (type === 'email' && !this.validators.email(value)) {
                this.showFieldError(fieldGroup, 'Please enter a valid email address');
                return false;
            }
            
            if (type === 'tel' && !this.validators.phone(value)) {
                this.showFieldError(fieldGroup, 'Please enter a valid phone number');
                return false;
            }
            
            if (field.name === 'postcode' && !this.validators.postcode(value)) {
                this.showFieldError(fieldGroup, 'Please enter a valid UK postcode');
                return false;
            }
        }
        
        // Clear error
        this.clearFieldError(fieldGroup);
        return true;
    }
    
    /**
     * Show field error
     */
    showFieldError(fieldGroup, message) {
        fieldGroup.classList.add('has-error');
        const errorElement = fieldGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    /**
     * Clear field error
     */
    clearFieldError(fieldGroup) {
        fieldGroup.classList.remove('has-error');
        const errorElement = fieldGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    /**
     * Shake screen for validation feedback
     */
    shakeScreen() {
        const currentScreenElement = this.screens[this.currentScreen - 1];
        currentScreenElement.classList.add('shake');
        
        setTimeout(() => {
            currentScreenElement.classList.remove('shake');
        }, 500);
    }
    
    /**
     * Focus first input in current screen
     */
    focusFirstInput() {
        setTimeout(() => {
            const firstInput = this.screens[this.currentScreen - 1].querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 350);
    }
    
    /**
     * Save form data
     */
    saveFormData() {
        const formData = new FormData(this.element);
        this.formData = Object.fromEntries(formData.entries());
        
        // Save to localStorage
        localStorage.setItem(`form_${this.formId}_data`, JSON.stringify(this.formData));
    }
    
    /**
     * Load saved data
     */
    loadSavedData() {
        const saved = localStorage.getItem(`form_${this.formId}_data`);
        if (saved) {
            this.formData = JSON.parse(saved);
            
            // Populate form
            Object.entries(this.formData).forEach(([name, value]) => {
                const field = this.element.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;
                }
            });
        }
    }
    
    /**
     * Save progress
     */
    saveProgress() {
        localStorage.setItem(`form_${this.formId}_progress`, this.currentScreen.toString());
    }
    
    /**
     * Load progress
     */
    loadProgress() {
        const saved = localStorage.getItem(`form_${this.formId}_progress`);
        if (saved) {
            const savedScreen = parseInt(saved);
            if (savedScreen > 1 && savedScreen <= this.totalScreens) {
                this.navigateToScreen(savedScreen);
            }
        }
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        // Validate all screens
        let isValid = true;
        for (let i = 0; i < this.totalScreens; i++) {
            const inputs = this.screens[i].querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
        }
        
        if (!isValid) {
            emit('form:validation:failed', { formId: this.formId });
            return;
        }
        
        this.isSubmitting = true;
        
        // Show loading state
        const submitBtn = this.element.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        try {
            // Collect all form data
            this.saveFormData();
            
            // Add metadata
            const submissionData = {
                ...this.formData,
                formId: this.formId,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            // Submit form
            const response = await fetch('/api/leads.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });
            
            if (!response.ok) {
                throw new Error('Submission failed');
            }
            
            // Success!
            this.showSuccess();
            
            // Clear saved data
            localStorage.removeItem(`form_${this.formId}_data`);
            localStorage.removeItem(`form_${this.formId}_progress`);
            
            // Emit success event
            emit('form:submit:success', { formId: this.formId, data: submissionData });
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error
            emit('toast:show', {
                type: 'error',
                title: 'Submission Failed',
                message: 'Please try again or call us directly.'
            });
            
            emit('form:submit:error', { formId: this.formId, error });
            
        } finally {
            this.isSubmitting = false;
            
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }
    
    /**
     * Show success state
     */
    showSuccess() {
        // Hide form screens
        this.element.querySelector('.form-screens').style.display = 'none';
        
        // Show success message
        const successElement = this.element.querySelector('.form-success');
        if (successElement) {
            successElement.style.display = 'block';
            successElement.classList.add('animate-scaleInBounce');
            
            // Animate checkmark
            const checkmark = successElement.querySelector('.checkmark');
            if (checkmark) {
                setTimeout(() => {
                    checkmark.classList.add('draw');
                }, 500);
            }
        }
        
        // Confetti celebration
        this.createConfetti();
    }
    
    /**
     * Celebrate progress
     */
    celebrateProgress() {
        // Add celebration class
        this.progressBar.classList.add('celebrate');
        
        // Remove after animation
        setTimeout(() => {
            this.progressBar.classList.remove('celebrate');
        }, 1000);
    }
    
    /**
     * Create confetti effect
     */
    createConfetti() {
        const colors = ['#FFD700', '#FFED4A', '#F59E0B', '#10B981'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = Math.random() * 1 + 1 + 's';
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }
    
    /**
     * Destroy component
     */
    destroy() {
        // Clear saved data on destroy if needed
        if (this.element.dataset.clearOnDestroy === 'true') {
            localStorage.removeItem(`form_${this.formId}_data`);
            localStorage.removeItem(`form_${this.formId}_progress`);
        }
        
        this.initialized = false;
        emit('component:progress-form:destroyed', { formId: this.formId });
    }
}
