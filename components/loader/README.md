# Loading Animation Component

## Overview
The Loading Animation component provides an entertaining, solar-themed loading indicator that keeps users engaged during wait times. Features a rotating sun with orbiting solar panels and customizable text.

## Features
- **Solar Theme**: Sun and panel animation matching the brand
- **Smooth Animations**: GPU-accelerated rotations and scaling
- **Customizable Text**: Dynamic loading messages
- **Size Variants**: Small, medium, and large options
- **Theme Variants**: Solar, dark, and default themes
- **Accessibility**: Screen reader support and reduced motion respect

## Usage

### Basic Implementation
```html
<div class="loading-animation" data-component="loader">
    <div class="solar-loader">
        <div class="sun"></div>
        <div class="panel panel-1"></div>
        <div class="panel panel-2"></div>
        <div class="panel panel-3"></div>
    </div>
    <p class="loading-text">Loading your solar experience...</p>
</div>
```

### JavaScript Control
```javascript
// Get component instance
const loaderElement = document.querySelector('[data-component="loader"]');
const loaderInstance = getComponentInstance(loaderElement);

// Start loading
loaderInstance.start();

// Update text
loaderInstance.updateText('Processing your request...');

// Stop loading
loaderInstance.stop();

// Check if loading
if (loaderInstance.isLoading()) {
    // Still loading
}
```

## Configuration Options

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-auto-start` | `true` | Auto-start animation on init |
| `data-text` | `"Loading..."` | Loading text message |
| `data-size` | `"medium"` | Size variant (small/medium/large) |
| `data-theme` | `"solar"` | Theme variant (solar/dark/default) |

## Events

### Emitted Events
- `component:loader:initialized` - Component ready
- `component:loader:destroyed` - Component destroyed
- `loader:start` - Animation started
- `loader:stop` - Animation stopped
- `component:loader:error` - Initialization error

## Size Variants
```html
<!-- Small loader -->
<div class="loading-animation loader-small" data-component="loader">

<!-- Medium loader (default) -->
<div class="loading-animation" data-component="loader">

<!-- Large loader -->
<div class="loading-animation loader-large" data-component="loader">
```

## Theme Variants
```html
<!-- Solar theme (default) -->
<div class="loading-animation loader-solar" data-component="loader">

<!-- Dark theme -->
<div class="loading-animation loader-dark" data-component="loader">

<!-- Default theme -->
<div class="loading-animation loader-default" data-component="loader">
```

## Dependencies
- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens

## Version History
- **v1.0.0** - Initial solar-themed loading animation
