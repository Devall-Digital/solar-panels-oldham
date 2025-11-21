# 📚 COMPONENT LIBRARY - Solar Panels Oldham

## ⚠️ CRITICAL: READ BEFORE CREATING ANY CODE

**Every piece of UI must use these pre-approved components. NO EXCEPTIONS.**
- If you need a new component, it must be added here first
- Components are immutable - never modify existing components
- Always use the exact structure provided
- All components are tested and optimized

---

## 🎯 COMPONENT USAGE RULES

1. **Copy Exactly**: Copy the component structure exactly as shown
2. **Modify Only**: Only modify content within `{{ variable }}` placeholders
3. **Never Change**: Never change class names, data attributes, or structure
4. **Always Include**: Always include all required files (HTML, CSS, JS)
5. **Document Usage**: Document any component usage in your task

---

## 🧩 UI COMPONENTS

### 1. HERO SECTION
**Purpose**: Main landing area with compelling headline and CTA
**Dopamine Triggers**: Animated particles, counting numbers, hover effects

```html
<!-- Component: Hero Section -->
<section class="hero-section" data-component="hero">
    <div class="hero-particles" id="particles"></div>
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="hero-title-line1">{{ line1 }}</span>
            <span class="hero-title-line2">{{ line2 }}</span>
            <span class="hero-accent">{{ accent }}</span>
        </h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
        <div class="hero-stats">
            <div class="stat-item" data-count="{{ value1 }}">
                <span class="stat-number">0</span>
                <span class="stat-label">{{ label1 }}</span>
            </div>
            <div class="stat-item" data-count="{{ value2 }}">
                <span class="stat-number">0</span>
                <span class="stat-label">{{ label2 }}</span>
            </div>
            <div class="stat-item" data-count="{{ value3 }}">
                <span class="stat-number">0</span>
                <span class="stat-label">{{ label3 }}</span>
            </div>
        </div>
        <div class="hero-cta">
            <button class="btn-primary" data-action="{{ action }}">
                <span class="btn-text">{{ cta_text }}</span>
                <span class="btn-shine"></span>
            </button>
        </div>
    </div>
</section>
```

**Required CSS**: `/components/hero/hero.css`
**Required JS**: `/components/hero/hero.js`
**Variables**:
- `line1`, `line2`, `accent`: Hero title parts
- `subtitle`: Supporting text
- `value1-3`, `label1-3`: Statistics
- `action`: Button action identifier
- `cta_text`: Button text

---

### 2. INTERACTIVE CARD
**Purpose**: Engaging card with 3D hover effect
**Dopamine Triggers**: 3D tilt, glow effect, satisfying hover

```html
<!-- Component: Interactive Card -->
<div class="interactive-card" data-component="card" data-tilt>
    <div class="card-glow"></div>
    <div class="card-inner">
        <div class="card-icon">
            <img src="{{ icon_url }}" alt="{{ icon_alt }}">
        </div>
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-description">{{ description }}</p>
        <div class="card-features">
            <span class="feature-tag">{{ tag1 }}</span>
            <span class="feature-tag">{{ tag2 }}</span>
        </div>
        <button class="card-cta" data-action="{{ action }}">
            {{ cta_text }}
            <span class="arrow">→</span>
        </button>
    </div>
</div>
```

**Required CSS**: `/components/card/interactive-card.css`
**Required JS**: `/components/card/interactive-card.js`
**Variables**:
- `icon_url`, `icon_alt`: Card icon
- `title`: Card heading
- `description`: Card content
- `tag1`, `tag2`: Feature tags
- `action`: Button action
- `cta_text`: Button text

---

### 3. PROGRESS FORM
**Purpose**: Multi-step form with progress indication
**Dopamine Triggers**: Progress bar, step animations, completion celebration

```html
<!-- Component: Progress Form -->
<form class="progress-form" data-component="progress-form" id="{{ form_id }}">
    <div class="form-progress">
        <div class="progress-bar">
            <div class="progress-fill" data-progress="0"></div>
        </div>
        <div class="progress-steps">
            <span class="step active" data-step="1">{{ step1_name }}</span>
            <span class="step" data-step="2">{{ step2_name }}</span>
            <span class="step" data-step="3">{{ step3_name }}</span>
        </div>
    </div>
    
    <div class="form-screens">
        <!-- Step 1 -->
        <div class="form-screen active" data-screen="1">
            <h3 class="screen-title">{{ step1_title }}</h3>
            <div class="form-group">
                {{ step1_fields }}
            </div>
            <button type="button" class="btn-next" data-next="2">
                Continue <span class="arrow">→</span>
            </button>
        </div>
        
        <!-- Step 2 -->
        <div class="form-screen" data-screen="2">
            <h3 class="screen-title">{{ step2_title }}</h3>
            <div class="form-group">
                {{ step2_fields }}
            </div>
            <div class="form-nav">
                <button type="button" class="btn-back" data-prev="1">
                    <span class="arrow">←</span> Back
                </button>
                <button type="button" class="btn-next" data-next="3">
                    Continue <span class="arrow">→</span>
                </button>
            </div>
        </div>
        
        <!-- Step 3 -->
        <div class="form-screen" data-screen="3">
            <h3 class="screen-title">{{ step3_title }}</h3>
            <div class="form-group">
                {{ step3_fields }}
            </div>
            <div class="form-nav">
                <button type="button" class="btn-back" data-prev="2">
                    <span class="arrow">←</span> Back
                </button>
                <button type="submit" class="btn-submit">
                    {{ submit_text }}
                    <span class="spinner"></span>
                </button>
            </div>
        </div>
    </div>
    
    <div class="form-success" style="display: none;">
        <div class="success-animation">
            <svg class="checkmark" viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25"/>
                <path class="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        </div>
        <h3 class="success-title">{{ success_title }}</h3>
        <p class="success-message">{{ success_message }}</p>
    </div>
</form>
```

**Required CSS**: `/components/form/progress-form.css`
**Required JS**: `/components/form/progress-form.js`
**Variables**:
- `form_id`: Unique form identifier
- `step1_name`, `step2_name`, `step3_name`: Step labels
- `step1_title`, `step2_title`, `step3_title`: Step headings
- `step1_fields`, `step2_fields`, `step3_fields`: Field HTML
- `submit_text`: Submit button text
- `success_title`, `success_message`: Completion message

---

### 4. ANIMATED COUNTER
**Purpose**: Number that counts up when visible
**Dopamine Triggers**: Smooth counting animation, easing curve

```html
<!-- Component: Animated Counter -->
<div class="animated-counter" data-component="counter">
    <span class="counter-prefix">{{ prefix }}</span>
    <span class="counter-value" data-target="{{ value }}">0</span>
    <span class="counter-suffix">{{ suffix }}</span>
</div>
```

**Required CSS**: `/components/counter/counter.css`
**Required JS**: `/components/counter/counter.js`
**Variables**:
- `prefix`: Text before number (e.g., "£")
- `value`: Target number
- `suffix`: Text after number (e.g., "/year")

---

### 5. FLOATING CTA BUTTON
**Purpose**: Attention-grabbing call-to-action
**Dopamine Triggers**: Pulse animation, hover morph, click ripple

```html
<!-- Component: Floating CTA -->
<button class="floating-cta" data-component="floating-cta" data-action="{{ action }}">
    <span class="cta-bg"></span>
    <span class="cta-text">{{ text }}</span>
    <span class="cta-icon">{{ icon_svg }}</span>
    <div class="ripple-container"></div>
</button>
```

**Required CSS**: `/components/cta/floating-cta.css`
**Required JS**: `/components/cta/floating-cta.js`
**Variables**:
- `action`: Button action identifier
- `text`: Button text
- `icon_svg`: SVG icon code

---

### 6. TESTIMONIAL CARD
**Purpose**: Social proof with engaging design
**Dopamine Triggers**: Star animations, quote marks, hover effects

```html
<!-- Component: Testimonial Card -->
<div class="testimonial-card" data-component="testimonial">
    <div class="testimonial-stars">
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
    </div>
    <blockquote class="testimonial-text">
        <span class="quote-mark">"</span>
        {{ testimonial }}
        <span class="quote-mark">"</span>
    </blockquote>
    <div class="testimonial-author">
        <img src="{{ avatar }}" alt="{{ name }}" class="author-avatar">
        <div class="author-info">
            <div class="author-name">{{ name }}</div>
            <div class="author-location">{{ location }}</div>
        </div>
    </div>
    <div class="testimonial-metric">
        <span class="metric-value">{{ metric_value }}</span>
        <span class="metric-label">{{ metric_label }}</span>
    </div>
</div>
```

**Required CSS**: `/components/testimonial/testimonial.css`
**Required JS**: `/components/testimonial/testimonial.js`
**Variables**:
- `testimonial`: Review text
- `avatar`: Author image URL
- `name`: Author name
- `location`: Author location
- `metric_value`: Key metric (e.g., "£3,400")
- `metric_label`: Metric description (e.g., "Saved in first year")

---

## 🎮 INTERACTIVE COMPONENTS

### 7. SOLAR CALCULATOR
**Purpose**: Interactive savings calculator
**Dopamine Triggers**: Real-time calculations, animated results, visual feedback

```html
<!-- Component: Solar Calculator -->
<div class="solar-calculator" data-component="calculator">
    <div class="calc-inputs">
        <div class="input-group">
            <label>{{ label1 }}</label>
            <input type="range" class="range-input" 
                   data-input="bill" 
                   min="{{ min1 }}" 
                   max="{{ max1 }}" 
                   value="{{ default1 }}">
            <span class="range-value">£<span data-value="bill">{{ default1 }}</span></span>
        </div>
        
        <div class="input-group">
            <label>{{ label2 }}</label>
            <select class="select-input" data-input="property">
                <option value="terraced">Terraced House</option>
                <option value="semi" selected>Semi-Detached</option>
                <option value="detached">Detached House</option>
                <option value="bungalow">Bungalow</option>
            </select>
        </div>
        
        <div class="input-group">
            <label>{{ label3 }}</label>
            <div class="toggle-group">
                <button class="toggle-option active" data-input="facing" data-value="south">South</button>
                <button class="toggle-option" data-input="facing" data-value="east-west">East/West</button>
                <button class="toggle-option" data-input="facing" data-value="north">North</button>
            </div>
        </div>
    </div>
    
    <div class="calc-results">
        <div class="result-card saving">
            <div class="result-icon">💷</div>
            <div class="result-value">
                £<span data-result="annual">0</span>
            </div>
            <div class="result-label">Annual Savings</div>
        </div>
        
        <div class="result-card roi">
            <div class="result-icon">📈</div>
            <div class="result-value">
                <span data-result="roi">0</span>%
            </div>
            <div class="result-label">Return on Investment</div>
        </div>
        
        <div class="result-card payback">
            <div class="result-icon">⏱️</div>
            <div class="result-value">
                <span data-result="payback">0</span> years
            </div>
            <div class="result-label">Payback Period</div>
        </div>
    </div>
    
    <div class="calc-chart">
        <canvas id="savings-chart"></canvas>
    </div>
    
    <div class="calc-cta">
        <button class="btn-primary" data-action="get-quote">
            Get Your Personalized Quote
            <span class="arrow">→</span>
        </button>
    </div>
</div>
```

**Required CSS**: `/components/calculator/calculator.css`
**Required JS**: `/components/calculator/calculator.js`
**Variables**:
- `label1`, `label2`, `label3`: Input labels
- `min1`, `max1`, `default1`: Range slider values

---

### 8. LOADING ANIMATION
**Purpose**: Entertaining loading state
**Dopamine Triggers**: Smooth animation, progress indication

```html
<!-- Component: Loading Animation -->
<div class="loading-animation" data-component="loader">
    <div class="solar-loader">
        <div class="sun"></div>
        <div class="panel panel-1"></div>
        <div class="panel panel-2"></div>
        <div class="panel panel-3"></div>
    </div>
    <p class="loading-text">{{ text }}</p>
</div>
```

**Required CSS**: `/components/loader/loader.css`
**Required JS**: `/components/loader/loader.js`
**Variables**:
- `text`: Loading message

---

### 9. NOTIFICATION TOAST
**Purpose**: Feedback messages
**Dopamine Triggers**: Slide animation, auto-dismiss, sound effect

```html
<!-- Component: Notification Toast -->
<div class="notification-toast" data-component="toast" data-type="{{ type }}">
    <div class="toast-icon">{{ icon }}</div>
    <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
    </div>
    <button class="toast-close" aria-label="Close">×</button>
    <div class="toast-progress"></div>
</div>
```

**Required CSS**: `/components/toast/toast.css`
**Required JS**: `/components/toast/toast.js`
**Variables**:
- `type`: success, error, warning, info
- `icon`: Icon HTML/emoji
- `title`: Toast heading
- `message`: Toast description

---

## 📦 FORM FIELD COMPONENTS

### 10. ANIMATED INPUT
**Purpose**: Engaging form inputs
**Dopamine Triggers**: Float label, validation animation

```html
<!-- Component: Animated Input -->
<div class="form-field" data-component="form-field">
    <input type="{{ type }}" 
           class="animated-input" 
           id="{{ id }}" 
           name="{{ name }}"
           {{ required }}>
    <label for="{{ id }}" class="animated-label">{{ label }}</label>
    <span class="field-line"></span>
    <span class="field-error">{{ error_message }}</span>
</div>
```

**Required CSS**: `/components/form/animated-input.css`
**Required JS**: `/components/form/animated-input.js`
**Variables**:
- `type`: input type (text, email, tel, etc.)
- `id`: unique field ID
- `name`: field name
- `label`: field label
- `required`: add if required
- `error_message`: validation message

---

## 🎨 ANIMATION COMPONENTS

### 11. SCROLL REVEAL
**Purpose**: Animate elements on scroll
**Dopamine Triggers**: Smooth entrance, stagger effect

```html
<!-- Component: Scroll Reveal -->
<div class="scroll-reveal" 
     data-component="reveal" 
     data-animation="{{ animation }}"
     data-delay="{{ delay }}">
    {{ content }}
</div>
```

**Required CSS**: `/components/animation/scroll-reveal.css`
**Required JS**: `/components/animation/scroll-reveal.js`
**Variables**:
- `animation`: fadeUp, fadeIn, scaleIn, slideLeft, slideRight
- `delay`: delay in ms
- `content`: Any HTML content

---

### 12. PARTICLE BACKGROUND
**Purpose**: Dynamic background effect
**Dopamine Triggers**: Movement, interactivity

```html
<!-- Component: Particle Background -->
<div class="particle-bg" data-component="particles">
    <canvas id="{{ canvas_id }}"></canvas>
</div>
```

**Required CSS**: `/components/particles/particles.css`
**Required JS**: `/components/particles/particles.js`
**Variables**:
- `canvas_id`: Unique canvas identifier

---

## 🔧 UTILITY COMPONENTS

### 13. MODAL DIALOG
**Purpose**: Overlay dialogs
**Dopamine Triggers**: Smooth animation, backdrop blur

```html
<!-- Component: Modal Dialog -->
<div class="modal" data-component="modal" id="{{ modal_id }}">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
        </div>
        <div class="modal-body">
            {{ content }}
        </div>
        <div class="modal-footer">
            {{ footer }}
        </div>
    </div>
</div>
```

**Required CSS**: `/components/modal/modal.css`
**Required JS**: `/components/modal/modal.js`
**Variables**:
- `modal_id`: Unique modal identifier
- `title`: Modal heading
- `content`: Modal body content
- `footer`: Modal footer content

---

## 📱 MOBILE COMPONENTS

### 14. DESKTOP NAVIGATION
**Purpose**: Main site navigation with branding and smooth interactions
**Dopamine Triggers**: Smooth hover effects, logo animation, CTA pulse, sticky reveal

```html
<!-- Component: Desktop Navigation -->
<header class="nav-header" data-component="navigation">
    <nav class="nav-container">
        <div class="nav-brand">
            <a href="/" class="nav-logo" data-action="home">
                <div class="logo-icon">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="var(--primary)" opacity="0.1"/>
                        <path d="M12 20 L20 12 L28 20 L24 20 L24 28 L16 28 L16 20 Z" fill="var(--primary)"/>
                    </svg>
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
                <li class="nav-item">
                    <a href="/calculator" class="nav-link {{ active_calculator }}" data-action="calculator">{{ calculator_text }}</a>
                </li>
                <li class="nav-item">
                    <a href="/services" class="nav-link {{ active_services }}" data-action="services">{{ services_text }}</a>
                </li>
                <li class="nav-item">
                    <a href="/about" class="nav-link {{ active_about }}" data-action="about">{{ about_text }}</a>
                </li>
                <li class="nav-item">
                    <a href="/contact" class="nav-link {{ active_contact }}" data-action="contact">{{ contact_text }}</a>
                </li>
            </ul>
        </div>

        <div class="nav-actions">
            <button class="nav-cta btn-primary" data-action="{{ cta_action }}">
                <span class="btn-text">{{ cta_text }}</span>
                <span class="btn-shine"></span>
            </button>
            <button class="menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>
        </div>

        <!-- Mobile Menu Panel -->
        <div class="mobile-menu-panel">
            <div class="mobile-menu-header">
                <div class="mobile-logo">
                    <div class="logo-icon">
                        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="14" fill="var(--primary)" opacity="0.1"/>
                            <path d="M9.6 16 L16 9.6 L22.4 16 L19.2 16 L19.2 22.4 L12.8 22.4 L12.8 16 Z" fill="var(--primary)"/>
                        </svg>
                    </div>
                    <span class="mobile-logo-text">{{ brand_name }}</span>
                </div>
                <button class="mobile-menu-close" aria-label="Close menu">×</button>
            </div>
            <ul class="mobile-nav-links">
                <li class="mobile-nav-item">
                    <a href="/" class="mobile-nav-link {{ mobile_active_home }}" data-action="home">{{ home_text }}</a>
                </li>
                <li class="mobile-nav-item">
                    <a href="/calculator" class="mobile-nav-link {{ mobile_active_calculator }}" data-action="calculator">{{ calculator_text }}</a>
                </li>
                <li class="mobile-nav-item">
                    <a href="/services" class="mobile-nav-link {{ mobile_active_services }}" data-action="services">{{ services_text }}</a>
                </li>
                <li class="mobile-nav-item">
                    <a href="/about" class="mobile-nav-link {{ mobile_active_about }}" data-action="about">{{ about_text }}</a>
                </li>
                <li class="mobile-nav-item">
                    <a href="/contact" class="mobile-nav-link {{ mobile_active_contact }}" data-action="contact">{{ contact_text }}</a>
                </li>
            </ul>
            <div class="mobile-menu-footer">
                <button class="mobile-cta btn-primary" data-action="{{ mobile_cta_action }}">
                    <span class="btn-text">{{ mobile_cta_text }}</span>
                    <span class="btn-shine"></span>
                </button>
            </div>
        </div>
    </nav>
</header>
```

**Required CSS**: `/components/nav/nav.css`
**Required JS**: `/components/nav/nav.js`
**Variables**:
- `brand_name`: Company name (e.g., "Solar Panels Oldham")
- `tagline`: Brand tagline (e.g., "Future Energy")
- `home_text`, `calculator_text`, `services_text`, `about_text`, `contact_text`: Navigation labels
- `active_home`, `active_calculator`, etc.: Add "active" class for current page
- `cta_action`: Primary CTA action identifier
- `cta_text`: Primary CTA button text
- `mobile_cta_action`, `mobile_cta_text`: Mobile CTA variations

---

### 15. MOBILE MENU
**Purpose**: Responsive navigation
**Dopamine Triggers**: Smooth slide, hamburger animation

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
            {{ menu_items }}
        </ul>
    </nav>
</div>
```

**Required CSS**: `/components/mobile/mobile-menu.css`
**Required JS**: `/components/mobile/mobile-menu.js`
**Variables**:
- `menu_items`: List items HTML

---

## 🚀 COMPONENT INITIALIZATION

**All components must be initialized in your module:**

```javascript
// Initialize all components on page
import { initComponents } from '/core/components.js';

document.addEventListener('DOMContentLoaded', () => {
    initComponents();
});
```

---

## 📋 COMPONENT CHECKLIST

Before using any component:
- [ ] Copy the exact HTML structure
- [ ] Include the required CSS file
- [ ] Include the required JS file
- [ ] Replace only the {{ variables }}
- [ ] Test the component works
- [ ] Document usage in your task

---

## 🚨 VIOLATION PENALTIES

**Creating custom UI without using these components will result in:**
1. Task rejection
2. Code rollback
3. Required refactoring
4. Potential agent replacement

**This is your only warning.**
