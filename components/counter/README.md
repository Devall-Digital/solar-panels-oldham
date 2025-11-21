# Animated Counter Component

## Overview
The Animated Counter component creates engaging number animations that trigger when the element comes into view. Perfect for displaying statistics, metrics, and achievements with smooth, satisfying animations.

## Features
- **Scroll-Triggered Animation**: Animates only when visible in viewport
- **Multiple Easing Options**: Various easing functions for different feels
- **Flexible Formatting**: Support for prefixes, suffixes, and number grouping
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Respects reduced motion preferences
- **Performance Optimized**: Efficient animation loops and cleanup

## Usage

### Basic Implementation
```html
<div class="animated-counter" data-component="counter">
    <span class="counter-prefix">$</span>
    <span class="counter-value" data-target="125000">0</span>
    <span class="counter-suffix">/year</span>
</div>
```

### Required Files
```html
<!-- CSS -->
<link rel="stylesheet" href="/components/counter/counter.css">

<!-- JavaScript (automatically loaded by component system) -->
```

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `target` | Target number to count to | "125000" |
| `prefix` | Text before the number | "$" |
| `suffix` | Text after the number | "/year" |
| `start` | Starting number (default: 0) | "1000" |
| `duration` | Animation duration in ms | "3000" |
| `easing` | Easing function | "easeOutCubic" |
| `locale` | Number formatting locale | "en-GB" |
| `grouping` | Use number grouping | "false" |

## Configuration Options

### Data Attributes
```html
<div class="animated-counter"
     data-component="counter"
     data-target="2500000"
     data-start="0"
     data-duration="2500"
     data-easing="easeOutQuad"
     data-locale="en-US"
     data-grouping="true">
    <span class="counter-prefix">£</span>
    <span class="counter-value">0</span>
    <span class="counter-suffix"> saved</span>
</div>
```

### JavaScript Configuration
```javascript
// Access component instance
const counterElement = document.querySelector('[data-component="counter"]');
const counterInstance = getComponentInstance(counterElement);

// Update configuration
counterInstance.updateConfig({
    duration: 3000,
    easing: 'easeInOutCubic',
    locale: 'en-GB',
    useGrouping: true
});
```

## Easing Options
- `linear` - Linear progression
- `easeOutCubic` - Fast start, slow finish (default)
- `easeOutQuad` - Quadratic ease out
- `easeOutQuart` - Quartic ease out
- `easeInOutCubic` - Slow start and finish

## Events

### Emitted Events
- `component:counter:initialized` - Component ready
- `component:counter:destroyed` - Component destroyed
- `counter:animation:start` - Animation begins
- `counter:animation:complete` - Animation finishes
- `component:counter:error` - Initialization error

### Listening for Events
```javascript
import { on } from '/core/events.js';

// Listen for animation completion
on('counter:animation:complete', (data) => {
    const { element, finalValue } = data;
    console.log('Counter reached:', finalValue);
});
```

## Size Variants
```html
<!-- Small counter -->
<div class="animated-counter counter-small" data-component="counter">
    <span class="counter-value" data-target="500">0</span>
</div>

<!-- Medium counter (default) -->
<div class="animated-counter counter-medium" data-component="counter">
    <span class="counter-value" data-target="10000">0</span>
</div>

<!-- Large counter -->
<div class="animated-counter counter-large" data-component="counter">
    <span class="counter-value" data-target="1000000">0</span>
</div>

<!-- Extra large counter -->
<div class="animated-counter counter-xlarge" data-component="counter">
    <span class="counter-value" data-target="50000000">0</span>
</div>
```

## Color Variants
```html
<!-- Primary color (default) -->
<div class="animated-counter counter-primary" data-component="counter">
    <span class="counter-value" data-target="1000">0</span>
</div>

<!-- Accent color -->
<div class="animated-counter counter-accent" data-component="counter">
    <span class="counter-value" data-target="1000">0</span>
</div>

<!-- Light color -->
<div class="animated-counter counter-light" data-component="counter">
    <span class="counter-value" data-target="1000">0</span>
</div>
```

## Accessibility
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Enhanced visibility in high contrast mode
- **Screen Readers**: Semantic markup with proper text content
- **Keyboard Navigation**: Focus management for interactive counters

## Performance
- **Intersection Observer**: Only animates when visible
- **Request Animation Frame**: Smooth 60fps animations
- **Memory Management**: Proper cleanup on component destruction
- **Efficient Updates**: Optimized display formatting

## Browser Support
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+
- Mobile browsers with Intersection Observer support

## Troubleshooting

### Counter Not Animating
- Verify `data-target` attribute has a valid number
- Check that element is in viewport
- Ensure Intersection Observer is supported
- Confirm component is properly initialized

### Formatting Issues
- Check `data-locale` for correct number formatting
- Verify `data-grouping` is set correctly
- Ensure prefix/suffix elements exist if used

### Performance Issues
- Reduce `data-duration` for faster animations
- Use `easeOutQuad` for smoother performance
- Check for multiple counters animating simultaneously

## Examples

### Revenue Counter
```html
<div class="animated-counter counter-large counter-primary" data-component="counter">
    <span class="counter-prefix">£</span>
    <span class="counter-value" data-target="2500000">0</span>
    <span class="counter-suffix"> revenue</span>
</div>
```

### Percentage Counter
```html
<div class="animated-counter counter-accent" data-component="counter">
    <span class="counter-value" data-target="87">0</span>
    <span class="counter-suffix">% efficiency</span>
</div>
```

### Time Counter
```html
<div class="animated-counter" data-component="counter" data-duration="1000">
    <span class="counter-value" data-target="365">0</span>
    <span class="counter-suffix"> days/year</span>
</div>
```

## Dependencies
- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens

## Version History
- **v1.0.0** - Initial implementation with easing and formatting options
