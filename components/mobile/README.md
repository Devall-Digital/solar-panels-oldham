# Mobile Menu Component

## Overview
A responsive navigation menu component with smooth slide animations and accessibility features.

## Usage

```html
<!-- Component: Mobile Menu -->
<div class="mobile-menu" data-component="mobile-menu">
    <button class="menu-toggle" aria-label="Toggle menu">
        <span class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </span>
    </button>
    <nav class="menu-panel">
        <ul class="menu-list">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#calculator">Calculator</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><button class="btn-primary">Get Quote</button></li>
        </ul>
    </nav>
</div>
```

## Features

- **Responsive Design**: Only shows on mobile/tablet devices
- **Smooth Animations**: Slide transitions and hamburger morphing
- **Accessibility**: Keyboard navigation, ARIA attributes, focus management
- **Touch-Friendly**: Large touch targets and gesture support
- **Backdrop**: Click outside to close functionality

## Configuration

### Data Attributes
- `data-component="mobile-menu"` - Required for component initialization

### CSS Classes
- `.mobile-menu` - Main container
- `.menu-toggle` - Hamburger button
- `.menu-panel` - Slide-out menu panel
- `.menu-list` - Navigation list
- `.menu-open` - Applied when menu is open

## Events

### Emitted Events
- `component:mobile-menu:initialized` - Component ready
- `mobile-menu:toggle` - Menu opened/closed
- `mobile-menu:opened` - Menu opened
- `mobile-menu:closed` - Menu closed
- `mobile-menu:link-clicked` - Menu link clicked

## Dependencies

- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens
- `/assets/css/animations.css` - Animation utilities

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance

- GPU-accelerated animations
- Efficient event delegation
- Minimal DOM manipulation
- Touch-optimized interactions

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Focus trap management
- Reduced motion support
