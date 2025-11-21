# Site Navigation Component

## Overview
The `site-nav` component delivers the sticky navigation experience for Solar Panels Oldham. It combines a dopamine-inducing header, progress indicator, smooth scrolling, and mobile handoff to the `mobile-menu` component while respecting all development rules.

## Files
- `site-nav.css` – Component styles (blurred glass header, progress bar, responsive layout)
- `site-nav.js` – Component logic (scroll states, progress bar, section highlighting, smooth scroll)

## Markup
Copy the structure exactly:

```html
<header class="site-nav" data-component="site-nav" data-nav-state="default">
    <div class="site-nav__container">
        <a href="#home" class="nav-logo">
            <span class="nav-logo-mark" aria-hidden="true">&#9728;</span>
            <span class="nav-logo-text">
                <span class="nav-logo-title">Solar Panels Oldham</span>
                <span class="nav-logo-subtitle">MCS Certified Installers</span>
            </span>
        </a>

        <nav class="site-nav__links" aria-label="Primary navigation">
            <a href="#home" class="nav-link">Home</a>
            <a href="#services" class="nav-link">Services</a>
            <a href="#calculator" class="nav-link">Calculator</a>
            <a href="#contact" class="nav-link">Contact</a>
        </nav>

        <div class="site-nav__actions">
            <div class="nav-contact">
                <span class="nav-contact-label">Speak to an expert</span>
                <a href="tel:01615550198" class="nav-contact-link">0161 555 0198</a>
            </div>
            <button class="btn-primary nav-cta" data-action="show-quote-form">
                <span class="btn-text">Book a Survey</span>
                <span class="btn-shine"></span>
            </button>
        </div>

        <div class="mobile-menu" data-component="mobile-menu" data-menu-state="closed">
            <!-- Mobile menu markup (see mobile-menu README) -->
        </div>
    </div>
    <div class="site-nav__progress" aria-hidden="true">
        <span class="site-nav__progress-bar"></span>
    </div>
</header>
```

## States & Interactions
- `data-nav-state`: `default`, `scrolled`, `hidden`, `menu`
- Classes applied by JS:
  - `.site-nav--scrolled` – condensed header when past threshold
  - `.site-nav--hidden` – slide-away on downward scroll
  - `.site-nav--menu-open` – locks header while mobile menu is open
  - `.site-nav--focus` – focus-visible styling for keyboard users
- Smooth scrolling respects reduced-motion preferences
- Scroll progress bar reflects page depth

## Usage Checklist
1. Include `/components/navigation/site-nav/site-nav.css`
2. Include `/components/navigation/site-nav/site-nav.js`
3. Include `/components/mobile/mobile-menu/mobile-menu.css` + JS
4. Preserve all class names and structure
5. Document usage in your task entry

