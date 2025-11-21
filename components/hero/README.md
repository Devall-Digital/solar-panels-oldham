# Hero Section Component

## Overview
The Hero Section component creates an immersive, dopamine-inducing landing area with animated particles, counting statistics, and compelling call-to-action elements. It serves as the main entry point for the Solar Panels Oldham website.

## Features
- **Particle Animation System**: Interactive floating particles with mouse influence and connecting lines
- **Animated Counters**: Statistics that count up when visible, creating anticipation
- **Responsive Design**: Optimized for all screen sizes with mobile-first approach
- **Accessibility**: Reduced motion support and keyboard navigation
- **Performance Optimized**: Only animates when visible, efficient rendering

## Files
- `hero.css` - Component styles with animations and responsive design
- `hero.js` - Component logic with particle system and counter animations
- `README.md` - This documentation

## Usage

### Basic Implementation
```html
<section class="hero-section" data-component="hero">
    <div class="hero-particles" id="particles"></div>
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="hero-title-line1">Save Money With</span>
            <span class="hero-title-line2">Solar Power in</span>
            <span class="hero-accent">Oldham</span>
        </h1>
        <p class="hero-subtitle">Professional solar panel installation for homes in Greater Manchester. Cut your electricity bills by up to 70% with renewable energy.</p>
        <div class="hero-stats">
            <div class="stat-item" data-count="2847">
                <span class="stat-number">0</span>
                <span class="stat-label">Homes Powered</span>
            </div>
            <div class="stat-item" data-count="4200">
                <span class="stat-number">0</span>
                <span class="stat-label">Avg Yearly Savings (£)</span>
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

### Required CSS/JS Includes
```html
<link rel="stylesheet" href="/components/hero/hero.css">
<script type="module" src="/components/hero/hero.js"></script>
```

### Variables
Replace the following placeholders with your content:

- `line1`, `line2`, `accent`: Hero title parts
- `subtitle`: Supporting text
- `value1-3`, `label1-3`: Statistics values and labels
- `action`: Button action identifier
- `cta_text`: Button text

## Configuration

### Particle System Settings
The particle system is configured in `hero.js` with these default settings:
```javascript
{
    count: 80,                    // Number of particles
    colors: ['#FFD700', '#FFED4A', '#F59E0B'],  // Particle colors
    minSize: 1.5,                 // Minimum particle size
    maxSize: 3,                   // Maximum particle size
    connectionDistance: 150,      // Max distance for particle connections
    mouseInfluence: 100          // Mouse interaction radius
}
```

### Counter Animation
Counters automatically animate when they come into view. The animation duration is set to 2 seconds with easing.

## Events

### Emitted Events
- `hero:action` - Fired when CTA button is clicked
  - `detail.action`: The action identifier from data-action attribute
  - `detail.element`: The button element that was clicked

### Listening for Events
```javascript
document.addEventListener('hero:action', (event) => {
    const { action, element } = event.detail;
    console.log('Hero action:', action);
});
```

## Accessibility
- Supports `prefers-reduced-motion` for users who prefer less animation
- High contrast mode support
- Keyboard navigation friendly
- Screen reader compatible

## Performance
- Particles only animate when component is visible
- Efficient canvas rendering with requestAnimationFrame
- Debounced resize handling
- Memory cleanup on component destruction

## Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Dependencies
- `/assets/css/variables.css` - Design system variables
- `/assets/css/animations.css` - Global animation utilities
- `/core/state.js` - State management (optional)
- `/core/events.js` - Event system (optional)

## Testing
Test the following scenarios:
- [ ] Particle animation on desktop and mobile
- [ ] Counter animations trigger on scroll
- [ ] CTA button interactions
- [ ] Responsive behavior across breakpoints
- [ ] Reduced motion preferences
- [ ] Touch interactions on mobile
- [ ] Memory usage over time (no leaks)

## Customization
The component can be customized by:
1. Modifying the particle settings in `hero.js`
2. Adjusting CSS custom properties in `hero.css`
3. Changing the HTML structure (following component rules)
4. Overriding styles with more specific selectors

## Troubleshooting
- **Particles not showing**: Check that the canvas element is created and visible
- **Counters not animating**: Verify Intersection Observer support and element visibility
- **Performance issues**: Reduce particle count or disable on lower-end devices
- **Mobile issues**: Check canvas sizing and touch event handling
