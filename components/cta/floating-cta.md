# Floating CTA Component

## Overview
The Floating CTA (Call-to-Action) component creates an eye-catching, interactive button that draws user attention with pulsing animations, magnetic hover effects, and ripple click feedback. Perfect for important actions and conversions.

## Features
- **Pulsing Animation**: Regular pulse to draw attention
- **Magnetic Hover Effect**: Button moves toward cursor when nearby
- **Ripple Click Effect**: Satisfying ripple animation on click
- **Multiple Positions**: Flexible positioning options
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Customizable**: Extensive configuration options

## Usage

### Basic Implementation
```html
<button class="floating-cta" data-component="floating-cta" data-action="get-quote">
    <span class="cta-bg"></span>
    <span class="cta-text">Get Free Quote</span>
    <span class="cta-icon">→</span>
    <div class="ripple-container"></div>
</button>
```

### Required Files
```html
<!-- CSS -->
<link rel="stylesheet" href="/components/cta/floating-cta.css">

<!-- JavaScript (automatically loaded by component system) -->
```

## Configuration Options

### Data Attributes
```html
<button class="floating-cta"
        data-component="floating-cta"
        data-action="contact-us"
        data-pulse-interval="4000"
        data-ripple-duration="800"
        data-hover-scale="1.1"
        data-glow-intensity="0.8"
        data-magnetic-effect="true"
        data-magnetic-range="120">
    <span class="cta-bg"></span>
    <span class="cta-text">Contact Us</span>
    <span class="cta-icon">📞</span>
    <div class="ripple-container"></div>
</button>
```

### JavaScript Control
```javascript
// Get component instance
const ctaElement = document.querySelector('[data-component="floating-cta"]');
const ctaInstance = getComponentInstance(ctaElement);

// Update text
ctaInstance.setText('Call Now!');

// Update icon
ctaInstance.setIcon('📞');

// Update action
ctaInstance.setAction('phone-call');

// Show/hide
ctaInstance.show();
ctaInstance.hide();

// Update configuration
ctaInstance.updateConfig({
    pulseInterval: 5000,
    magneticEffect: false
});
```

## Events

### Emitted Events
- `component:cta:initialized` - Component ready
- `component:cta:destroyed` - Component destroyed
- `cta:hover:enter` - Mouse enters button area
- `cta:hover:leave` - Mouse leaves button area
- `cta:click` - Button clicked
- `component:cta:error` - Initialization error

### Listening for Events
```javascript
import { on } from '/core/events.js';

// Listen for CTA clicks
on('cta:click', (data) => {
    const { element, action } = data;

    switch (action) {
        case 'get-quote':
            // Handle quote request
            break;
        case 'contact-us':
            // Handle contact
            break;
        case 'phone-call':
            // Handle phone call
            break;
    }
});

// Listen for hover events
on('cta:hover:enter', (data) => {
    console.log('CTA hovered');
});
```

## Size Variants
```html
<!-- Small CTA -->
<button class="floating-cta cta-small" data-component="floating-cta">

<!-- Default size -->
<button class="floating-cta" data-component="floating-cta">

<!-- Large CTA -->
<button class="floating-cta cta-large" data-component="floating-cta">
```

## Position Variants
```html
<!-- Bottom right (default) -->
<button class="floating-cta cta-bottom-right" data-component="floating-cta">

<!-- Bottom left -->
<button class="floating-cta cta-bottom-left" data-component="floating-cta">

<!-- Top right -->
<button class="floating-cta cta-top-right" data-component="floating-cta">

<!-- Top left -->
<button class="floating-cta cta-top-left" data-component="floating-cta">

<!-- Center of screen -->
<button class="floating-cta cta-center" data-component="floating-cta">
```

## Color Variants
```html
<!-- Primary (default) -->
<button class="floating-cta" data-component="floating-cta">

<!-- Secondary -->
<button class="floating-cta cta-secondary" data-component="floating-cta">

<!-- Accent -->
<button class="floating-cta cta-accent" data-component="floating-cta">

<!-- Dark -->
<button class="floating-cta cta-dark" data-component="floating-cta">
```

## State Variants
```html
<!-- Success state (green with bounce) -->
<button class="floating-cta cta-success" data-component="floating-cta">

<!-- Loading state (with spinner) -->
<button class="floating-cta cta-loading" data-component="floating-cta">
```

## Configuration Reference

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-action` | - | Action identifier for click handling |
| `data-pulse-interval` | `3000` | Pulse animation interval (ms) |
| `data-ripple-duration` | `600` | Ripple animation duration (ms) |
| `data-hover-scale` | `1.05` | Scale on hover |
| `data-click-scale` | `0.95` | Scale on click |
| `data-glow-intensity` | `0.6` | Background glow opacity |
| `data-magnetic-effect` | `true` | Enable magnetic hover effect |
| `data-magnetic-range` | `100` | Magnetic effect range (px) |

## Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA attributes and semantic markup
- **Focus Management**: Clear focus indicators
- **High Contrast**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Touch Devices**: Touch-friendly sizing and interactions

## Performance
- **GPU Acceleration**: Uses `transform` for smooth animations
- **Efficient Animations**: Optimized pulse and ripple effects
- **Memory Management**: Proper cleanup on component destruction
- **Debounced Events**: Prevents excessive event firing

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers with modern CSS support

## Troubleshooting

### CTA Not Pulsing
- Check that `data-pulse-interval` is set to a valid number
- Ensure CSS animations are not disabled
- Verify component is properly initialized

### Magnetic Effect Not Working
- Confirm `data-magnetic-effect="true"` (default)
- Check that mouse events are not blocked
- Ensure component has proper positioning

### Ripple Not Showing
- Verify `data-ripple-duration` is greater than 0
- Check that click event reaches the component
- Ensure ripple container exists in DOM

### Positioning Issues
- Check that parent containers don't have `overflow: hidden`
- Verify z-index is sufficient for floating behavior
- Ensure positioning context allows fixed positioning

## Examples

### Quote Request CTA
```html
<button class="floating-cta cta-large" data-component="floating-cta" data-action="get-quote">
    <span class="cta-bg"></span>
    <span class="cta-text">Get Your Free Quote</span>
    <span class="cta-icon">📋</span>
    <div class="ripple-container"></div>
</button>
```

### Phone Call CTA
```html
<button class="floating-cta cta-secondary" data-component="floating-cta" data-action="call-now">
    <span class="cta-bg"></span>
    <span class="cta-text">Call Now</span>
    <span class="cta-icon">📞</span>
    <div class="ripple-container"></div>
</button>
```

### Emergency Contact CTA
```html
<button class="floating-cta cta-accent cta-large cta-top-right"
        data-component="floating-cta"
        data-action="emergency"
        data-pulse-interval="2000">
    <span class="cta-bg"></span>
    <span class="cta-text">Emergency Service</span>
    <span class="cta-icon">🚨</span>
    <div class="ripple-container"></div>
</button>
```

### Scroll to Top CTA
```html
<button class="floating-cta cta-bottom-right"
        data-component="floating-cta"
        data-action="scroll-top">
    <span class="cta-bg"></span>
    <span class="cta-text">Back to Top</span>
    <span class="cta-icon">↑</span>
    <div class="ripple-container"></div>
</button>
```

## Dependencies
- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens

## Version History
- **v1.0.0** - Initial implementation with pulsing, magnetic effects, and ripple animations
