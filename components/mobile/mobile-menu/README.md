# Mobile Menu Component

## Overview
The `mobile-menu` component powers the responsive navigation experience under 1024px. It pairs with the `site-nav` component to provide an accessible, dopamine-inducing overlay menu that respects reduced-motion settings and traps focus while open.

## Files
- `mobile-menu.css` – Slide-down panel styling, hamburger animation, overlay states
- `mobile-menu.js` – Toggle logic, focus trapping, outside-click + ESC handling

## Markup
Use exactly as documented:

```html
<div class="mobile-menu" data-component="mobile-menu" data-menu-state="closed">
    <button 
        class="menu-toggle" 
        aria-label="Toggle menu" 
        aria-expanded="false" 
        aria-haspopup="true" 
        aria-controls="primary-mobile-menu">
        <span class="menu-toggle__label">Menu</span>
        <span class="hamburger" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
        </span>
    </button>
    <nav id="primary-mobile-menu" class="menu-panel" aria-label="Mobile navigation" aria-hidden="true">
        <ul class="menu-list">
            <li class="menu-item">
                <a href="#home" class="nav-link">Home</a>
            </li>
            <li class="menu-item">
                <a href="#services" class="nav-link">Services</a>
            </li>
            <li class="menu-item">
                <a href="#calculator" class="nav-link">Calculator</a>
            </li>
            <li class="menu-item">
                <a href="#contact" class="nav-link">Contact</a>
            </li>
            <li class="menu-item menu-item-contact">
                <div class="nav-contact">
                    <span class="nav-contact-label">Speak to an expert</span>
                    <a href="tel:01615550198" class="nav-contact-link">0161 555 0198</a>
                </div>
            </li>
            <li class="menu-item menu-item-cta">
                <button class="btn-primary w-full" data-action="show-quote-form">
                    <span class="btn-text">Book a Survey</span>
                    <span class="btn-shine"></span>
                </button>
            </li>
        </ul>
    </nav>
</div>
```

## Behavior
- `data-menu-state`: `closed` | `open` (managed by component)
- `aria-expanded` / `aria-hidden` kept in sync for accessibility
- Focus trapping inside the panel while open
- ESC key, link click, outside click, or breakpoint changes close the panel
- Adds `nav-menu-open` class to `<html>` and `<body>` to lock scroll
- Emits `mobile-menu:state-change` events for other components (e.g., `site-nav`)

## Usage Checklist
1. Include `/components/mobile/mobile-menu/mobile-menu.css`
2. Include `/components/mobile/mobile-menu/mobile-menu.js`
3. Nest inside the `site-nav` component (or another approved parent)
4. Do not change class names or structure
5. Document usage in TASK_REGISTRY.md when work is complete

