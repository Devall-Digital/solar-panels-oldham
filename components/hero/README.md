# Hero Section Component

## Overview
The Hero Section component creates an immersive landing area with animated particles, dynamic statistics counters, and compelling call-to-action elements. It provides dopamine-inducing visual effects while maintaining excellent performance.

## Features
- **Particle Animation System**: Interactive background particles with mouse influence
- **Animated Counters**: Smooth counting animations triggered on scroll
- **Responsive Design**: Mobile-first approach with fluid typography
- **Accessibility**: Reduced motion support and keyboard navigation
- **Performance Optimized**: GPU-accelerated animations and efficient rendering

## Usage

### Basic Implementation
```html
<section class="hero-section" data-component="hero">
    <div class="hero-particles" id="particles"></div>
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="hero-title-line1">Power Your Home</span>
            <span class="hero-title-line2">With Future Energy</span>
            <span class="hero-accent">Oldham's #1 Solar Choice</span>
        </h1>
        <p class="hero-subtitle">Join 1,000+ homeowners saving up to £1,200 annually.</p>
        <div class="hero-stats">
            <div class="stat-item" data-count="1200">
                <span class="stat-number">0</span>
                <span class="stat-label">Avg. Savings (£)</span>
            </div>
            <div class="stat-item" data-count="1000">
                <span class="stat-number">0</span>
                <span class="stat-label">Happy Customers</span>
            </div>
            <div class="stat-item" data-count="25">
                <span class="stat-number">0</span>
                <span class="stat-label">Year Warranty</span>
            </div>
        </div>
        <div class="hero-cta">
            <button class="btn-primary" data-action="scroll-to-calculator">
                <span class="btn-text">Calculate Your Savings</span>
                <span class="btn-shine"></span>
            </button>
        </div>
    </div>
</section>
```

### Required Files
```html
<!-- CSS -->
<link rel="stylesheet" href="/components/hero/hero.css">

<!-- JavaScript (automatically loaded by component system) -->
```

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `line1` | First line of hero title | "Power Your Home" |
| `line2` | Second line of hero title | "With Future Energy" |
| `accent` | Accent text in title | "Oldham's #1 Solar Choice" |
| `subtitle` | Supporting text | "Join 1,000+ homeowners..." |
| `value1-3` | Statistic values | "1200", "1000", "25" |
| `label1-3` | Statistic labels | "Avg. Savings (£)", "Happy Customers" |
| `action` | Button action identifier | "scroll-to-calculator" |
| `cta_text` | Call-to-action button text | "Calculate Your Savings" |

## Configuration

### Particle System
```javascript
// Access component instance
const heroElement = document.querySelector('[data-component="hero"]');
const heroInstance = getComponentInstance(heroElement);

// Update particle configuration
heroInstance.updateConfig({
    particles: {
        count: 100,           // Number of particles
        colors: ['#FFD700'],  // Particle colors
        speed: 0.3,           // Movement speed
        connectionDistance: 120 // Connection line distance
    }
});
```

### Counter Animation
```javascript
heroInstance.updateConfig({
    counters: {
        duration: 3000,       // Animation duration in ms
        easing: 'easeOutCubic' // Easing function
    }
});
```

## Events

### Emitted Events
- `component:hero:initialized` - Component ready
- `component:hero:destroyed` - Component destroyed
- `hero:cta:click` - CTA button clicked
- `component:hero:error` - Initialization error

### Listening for Events
```javascript
import { on } from '/core/events.js';

// Listen for CTA clicks
on('hero:cta:click', (data) => {
    const { action, element } = data;
    if (action === 'scroll-to-calculator') {
        // Handle scroll to calculator
    }
});
```

## Accessibility
- **Keyboard Navigation**: CTA button fully accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Clear focus indicators

## Performance
- **GPU Acceleration**: Uses `transform` and `opacity` for animations
- **Efficient Rendering**: Canvas-based particle system with optimized drawing
- **Lazy Loading**: Counters animate only when visible
- **Memory Management**: Proper cleanup on component destruction

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers with Canvas support

## Troubleshooting

### Particles Not Showing
- Check that the `.hero-particles` container exists
- Ensure canvas context is available
- Verify no CSS is hiding the canvas

### Counters Not Animating
- Confirm `data-count` attribute has numeric value
- Check that counter elements are in viewport
- Verify Intersection Observer support

### Performance Issues
- Reduce particle count for slower devices
- Disable particles on mobile if needed
- Check for memory leaks in dev tools

## Examples

### Minimal Hero
```html
<section class="hero-section" data-component="hero">
    <div class="hero-particles"></div>
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="hero-title-line1">Welcome</span>
        </h1>
        <div class="hero-cta">
            <button class="btn-primary" data-action="get-started">
                <span class="btn-text">Get Started</span>
            </button>
        </div>
    </div>
</section>
```

### Hero with Statistics
```html
<!-- Same as basic implementation with stat-item elements -->
```

## Dependencies
- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens
- `/assets/css/animations.css` - Animation utilities

## Version History
- **v1.0.0** - Initial implementation with particle system and counters
