# 📏 DEVELOPMENT RULES - MANDATORY FOR ALL AGENTS

## 🚨 CRITICAL: THESE RULES ARE NON-NEGOTIABLE

Violation of these rules will result in immediate task rejection and code rollback.

---

## 🎯 RULE 1: COMPONENT-FIRST DEVELOPMENT

### ALWAYS:
- ✅ Use components from COMPONENT_LIBRARY.md
- ✅ Copy component structure EXACTLY
- ✅ Only modify content within {{ placeholders }}
- ✅ Include all required CSS and JS files

### NEVER:
- ❌ Create custom UI elements from scratch
- ❌ Modify component class names or structure
- ❌ Skip component documentation
- ❌ Mix components from different categories

**Example Violation:**
```html
<!-- WRONG: Custom button -->
<button class="my-custom-btn">Click me</button>

<!-- CORRECT: Using component -->
<button class="btn-primary" data-action="custom">
    <span class="btn-text">Click me</span>
    <span class="btn-shine"></span>
</button>
```

---

## 📁 RULE 2: FILE STRUCTURE COMPLIANCE

### File Naming Convention:
```
components/[component-name]/[component-name].[ext]
modules/[module-name]/[module-name].[ext]
api/[endpoint-name].php
```

### Required File Headers:
```javascript
/**
 * Component: [Component Name]
 * Module: [Module Name]
 * Purpose: [Brief description]
 * Dependencies: [List dependencies]
 * Author: [Agent/Task ID]
 * Date: [Creation date]
 */
```

### CSS Organization:
```css
/* Component: [Name] */
/* Dependencies: [List] */

/* Variables */
.component-name {
    --component-primary: value;
    --component-secondary: value;
}

/* Base Styles */
.component-name { }

/* State Classes */
.component-name.is-active { }
.component-name.is-loading { }

/* Responsive */
@media (max-width: 768px) { }
```

---

## 💾 RULE 3: STATE MANAGEMENT

### Global State Rules:
```javascript
// ALWAYS use the state manager
import { state, setState, subscribe } from '/core/state.js';

// NEVER use global variables
// WRONG:
window.userPrefs = { theme: 'dark' };

// CORRECT:
setState('userPrefs', { theme: 'dark' });
```

### Component State:
```javascript
// Components must be self-contained
class ComponentName {
    constructor(element) {
        this.element = element;
        this.state = {
            isActive: false,
            data: null
        };
    }
    
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.render();
    }
}
```

---

## 🔒 RULE 4: SECURITY REQUIREMENTS

### Input Validation:
```javascript
// ALWAYS validate on client AND server
// Client-side:
function validateInput(input) {
    const cleaned = DOMPurify.sanitize(input);
    const pattern = /^[a-zA-Z0-9\s\-\.]+$/;
    return pattern.test(cleaned) ? cleaned : false;
}

// Server-side (PHP):
$input = filter_var($_POST['input'], FILTER_SANITIZE_STRING);
if (!preg_match("/^[a-zA-Z0-9\s\-\.]+$/", $input)) {
    die('Invalid input');
}
```

### API Security:
```php
// ALWAYS include these in API endpoints:
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// CSRF Protection
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        die(json_encode(['error' => 'Invalid token']));
    }
}
```

---

## 🎨 RULE 5: STYLING GUIDELINES

### CSS Variables:
```css
/* ALWAYS use design system variables */
color: var(--primary);        /* NEVER: color: #FFD700; */
font-family: var(--font-primary);
animation-duration: var(--duration-normal);
```

### Animation Performance:
```css
/* ONLY animate these properties: */
.element {
    transform: translateX(0);
    opacity: 1;
    will-change: transform, opacity;
}

/* NEVER animate these: */
/* width, height, padding, margin, top, left */
```

### Mobile First:
```css
/* Base styles = mobile */
.component { 
    padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .component { 
        padding: 2rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .component { 
        padding: 3rem;
    }
}
```

---

## 🚀 RULE 6: PERFORMANCE STANDARDS

### JavaScript Loading:
```html
<!-- ALWAYS defer or async -->
<script src="/core/app.js" defer></script>
<script src="/modules/feature.js" async></script>

<!-- NEVER blocking scripts in head -->
<!-- WRONG: <script src="script.js"></script> -->
```

### Image Optimization:
```html
<!-- ALWAYS use lazy loading and proper sizing -->
<img 
    src="placeholder.jpg" 
    data-src="actual-image.jpg" 
    loading="lazy"
    width="800"
    height="600"
    alt="Descriptive alt text">

<!-- NEVER images without dimensions -->
```

### Code Splitting:
```javascript
// Load modules only when needed
async function loadCalculator() {
    const module = await import('/modules/calculator/calculator.js');
    return new module.Calculator();
}

// Initialize on user interaction
button.addEventListener('click', async () => {
    const calculator = await loadCalculator();
    calculator.init();
});
```

---

## 📝 RULE 7: DOCUMENTATION

### Required Documentation:
1. **Component Usage**: Document in component's README.md
2. **API Endpoints**: Document request/response format
3. **Complex Logic**: Add inline comments
4. **Dependencies**: List all external dependencies

### Comment Format:
```javascript
/**
 * Calculate solar panel efficiency based on orientation
 * @param {string} orientation - Roof orientation (north|south|east|west)
 * @param {number} angle - Roof angle in degrees
 * @returns {number} Efficiency percentage
 */
function calculateEfficiency(orientation, angle) {
    // South-facing roofs have optimal efficiency
    const orientationMultiplier = {
        south: 1.0,
        east: 0.85,
        west: 0.85,
        north: 0.65
    };
    
    // Optimal angle is between 30-40 degrees
    const angleEfficiency = angle >= 30 && angle <= 40 ? 1.0 : 0.9;
    
    return orientationMultiplier[orientation] * angleEfficiency * 100;
}
```

---

## ✅ RULE 8: TESTING REQUIREMENTS

### Before Marking Complete:
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (real or emulated)
- [ ] Test with JavaScript disabled (graceful degradation)
- [ ] Test all interactive states
- [ ] Verify no console errors
- [ ] Check accessibility (keyboard navigation)
- [ ] Validate HTML/CSS
- [ ] Test form submissions
- [ ] Verify loading states
- [ ] Check error handling

### Browser Testing Matrix:
```
Desktop:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile:
- iOS Safari (iPhone/iPad)
- Android Chrome
- Samsung Internet
```

---

## 📋 RULE 9: TASK COMPLETION

### Before Closing a Task:
1. ✅ All acceptance criteria met
2. ✅ Component library followed
3. ✅ No linting errors
4. ✅ Documentation updated
5. ✅ Code reviewed against these rules
6. ✅ TASK_REGISTRY.md updated
7. ✅ No console errors
8. ✅ Performance targets met

### Task Status Updates:
```markdown
## Task: [Task Name]
- Status: In Progress → Testing → Completed
- Started: [Date/Time]
- Completed: [Date/Time]
- Components Used: [List]
- Files Modified: [List]
- Testing Notes: [Results]
```

---

## 🚨 RULE 10: FORBIDDEN PRACTICES

### NEVER DO THESE:
1. ❌ Inline styles (use classes)
2. ❌ Important! in CSS (fix specificity)
3. ❌ document.write()
4. ❌ eval() or new Function()
5. ❌ Synchronous XHR/fetch
6. ❌ Global event listeners without cleanup
7. ❌ Memory leaks (remove listeners)
8. ❌ Hard-coded values (use config)
9. ❌ Console.log in production
10. ❌ Commented-out code

### Code Cleanup:
```javascript
// WRONG: Leaving test code
// console.log('testing');
doSomething();
// console.log('done');

// CORRECT: Remove before commit
doSomething();
```

---

## 💡 RULE 11: INNOVATION WITHIN BOUNDARIES

### You CAN:
- ✅ Combine components creatively
- ✅ Add new components (update library first)
- ✅ Enhance animations (following performance rules)
- ✅ Improve accessibility
- ✅ Optimize performance

### You CANNOT:
- ❌ Break component structure
- ❌ Ignore design system
- ❌ Skip documentation
- ❌ Bypass security rules
- ❌ Compromise performance

---

## 🎯 RULE 12: CONFLICT RESOLUTION

### When Requirements Conflict:
1. **Performance > Features** - Fast site over complex features
2. **Security > Convenience** - Secure forms over easy input
3. **Accessibility > Aesthetics** - Usable over pretty
4. **Mobile > Desktop** - Mobile experience first
5. **Components > Custom** - Reuse over recreation

### Escalation Process:
1. Check PROJECT_TRACKER.md for guidance
2. Check COMPONENT_LIBRARY.md for patterns
3. Follow established patterns
4. Document decision in task notes

---

## 📊 PERFORMANCE BUDGETS

### Required Metrics:
- Page Load: < 2 seconds
- Time to Interactive: < 3 seconds
- First Contentful Paint: < 1 second
- JavaScript Bundle: < 100KB (minified)
- CSS Bundle: < 50KB (minified)
- Images: < 500KB per page

### Monitoring:
```javascript
// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (loadTime > 2000) {
            console.warn('Page load exceeded 2 seconds:', loadTime);
        }
    });
}
```

---

## 🏁 FINAL CHECKLIST

Before ANY commit:
- [ ] Follows component library
- [ ] Passes all rules above
- [ ] No console errors
- [ ] Tested on all browsers
- [ ] Documentation complete
- [ ] Task registry updated
- [ ] Code is production-ready

**Remember: These rules ensure consistency, quality, and prevent the "all over the place" issue. Follow them exactly.**
