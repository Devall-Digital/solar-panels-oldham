# Animated Input Component

## Overview
The Animated Input component creates engaging form fields with floating labels, smooth animations, and built-in validation. Perfect for creating modern, interactive forms with excellent user experience.

## Features
- **Floating Labels**: Labels that animate up when field is focused or has content
- **Real-time Validation**: Built-in validation with custom error messages
- **Smooth Animations**: GPU-accelerated transitions and state changes
- **Multiple Input Types**: Support for text, email, tel, url, and more
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Mobile-optimized with touch-friendly interactions
- **Custom Validation**: Extensible validation rules system

## Usage

### Basic Implementation
```html
<div class="form-field" data-component="form-field">
    <input type="text"
           class="animated-input"
           id="name"
           name="name"
           required>
    <label for="name" class="animated-label">Full Name</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

### Required Files
```html
<!-- CSS -->
<link rel="stylesheet" href="/components/form/animated-input.css">

<!-- JavaScript (automatically loaded by component system) -->
```

## Configuration Options

### Data Attributes
```html
<div class="form-field"
     data-component="form-field"
     data-validation="true"
     data-show-errors="true"
     data-float-label="true"
     data-animate-line="true"
     data-validation-delay="300"
     data-error-timeout="5000">
    <input type="email"
           class="animated-input"
           id="email"
           name="email"
           required>
    <label for="email" class="animated-label">Email Address</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

### Custom Validation Rules
```html
<div class="form-field"
     data-component="form-field"
     data-validation-rules='[{"type": "minLength", "param": 3}]'>
    <input type="text"
           class="animated-input"
           id="username"
           name="username"
           required>
    <label for="username" class="animated-label">Username</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

## JavaScript Control
```javascript
// Get component instance
const fieldElement = document.querySelector('[data-component="form-field"]');
const fieldInstance = getComponentInstance(fieldElement);

// Set value programmatically
fieldInstance.setValue('John Doe');

// Get current value
const value = fieldInstance.getValue();

// Set custom error
fieldInstance.setError('Custom error message');

// Clear error
fieldInstance.clearError();

// Check validity
if (fieldInstance.isValid()) {
    // Field is valid
}

// Focus the field
fieldInstance.focus();

// Reset field
fieldInstance.reset();
```

## Field Types

### Text Input
```html
<div class="form-field" data-component="form-field">
    <input type="text" class="animated-input" id="name" name="name" required>
    <label for="name" class="animated-label">Full Name</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

### Email Input
```html
<div class="form-field" data-component="form-field">
    <input type="email" class="animated-input" id="email" name="email" required>
    <label for="email" class="animated-label">Email Address</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

### Phone Input
```html
<div class="form-field" data-component="form-field">
    <input type="tel" class="animated-input" id="phone" name="phone" required>
    <label for="phone" class="animated-label">Phone Number</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

### Postcode Input
```html
<div class="form-field" data-component="form-field">
    <input type="text" class="animated-input" id="postcode" name="postcode" required>
    <label for="postcode" class="animated-label">Postcode</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

### Textarea
```html
<div class="form-field" data-component="form-field">
    <textarea class="animated-input" id="message" name="message" required></textarea>
    <label for="message" class="animated-label">Message</label>
    <span class="field-line"></span>
    <span class="field-error"></span>
</div>
```

## Validation Rules

### Built-in Rules
- `required` - Field must not be empty
- `email` - Must be valid email format
- `phone` - Must be valid phone number (basic validation)
- `postcode` - Must be valid UK postcode format
- `minLength` - Minimum character count
- `maxLength` - Maximum character count

### Custom Rules
```javascript
// Add custom validation rule
fieldInstance.validationRules.customRule = (value) => {
    return value.includes('test') || 'Must contain "test"';
};
```

## Events

### Emitted Events
- `component:input:initialized` - Component ready
- `component:input:destroyed` - Component destroyed
- `input:focus` - Field receives focus
- `input:blur` - Field loses focus
- `input:input` - Input value changes (real-time)
- `input:change` - Input value changes (on blur/change)
- `input:state:changed` - Field state changes
- `input:validation:complete` - Validation completes
- `input:error:set` - Error message set
- `input:error:cleared` - Error message cleared
- `input:reset` - Field reset to initial state
- `component:input:error` - Initialization error

### Listening for Events
```javascript
import { on } from '/core/events.js';

// Listen for validation
on('input:validation:complete', (data) => {
    const { element, isValid, errorMessage } = data;
    if (!isValid) {
        console.log('Validation failed:', errorMessage);
    }
});

// Listen for value changes
on('input:input', (data) => {
    const { element, value } = data;
    console.log('Value changed to:', value);
});
```

## Size Variants
```html
<!-- Small field -->
<div class="form-field field-small" data-component="form-field">

<!-- Default size -->
<div class="form-field" data-component="form-field">

<!-- Large field -->
<div class="form-field field-large" data-component="form-field">
```

## Accessibility
- **ARIA Labels**: Proper labeling and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Semantic markup and error announcements
- **Focus Management**: Clear focus indicators and management
- **Error Announcements**: Validation errors announced to screen readers
- **High Contrast**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Performance
- **Debounced Validation**: Validation doesn't run on every keystroke
- **Efficient Updates**: Only updates DOM when necessary
- **Memory Management**: Proper cleanup on component destruction
- **GPU Acceleration**: Uses `transform` for smooth animations

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers with modern input support

## Configuration Reference

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-validation` | `true` | Enable built-in validation |
| `data-show-errors` | `true` | Display validation error messages |
| `data-float-label` | `true` | Enable floating label animation |
| `data-animate-line` | `true` | Enable bottom line animation |
| `data-validation-delay` | `300` | Delay before validation runs (ms) |
| `data-error-timeout` | `5000` | Auto-hide error after timeout (ms) |

## Troubleshooting

### Labels Not Floating
- Ensure label has correct `for` attribute matching input `id`
- Check that `data-float-label="true"` (default)
- Verify CSS is loaded and no conflicts

### Validation Not Working
- Confirm `data-validation="true"` (default)
- Check input has proper `type` attribute for email/tel
- Verify field has `required` attribute if needed
- Check browser console for JavaScript errors

### Animations Jerky
- Ensure CSS `will-change` properties are set
- Check for `prefers-reduced-motion` setting
- Verify no CSS conflicts overriding transitions

### Focus Issues
- Ensure input has unique `id` and label has matching `for`
- Check for z-index conflicts
- Verify no other elements capturing focus

## Examples

### Complete Contact Form
```html
<form id="contact-form">
    <div class="form-field" data-component="form-field">
        <input type="text" class="animated-input" id="name" name="name" required>
        <label for="name" class="animated-label">Full Name</label>
        <span class="field-line"></span>
        <span class="field-error"></span>
    </div>

    <div class="form-field" data-component="form-field">
        <input type="email" class="animated-input" id="email" name="email" required>
        <label for="email" class="animated-label">Email Address</label>
        <span class="field-line"></span>
        <span class="field-error"></span>
    </div>

    <div class="form-field" data-component="form-field">
        <input type="tel" class="animated-input" id="phone" name="phone" required>
        <label for="phone" class="animated-label">Phone Number</label>
        <span class="field-line"></span>
        <span class="field-error"></span>
    </div>

    <div class="form-field" data-component="form-field">
        <textarea class="animated-input" id="message" name="message" required></textarea>
        <label for="message" class="animated-label">Message</label>
        <span class="field-line"></span>
        <span class="field-error"></span>
    </div>
</form>
```

## Dependencies
- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens

## Version History
- **v1.0.0** - Initial implementation with floating labels, validation, and accessibility features
