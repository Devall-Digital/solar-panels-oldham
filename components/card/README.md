# Interactive Card Component

## Overview
The Interactive Card component features a 3D tilt effect on hover with glowing highlights and smooth animations, designed to create engaging user interactions.

## Features
- 3D tilt effect on mouse movement
- Glowing highlight that follows cursor
- Smooth scale animations on hover
- Staggered entrance animations
- Feature tags with hover effects
- Animated CTA with arrow
- Touch-optimized for mobile

## Usage

### HTML Structure
```html
<!-- Component: Interactive Card -->
<div class="interactive-card" data-component="card" data-tilt>
    <div class="card-glow"></div>
    <div class="card-inner">
        <div class="card-icon">
            <img src="/assets/images/icons/solar-panel.svg" alt="Solar Panel Installation">
        </div>
        <h3 class="card-title">Professional Installation</h3>
        <p class="card-description">Expert installation by certified engineers with 25+ years of experience in solar energy systems.</p>
        <div class="card-features">
            <span class="feature-tag">MCS Certified</span>
            <span class="feature-tag">25 Year Warranty</span>
        </div>
        <button class="card-cta" data-action="learn-more">
            Learn More
            <span class="arrow">→</span>
        </button>
    </div>
</div>
```

### Required Files
- `/components/card/interactive-card.js`
- `/components/card/interactive-card.css`

### Variables
- `icon_url`, `icon_alt` - Card icon
- `title` - Card heading
- `description` - Card content
- `tag1`, `tag2` - Feature tags
- `action` - Button action identifier
- `cta_text` - Button text

## Configuration

### JavaScript Configuration
```javascript
config = {
    maxTilt: 15,         // Maximum tilt angle in degrees
    perspective: 1000,   // 3D perspective value
    scale: 1.05,        // Scale on hover
    speed: 300,         // Animation speed in ms
    glare: true,        // Enable glare effect
    maxGlare: 0.3       // Maximum glare opacity
}
```

### Data Attributes
- `data-tilt` - Enable/disable tilt effect (default: true)
- `data-tilt="false"` - Disable tilt effect

## Variants

### Default Card
```html
<div class="interactive-card" data-component="card">
    <!-- Card content -->
</div>
```

### Primary Card
```html
<div class="interactive-card card-primary" data-component="card">
    <!-- Card content -->
</div>
```

### Featured Card
```html
<div class="interactive-card card-featured" data-component="card">
    <!-- Shows "Popular" badge -->
</div>
```

## Events

### Emitted Events
- `component:card:initialized` - When card is ready
- `component:card:error` - On initialization error
- `card:hover:enter` - Mouse enters card
- `card:hover:leave` - Mouse leaves card
- `card:click` - Card clicked
- `card:cta:click` - CTA button clicked
- `component:card:destroyed` - Component destroyed

### Event Data
```javascript
// CTA click event
{
    action: 'learn-more',  // From data-action
    card: HTMLElement      // Card element
}
```

## Methods

### Update Configuration
```javascript
const card = element._componentInstance;
card.updateConfig({
    maxTilt: 20,
    scale: 1.1
});
```

### Enable/Disable Tilt
```javascript
card.setTiltEnabled(false); // Disable tilt
card.setTiltEnabled(true);  // Enable tilt
```

## Accessibility
- Keyboard navigable
- Focus states for interactive elements
- Semantic HTML structure
- Touch-friendly on mobile

## Performance
- GPU-accelerated transforms
- Will-change optimization
- Efficient event handling
- Intersection Observer for animations

## Browser Support
- Chrome/Edge: Full 3D effects
- Firefox: Full 3D effects
- Safari: Full 3D effects
- Mobile: Touch-optimized (no tilt)

## Responsive Behavior
- Mobile: Simplified hover states, tap feedback
- Tablet: Full effects with touch support
- Desktop: Complete 3D tilt experience

## Notes
- Tilt effect automatically disabled on touch devices
- Cards animate in with staggered delay when scrolled into view
- Glare effect follows mouse position for realism
- All animations respect prefers-reduced-motion
