# Modal Dialog Component

## Overview
The Modal Dialog component creates overlay dialogs with smooth animations, backdrop blur effects, and comprehensive accessibility features. Perfect for forms, confirmations, and detailed content display.

## Features
- **Smooth Animations**: Multiple animation variants with customizable timing
- **Backdrop Effects**: Blur and overlay with configurable opacity
- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: Escape key and tab navigation support
- **Responsive Design**: Mobile-optimized with touch-friendly interactions
- **Accessibility**: ARIA attributes, screen reader support, high contrast modes
- **Flexible Content**: Dynamic header, body, and footer content

## Usage

### Basic Implementation
```html
<div class="modal" data-component="modal" id="my-modal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-header">
            <h2 class="modal-title">Modal Title</h2>
        </div>
        <div class="modal-body">
            <p>Modal content goes here...</p>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-primary" onclick="submitForm()">Submit</button>
        </div>
    </div>
</div>
```

### Required Files
```html
<!-- CSS -->
<link rel="stylesheet" href="/components/modal/modal.css">

<!-- JavaScript (automatically loaded by component system) -->
```

## Configuration Options

### Data Attributes
```html
<div class="modal"
     data-component="modal"
     data-backdrop-close="true"
     data-escape-close="true"
     data-close-button="true"
     data-prevent-scroll="true"
     data-animation-duration="300"
     data-focus-trap="true">
    <!-- Modal content -->
</div>
```

### JavaScript Control
```javascript
// Get modal instance
const modalElement = document.getElementById('my-modal');
const modalInstance = getComponentInstance(modalElement);

// Show modal
await modalInstance.show();

// Hide modal
await modalInstance.hide();

// Toggle modal
await modalInstance.toggle();

// Update content
modalInstance.updateContent(
    'New Title',
    '<p>New content...</p>',
    '<button>Close</button>'
);
```

## Size Variants
```html
<!-- Small modal -->
<div class="modal modal-small" data-component="modal">

<!-- Medium modal (default) -->
<div class="modal modal-medium" data-component="modal">

<!-- Large modal -->
<div class="modal modal-large" data-component="modal">

<!-- Full screen modal -->
<div class="modal modal-full" data-component="modal">
```

## Animation Variants
```html
<!-- Fade animation (default) -->
<div class="modal modal-fade" data-component="modal">

<!-- Scale animation -->
<div class="modal modal-scale" data-component="modal">

<!-- Slide up animation -->
<div class="modal modal-slide-up" data-component="modal">

<!-- Slide down animation -->
<div class="modal modal-slide-down" data-component="modal">
```

## Events

### Emitted Events
- `component:modal:initialized` - Component ready
- `component:modal:destroyed` - Component destroyed
- `modal:show` - Modal show initiated
- `modal:shown` - Modal fully visible
- `modal:hide` - Modal hide initiated
- `modal:hidden` - Modal fully hidden
- `modal:animation:complete` - Animation finished
- `component:modal:error` - Initialization error

### Listening for Events
```javascript
import { on } from '/core/events.js';

// Listen for modal shown
on('modal:shown', (data) => {
    const { element } = data;
    console.log('Modal is now visible');
});

// Listen for modal hidden
on('modal:hidden', (data) => {
    const { element } = data;
    console.log('Modal is now hidden');
});
```

## Accessibility
- **ARIA Attributes**: Proper `role`, `aria-modal`, and `aria-hidden` attributes
- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: Escape key and tab navigation support
- **Screen Readers**: Semantic markup and proper heading structure
- **High Contrast**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Performance
- **GPU Acceleration**: Uses `transform` and `opacity` for animations
- **Efficient Rendering**: Optimized backdrop blur and transitions
- **Memory Management**: Proper cleanup on component destruction
- **Lazy Loading**: Only initializes when needed

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers with backdrop-filter support

## Configuration Reference

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-backdrop-close` | `true` | Close modal when clicking backdrop |
| `data-escape-close` | `true` | Close modal with Escape key |
| `data-close-button` | `true` | Show and enable close button |
| `data-prevent-scroll` | `true` | Prevent body scrolling when open |
| `data-animation-duration` | `300` | Animation duration in milliseconds |
| `data-focus-trap` | `true` | Enable focus trapping |

## Troubleshooting

### Modal Not Showing
- Check that `display: block` is set via JavaScript (not CSS)
- Verify modal element exists in DOM
- Ensure component is properly initialized

### Backdrop Click Not Working
- Confirm `data-backdrop-close="true"` (default)
- Check that click is on backdrop element, not content
- Verify event listeners are attached

### Focus Issues
- Ensure modal has focusable elements
- Check for dynamic content changes
- Verify focus trap is enabled

### Animation Problems
- Confirm CSS transitions are not disabled
- Check for `prefers-reduced-motion` setting
- Verify animation duration is reasonable

## Examples

### Confirmation Dialog
```html
<div class="modal modal-small" data-component="modal" id="confirm-modal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-header">
            <h2 class="modal-title">Confirm Action</h2>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to proceed?</p>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-primary" onclick="confirmAction()">Confirm</button>
        </div>
    </div>
</div>
```

### Form Modal
```html
<div class="modal modal-large" data-component="modal" id="form-modal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-header">
            <h2 class="modal-title">Contact Form</h2>
        </div>
        <div class="modal-body">
            <form id="contact-form">
                <!-- Form fields -->
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn-primary" type="submit" form="contact-form">Send</button>
        </div>
    </div>
</div>
```

### Image Gallery Modal
```html
<div class="modal modal-full" data-component="modal" id="gallery-modal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-body">
            <img src="image.jpg" alt="Gallery image" style="max-width: 100%; height: auto;">
        </div>
    </div>
</div>
```

## Dependencies
- `/core/events.js` - Event system
- `/assets/css/variables.css` - Design tokens
- `/assets/css/animations.css` - Animation utilities

## Version History
- **v1.0.0** - Initial implementation with full accessibility and animation support
