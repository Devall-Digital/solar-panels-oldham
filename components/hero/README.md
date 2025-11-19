# Hero Section Component

## Overview
The Hero Section is the main landing area with animated particles, counting statistics, and compelling CTAs designed to create an immediate dopamine response.

## Features
- Interactive particle system that responds to mouse movement
- Animated counting statistics
- Glowing text effects
- Button shine and ripple effects
- Fully responsive design
- Accessibility compliant

## Usage

### HTML Structure
```html
<!-- Component: Hero Section -->
<section class="hero-section" data-component="hero">
    <div class="hero-particles" id="particles"></div>
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="hero-title-line1">Save Money With</span>
            <span class="hero-title-line2">Solar Power in</span>
            <span class="hero-accent">Oldham</span>
        </h1>
        <p class="hero-subtitle">Professional solar panel installation for homes in Greater Manchester</p>
        <div class="hero-stats">
            <div class="stat-item" data-count="2500">
                <span class="stat-number">0</span>
                <span class="stat-label">Homes Powered</span>
            </div>
            <div class="stat-item" data-count="4700">
                <span class="stat-number">0</span>
                <span class="stat-label">Avg Yearly Savings</span>
            </div>
            <div class="stat-item" data-count="25">
                <span class="stat-number">0</span>
                <span class="stat-label">Year Warranty</span>
            </div>
        </div>
        <div class="hero-cta">
            <button class="btn-primary" data-action="get-quote">
                <span class="btn-text">Get Your Free Quote</span>
                <span class="btn-shine"></span>
            </button>
        </div>
    </div>
</section>
```

### Required Files
- `/components/hero/hero.js`
- `/components/hero/hero.css`

### Variables
- `line1`, `line2`, `accent` - Hero title parts
- `subtitle` - Supporting text
- `value1-3`, `label1-3` - Statistics
- `action` - Button action identifier
- `cta_text` - Button text

## Configuration

### JavaScript Configuration
```javascript
config = {
    particleCount: 50,          // Number of particles
    particleSpeed: 0.5,         // Movement speed
    particleSize: { min: 1, max: 3 },  // Size range
    particleColors: ['#FFD700', '#FFED4A', '#F59E0B'],  // Colors
    connectionDistance: 150,    // Line connection distance
    mouseRadius: 100           // Mouse interaction radius
}
```

## Events

### Emitted Events
- `component:hero:initialized` - When component is ready
- `component:hero:error` - On initialization error
- `hero:cta:click` - When CTA button is clicked
- `component:hero:destroyed` - When component is destroyed

## Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigable
- Respects prefers-reduced-motion

## Performance
- Canvas-based particle system for smooth 60fps
- Intersection Observer for counter animations
- RAF-based animations
- Automatic cleanup on destroy

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Touch-optimized

## Notes
- Particle system is GPU-accelerated
- Counters only animate once when in view
- Button effects are CSS-based for performance
- Component is fully self-contained
