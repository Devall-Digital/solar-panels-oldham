# 🚀 SOLAR PANELS OLDHAM - PROJECT TRACKER

## 🎯 PROJECT VISION

### Core Mission
Create a **futuristic, immersive lead generation website** for solar panel installations in Oldham that floods users' brains with dopamine through interactive experiences while capturing high-quality leads.

### Key Objectives
1. **Lead Generation**: Convert visitors into qualified solar installation leads
2. **User Experience**: Create addictive, dopamine-inducing interactions
3. **Local Focus**: Target Oldham and surrounding areas
4. **Consistency**: Maintain strict component-based architecture
5. **Performance**: Fast, smooth, responsive on all devices

### Target Audience
- Homeowners in Oldham, Saddleworth, and Greater Manchester
- Age 35-65, environmentally conscious or cost-conscious
- Looking to reduce energy bills and increase property value

---

## 🏗️ TECHNICAL ARCHITECTURE

### Stack Limitations (20i Shared Hosting)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+
- **Database**: File-based or MySQL if needed
- **No Node.js**: Cannot use npm, webpack, or build tools on server
- **No WebSockets**: Must use AJAX for real-time features

### Component-Based Architecture
```
Every feature is built from pre-approved components
No custom solutions without updating component library
All interactions follow established patterns
```

### File Structure
```
/
├── index.html                 # Main entry point
├── webhook-deploy.php         # GitHub deployment (DO NOT MODIFY)
├── webhook-config.php         # Webhook configuration (DO NOT MODIFY)
├── PROJECT_TRACKER.md         # This file - single source of truth
├── COMPONENT_LIBRARY.md       # All approved components
├── DEVELOPMENT_RULES.md       # Rules for all agents
├── TASK_REGISTRY.md          # Task assignments and status
│
├── core/                     # Core application files
│   ├── app.js               # Main application controller
│   ├── router.js            # Client-side routing
│   ├── state.js             # State management
│   └── events.js            # Event system
│
├── components/              # Reusable components
│   ├── [component-name]/
│   │   ├── [name].html     # Component markup
│   │   ├── [name].css      # Component styles
│   │   ├── [name].js       # Component logic
│   │   └── README.md       # Component documentation
│   │
│   ├── calculator/          # Solar savings calculator
│   ├── visualizer/          # 3D panel visualizer
│   ├── forms/              # Form components
│   ├── animations/         # Animation components
│   └── ui/                 # UI components
│
├── modules/                # Feature modules
│   ├── lead-capture/       # Lead generation system
│   ├── calculator/         # Calculator module
│   ├── gamification/       # Gamification features
│   └── analytics/          # Analytics tracking
│
├── assets/
│   ├── css/
│   │   ├── main.css       # Global styles
│   │   ├── variables.css  # CSS custom properties
│   │   └── animations.css # Global animations
│   ├── js/
│   │   └── vendor/        # Third-party libraries
│   ├── images/
│   ├── sounds/            # Interaction sounds
│   └── data/              # Static data files
│
├── api/
│   ├── leads.php          # Lead processing
│   ├── calculator.php     # Calculation endpoints
│   ├── config.php         # API configuration
│   └── .htaccess          # API security
│
└── storage/               # File-based storage
    ├── leads/             # Lead data
    └── analytics/         # Analytics data
```

---

## 🎮 DOPAMINE-INDUCING FEATURES

### Core Interactive Elements

1. **Solar Savings Calculator**
   - Real-time calculation as user types
   - Animated money counter
   - Visual representation of savings
   - Shareable results

2. **3D Roof Visualizer**
   - Interactive 3D model
   - Drag to rotate
   - Click to place panels
   - Real-time efficiency display

3. **Gamified Assessment**
   - Progress bar
   - Points/achievements
   - Unlockable content
   - Personalized results

4. **Interactive Timeline**
   - Scroll-triggered animations
   - Before/after comparisons
   - Success stories
   - ROI visualization

5. **Instant Quote Generator**
   - Progressive form
   - Visual feedback
   - Instant results
   - Comparison tool

### Micro-Interactions
- Hover effects with haptic-style feedback
- Satisfying click animations
- Progress celebrations
- Loading states that entertain
- Easter eggs and surprises

---

## 📊 LEAD GENERATION STRATEGY

### Progressive Data Collection
1. **Level 1**: Postcode only (for initial calculation)
2. **Level 2**: Property type and roof orientation
3. **Level 3**: Contact details for detailed quote
4. **Level 4**: Additional preferences and timeline

### Conversion Points
- Exit intent popup
- Scroll-triggered offers
- Interactive tool completion
- Time-based prompts
- Value-locked content

### Lead Quality Scoring
- Engagement level (time, interactions)
- Completeness of data
- Intent signals (calculator usage, etc.)
- Geographic relevance

---

## 🚦 DEVELOPMENT PHASES

### Phase 1: Foundation ✅
- Project structure
- Component library
- Development rules
- Task system

### Phase 2: Core Components 🔄
- Base UI components
- Animation system
- State management
- Routing system

### Phase 3: Interactive Features
- Solar calculator
- 3D visualizer
- Gamification system
- Lead capture flows

### Phase 4: Polish & Optimize
- Performance optimization
- SEO enhancement
- Analytics integration
- A/B testing setup

### Phase 5: Launch & Iterate
- Go live
- Monitor analytics
- Gather feedback
- Continuous improvement

---

## 📋 AGENT TASK CATEGORIES

### Component Development
- Create new components following templates
- Update existing components
- Document component usage
- Test component compatibility

### Feature Implementation
- Implement features using approved components
- Connect components together
- Add module-specific logic
- Ensure feature completeness

### Content Creation
- Write compelling copy
- Create area-specific content
- Develop FAQ content
- Generate testimonials structure

### Integration Tasks
- API endpoint creation
- Form processing setup
- Analytics implementation
- Third-party integrations

### Testing & Optimization
- Cross-browser testing
- Performance optimization
- Accessibility compliance
- Mobile responsiveness

---

## 🎨 DESIGN SYSTEM

### Brand Colors
```css
--primary: #FFD700;        /* Solar gold */
--secondary: #1E3A8A;      /* Deep blue */
--accent: #10B981;         /* Success green */
--dark: #0F172A;           /* Near black */
--light: #F8FAFC;          /* Near white */
--gradient: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
```

### Typography
```css
--font-primary: 'Inter', system-ui, sans-serif;
--font-display: 'Space Grotesk', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Animation Principles
- Use GPU-accelerated properties (transform, opacity)
- 60fps for all animations
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Micro-animations under 300ms
- Major transitions under 600ms

### Interaction Patterns
- Hover: Scale 1.05 + shadow
- Click: Scale 0.98 + ripple
- Loading: Pulse or skeleton
- Success: Confetti or checkmark
- Error: Shake + red highlight

---

## 🔒 SECURITY REQUIREMENTS

### Form Security
- Client-side validation
- Server-side validation
- CSRF protection
- Rate limiting
- Honeypot fields

### Data Protection
- No sensitive data in JavaScript
- Encrypted storage for leads
- GDPR compliance
- Regular data cleanup
- Secure API endpoints

---

## 📈 SUCCESS METRICS

### Technical KPIs
- Page load time < 2 seconds
- Time to interactive < 3 seconds
- Lighthouse score > 90
- Zero JavaScript errors
- Mobile-first responsive

### Business KPIs
- Lead conversion rate > 5%
- Average session duration > 3 minutes
- Engagement rate > 60%
- Bounce rate < 40%
- Lead quality score > 7/10

---

## 🚨 CRITICAL RULES

1. **NO MODIFICATIONS** to webhook-deploy.php or webhook-config.php
2. **ONLY USE** approved components from COMPONENT_LIBRARY.md
3. **FOLLOW** all rules in DEVELOPMENT_RULES.md
4. **UPDATE** TASK_REGISTRY.md when completing tasks
5. **TEST** everything before marking complete

---

**Last Updated**: [Auto-update on save]
**Version**: 1.0.0
**Status**: Active Development
