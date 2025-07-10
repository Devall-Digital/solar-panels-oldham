// Solar Panels Oldham - Forms JavaScript
// Form validation, submission, and UX

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FORM VALIDATION =====
    
    // Validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid first name (letters only, minimum 2 characters)'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid last name (letters only, minimum 2 characters)'
        },
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters only, minimum 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
            message: 'Please enter a valid phone number (10-15 digits)'
        },
        address: {
            required: true,
            minLength: 10,
            message: 'Please enter a complete address including postcode'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Please enter a message (minimum 10 characters)'
        }
    };
    
    // Validate single field
    function validateField(field, rules) {
        const value = field.value.trim();
        const fieldName = field.name;
        const rule = rules[fieldName];
        
        if (!rule) return true;
        
        // Required validation
        if (rule.required && !value) {
            return { valid: false, message: `${getFieldLabel(field)} is required` };
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rule.required) {
            return { valid: true };
        }
        
        // Minimum length validation
        if (rule.minLength && value.length < rule.minLength) {
            return { valid: false, message: rule.message || `Minimum ${rule.minLength} characters required` };
        }
        
        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
            return { valid: false, message: rule.message || 'Invalid format' };
        }
        
        return { valid: true };
    }
    
    // Get field label for error messages
    function getFieldLabel(field) {
        const label = field.closest('.form-group').querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    // Show field error
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        
        // Add shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
    
    // Clear field error
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // ===== REAL-TIME VALIDATION =====
    
    // Add real-time validation to all form fields
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', function() {
            const result = validateField(this, validationRules);
            if (!result.valid) {
                showFieldError(this, result.message);
            } else {
                clearFieldError(this);
            }
        });
        
        // Clear errors on input
        field.addEventListener('input', function() {
            if (this.closest('.form-group').classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
    
    // ===== FORM SUBMISSION =====
    
    // Handle quote form submission
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'quote');
        });
    }
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contact');
        });
    }
    
    // Main form submission handler
    function handleFormSubmission(form, formType) {
        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        let isValid = true;
        
        // Validate all fields
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        fields.forEach(field => {
            const result = validateField(field, validationRules);
            if (!result.valid) {
                showFieldError(field, result.message);
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // For static HTML, redirect to thank you page
        setTimeout(() => {
            // Store form data in sessionStorage for potential use
            const submissionData = Object.fromEntries(formData.entries());
            submissionData.formType = formType;
            submissionData.timestamp = new Date().toISOString();
            
            // Store in sessionStorage
            sessionStorage.setItem('formSubmission', JSON.stringify(submissionData));
            
            // Redirect to thank you page
            window.location.href = '/thank-you.html';
        }, 1000);
        
        // Track form submission
        trackFormSubmission(formType, submissionData);
        
        // Submit form
        submitForm(submissionData, form, submitButton);
    }
    
    // Submit form to server
    async function submitForm(data, form, submitButton) {
        try {
            const response = await fetch('/php/contact-form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage(form, result.message || 'Thank you! We\'ll be in touch soon.');
                form.reset();
                
                // Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit_success', {
                        'form_type': data.formType,
                        'event_category': 'lead_generation'
                    });
                }
                
                // Redirect to thank you page after delay
                setTimeout(() => {
                    if (data.formType === 'quote') {
                        window.location.href = '/thank-you-quote.html';
                    } else {
                        window.location.href = '/thank-you-contact.html';
                    }
                }, 2000);
                
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage(form, 'Sorry, there was an error submitting your form. Please try again or call us directly.');
            
            // Track failed submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_error', {
                    'form_type': data.formType,
                    'error_message': error.message,
                    'event_category': 'errors'
                });
            }
            
        } finally {
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
    
    // Show success message
    function showSuccessMessage(form, message) {
        // Remove existing messages
        removeFormMessages(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <strong>✓ Success!</strong><br>
            ${message}
        `;
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Smooth scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show error message
    function showErrorMessage(form, message) {
        // Remove existing messages
        removeFormMessages(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #EF4444;
            color: #EF4444;
            padding: var(--spacing-lg);
            border-radius: var(--border-radius);
            margin-bottom: var(--spacing-lg);
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <strong>⚠ Error</strong><br>
            ${message}
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Smooth scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Remove form messages
    function removeFormMessages(form) {
        const existingMessages = form.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());
    }
    
    // ===== FORM ENHANCEMENT =====
    
    // Auto-format phone numbers
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Remove non-digits
            
            // UK phone number formatting
            if (value.startsWith('44')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                // UK landline/mobile
                if (value.length > 11) value = value.substring(0, 11);
                value = value.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
            }
            
            this.value = value;
        });
    });
    
    // Auto-capitalize names
    const nameFields = document.querySelectorAll('input[name="firstName"], input[name="lastName"], input[name="name"]');
    nameFields.forEach(field => {
        field.addEventListener('input', function() {
            this.value = this.value.replace(/\b\w/g, char => char.toUpperCase());
        });
    });
    
    // Postcode validation and formatting (UK)
    const addressFields = document.querySelectorAll('input[name="address"]');
    addressFields.forEach(field => {
        field.addEventListener('blur', function() {
            const value = this.value.trim();
            const postcodePattern = /\b[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][ABD-HJLNP-UW-Z]{2}\b/i;
            
            if (value && !postcodePattern.test(value)) {
                showFieldError(this, 'Please include a valid UK postcode');
            }
        });
    });
    
    // ===== FORM TRACKING =====
    
    // Track form interactions
    function trackFormSubmission(formType, data) {
        console.log('Form submission tracked:', formType, data);
        
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit_attempt', {
                'form_type': formType,
                'event_category': 'lead_generation',
                'event_label': formType + '_form'
            });
        }
        
        // Custom tracking
        if (window.customTracking) {
            window.customTracking.trackLead(formType, data);
        }
    }
    
    // Track form field interactions
    formFields.forEach(field => {
        let hasInteracted = false;
        
        field.addEventListener('focus', function() {
            if (!hasInteracted) {
                hasInteracted = true;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_field_interaction', {
                        'field_name': this.name,
                        'event_category': 'form_engagement'
                    });
                }
            }
        });
    });
    
    // ===== ACCESSIBILITY =====
    
    // Announce form errors to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // ===== INITIALIZATION =====
    
    console.log('Solar Panels Oldham - Forms JavaScript loaded successfully');
});

// ===== CSS FOR ANIMATIONS =====

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #EF4444 !important;
        background: rgba(239, 68, 68, 0.1) !important;
    }
    
    .error-message {
        color: #EF4444;
        font-size: 0.75rem;
        margin-top: 0.5rem;
        animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .form-success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid #10B981;
        color: #10B981;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
        animation: slideDown 0.5s ease-out;
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(style);