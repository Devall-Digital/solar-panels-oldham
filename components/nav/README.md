# Navigation Component

## Overview
The Navigation component provides a responsive, interactive header navigation with dopamine-inducing effects including smooth scroll-based reveal, hover animations, and mobile menu interactions.

## Features
- **Scroll-based Reveal**: Navigation appears when scrolling up, hides when scrolling down
- **Sticky Positioning**: Enhanced shadow and backdrop when scrolled
- **Interactive Logo**: Animated SVG logo with hover effects
- **Mobile-First Design**: Responsive hamburger menu with slide-out panel
- **Keyboard Navigation**: Full accessibility support with ESC key handling
- **Smooth Animations**: GPU-accelerated transitions using CSS transforms
- **State Management**: Integrates with global state and event system

## Files
```
components/nav/
├── nav.html      # Component markup template
├── nav.css       # Component styles
├── nav.js        # Component functionality
└── README.md     # This documentation
```

## Usage

### Basic Implementation
```html
<!-- Include in your page -->
<link rel="stylesheet" href="/components/nav/nav.css">
<script src="/components/nav/nav.js" defer></script>

<!-- Add the component -->
<header class="nav-header" data-component="navigation">
    <!-- Navigation content from nav.html -->
</header>
```

### Customization Variables
```html
<!-- Component: Desktop Navigation -->
<header class="nav-header" data-component="navigation">
    <nav class="nav-container">
        <div class="nav-brand">
            <a href="/" class="nav-logo" data-action="home">
                <div class="logo-icon">
                    <!-- Custom logo SVG -->
                </div>
                <div class="logo-text">
                    <span class="logo-main">{{ brand_name }}</span>
                    <span class="logo-tag">{{ tagline }}</span>
                </div>
            </a>
        </div>

        <div class="nav-menu">
            <ul class="nav-links">
                <li class="nav-item">
                    <a href="/" class="nav-link {{ active_home }}" data-action="home">{{ home_text }}</a>
                </li>
                <!-- More navigation items -->
            </ul>
        </div>

        <div class="nav-actions">
            <button class="nav-cta btn-primary" data-action="{{ cta_action }}">
                <span class="btn-text">{{ cta_text }}</span>
                <span class="btn-shine"></span>
            </button>
        </div>
    </nav>
</header>
```

## Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `brand_name` | Company name in logo | "Solar Panels Oldham" |
| `tagline` | Brand tagline | "Future Energy" |
| `home_text` | Home link text | "Home" |
| `calculator_text` | Calculator link text | "Calculator" |
| `services_text` | Services link text | "Services" |
| `about_text` | About link text | "About" |
| `contact_text` | Contact link text | "Contact" |
| `cta_action` | Primary CTA action | "get-quote" |
| `cta_text` | Primary CTA button text | "Get Free Quote" |

## JavaScript API

### Component Instance
```javascript
// Get component instance
const navElement = document.querySelector('[data-component="navigation"]');
const navComponent = navElement.navigationComponent;

// Public methods
navComponent.show();        // Force show navigation
navComponent.hide();        // Force hide navigation
navComponent.setActiveLink('/path'); // Set active navigation link
```

### Events
The component emits the following events via the global event bus:
- `nav:shown` - Navigation revealed
- `nav:hidden` - Navigation hidden
- `mobile-menu:opened` - Mobile menu opened
- `mobile-menu:closed` - Mobile menu closed
- `nav:link-clicked` - Navigation link clicked

### Event Listeners
```javascript
// Listen for navigation events
window.app.eventBus.on('nav:shown', () => {
    console.log('Navigation is now visible');
});

window.app.eventBus.on('nav:link-clicked', (data) => {
    console.log('Link clicked:', data.action, data.href);
});
```

## Styling Customization

### CSS Variables
```css
.nav-header {
    --nav-bg: rgba(15, 23, 42, 0.95);
    --nav-blur: 20px;
    --nav-border: rgba(255, 215, 0, 0.1);
    --nav-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    --nav-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --logo-scale: 1;
    --mobile-menu-bg: rgba(15, 23, 42, 0.98);
    --mobile-overlay: rgba(0, 0, 0, 0.5);
}
```

### Responsive Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## Accessibility Features
- **Keyboard Navigation**: Full tab order support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Focus trapping in mobile menu
- **ESC Key**: Close mobile menu
- **Skip Links**: Integration with page skip links

## Performance Optimizations
- **GPU Acceleration**: Uses `transform` and `opacity` for animations
- **Passive Listeners**: Scroll events use passive listeners
- **Debounced Resize**: Window resize events are optimized
- **Lazy Initialization**: Component initializes only when needed

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Dependencies
- `core/state.js` - Global state management
- `core/events.js` - Event system
- `assets/css/variables.css` - Design tokens
- `assets/css/animations.css` - Animation utilities

## Testing Checklist
- [ ] Navigation appears on scroll up
- [ ] Navigation hides on scroll down
- [ ] Logo animates on hover
- [ ] Mobile menu opens/closes properly
- [ ] Links have proper active states
- [ ] Keyboard navigation works
- [ ] Responsive design functions
- [ ] No console errors
- [ ] Performance metrics met

## Troubleshooting

### Navigation not appearing
- Check that CSS and JS files are loaded
- Verify component has `data-component="navigation"` attribute
- Check browser console for errors

### Mobile menu not working
- Ensure viewport meta tag is present
- Check CSS media queries
- Verify JavaScript event binding

### Scroll behavior issues
- Confirm no conflicting CSS transforms
- Check for other fixed positioned elements
- Verify scroll event listeners aren't blocked

## Version History
- **v1.0.0** - Initial release with full responsive navigation
- Complete dopamine-inducing interactions
- Accessibility compliance
- Performance optimizations
