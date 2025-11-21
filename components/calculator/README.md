# Solar Calculator Component

## Overview

The Solar Calculator is an interactive component that allows users to calculate potential solar panel savings based on their current energy bill, property type, and roof orientation. It provides real-time calculations with visual feedback and includes a savings projection chart.

## Features

- **Real-time Calculations**: Updates results as user inputs change
- **Interactive Inputs**: Range slider, dropdown, and toggle buttons
- **Visual Feedback**: Animated result counters and chart visualization
- **Form Validation**: Client-side validation with error messaging
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Visual feedback during calculations
- **Error Handling**: Graceful error states and recovery

## Files

```
components/calculator/
├── calculator.js       # Main component logic
├── calculator.css      # Component styling
└── README.md          # This documentation
```

## Dependencies

- **Chart.js**: For savings visualization chart (loaded via CDN)
- **Core Components**: Requires the component system to be initialized
- **API Endpoint**: `/api/calculator.php` for server-side calculations

## Usage

### HTML Structure

```html
<div class="solar-calculator" data-component="calculator">
    <div class="calc-inputs">
        <div class="input-group">
            <label>Monthly Energy Bill (£)</label>
            <input type="range" class="range-input"
                   data-input="bill"
                   min="50"
                   max="1000"
                   value="250">
            <span class="range-value">£<span data-value="bill">250</span></span>
        </div>

        <div class="input-group">
            <label>Property Type</label>
            <select class="select-input" data-input="property">
                <option value="terraced">Terraced House</option>
                <option value="semi" selected>Semi-Detached</option>
                <option value="detached">Detached House</option>
                <option value="bungalow">Bungalow</option>
            </select>
        </div>

        <div class="input-group">
            <label>Roof Orientation</label>
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
            <div class="result-value">£<span data-result="annual">0</span></div>
            <div class="result-label">Annual Savings</div>
        </div>

        <div class="result-card roi">
            <div class="result-icon">📈</div>
            <div class="result-value"><span data-result="roi">0</span>%</div>
            <div class="result-label">Return on Investment</div>
        </div>

        <div class="result-card payback">
            <div class="result-icon">⏱️</div>
            <div class="result-value"><span data-result="payback">0</span> years</div>
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

### CSS Dependencies

Include the component CSS in your HTML:

```html
<link rel="stylesheet" href="/components/calculator/calculator.css">
```

### JavaScript Dependencies

Include the component JavaScript:

```html
<script src="/components/calculator/calculator.js" defer></script>
```

### Initialization

The component auto-initializes on DOMContentLoaded, but you can also manually initialize:

```javascript
// Auto-initialization happens automatically
// Or manually initialize specific calculators
const calculators = document.querySelectorAll('[data-component="calculator"]');
calculators.forEach(calc => new SolarCalculator(calc));
```

## Configuration

### Input Ranges

- **Monthly Bill**: 50-1000 GBP (default: 250)
- **Property Types**: terraced, semi, detached, bungalow
- **Roof Facing**: south, east-west, east, west, north

### Calculation Factors

The calculator uses realistic UK solar panel calculations:

- **Generation Factors**: Based on orientation (south = 950 kWh/kWp/year)
- **Energy Prices**: £0.28/kWh (current UK average)
- **Export Rate**: £0.15/kWh (Smart Export Guarantee)
- **System Costs**: £1,800/kWp installed
- **Self-Consumption**: 50% of generation

## API Integration

### Request Format

```javascript
POST /api/calculator.php
Content-Type: application/json

{
    "bill": 250,
    "property": "semi",
    "facing": "south"
}
```

### Response Format

```json
{
    "success": true,
    "data": {
        "capacity": 4.5,
        "annualGeneration": 4275,
        "annualSavings": 798,
        "systemCost": 8100,
        "roi": 9.9,
        "paybackYears": 10.1,
        "co2Savings": 1935,
        "treesEquivalent": 9.7,
        "monthlyBillReduction": 175,
        "twentyFiveYearSavings": 19950
    },
    "timestamp": "2025-11-21 10:30:00",
    "version": "1.0"
}
```

## Events

### Calculator Events

The component dispatches custom events:

```javascript
// Listen for quote requests
document.addEventListener('calculator:quote-request', (e) => {
    const { calculatorData, results } = e.detail;
    // Handle lead capture
});

// Listen for calculations
document.addEventListener('calculator:calculate', (e) => {
    const { bill, property, facing } = e.detail;
    // Track analytics
});
```

## Accessibility

- **Keyboard Navigation**: All inputs are keyboard accessible
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Logical tab order
- **Color Contrast**: Meets WCAG AA standards
- **Error Announcements**: Screen reader error announcements

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Bundle Size**: ~15KB minified (component only)
- **Load Time**: < 100ms initialization
- **Animation**: 60fps smooth animations
- **Memory**: Efficient event cleanup

## Customization

### Styling Variables

Override CSS custom properties for theming:

```css
.solar-calculator {
    --calculator-primary: #your-color;
    --calculator-accent: #your-accent;
}
```

### Calculation Factors

Modify calculation factors in `/api/calculator.php`:

```php
// Adjust energy prices, system costs, etc.
private $energyPrice = 0.28; // Your local rate
private $systemCostPerKwp = 1800; // Your installation cost
```

## Testing

### Manual Testing

1. **Input Validation**: Test min/max values and invalid inputs
2. **Calculations**: Verify results with known values
3. **Chart Rendering**: Ensure Chart.js loads and displays correctly
4. **Responsive**: Test on mobile and desktop
5. **Accessibility**: Test with keyboard and screen readers

### Automated Testing

```javascript
// Example test structure
describe('SolarCalculator', () => {
    it('should calculate savings correctly', async () => {
        const calc = new SolarCalculator(element);
        calc.currentData = { bill: 250, property: 'semi', facing: 'south' };

        await calc.calculate();

        const annualSavings = element.querySelector('[data-result="annual"]');
        expect(parseInt(annualSavings.textContent)).toBeGreaterThan(0);
    });
});
```

## Troubleshooting

### Common Issues

1. **Chart not loading**: Ensure Chart.js CDN is accessible
2. **Calculations failing**: Check API endpoint and PHP configuration
3. **Styling issues**: Verify CSS custom properties are defined
4. **Performance problems**: Check for memory leaks in event listeners

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('calculator_debug', 'true');
location.reload();
```

## Version History

- **v1.0.0**: Initial release with full functionality
  - Real-time calculations
  - Chart visualization
  - Form validation
  - Error handling
  - Responsive design
  - Accessibility features

## Future Enhancements

- **Advanced Analytics**: More detailed savings breakdowns
- **Location Integration**: GPS-based efficiency calculations
- **Comparison Tools**: Side-by-side system comparisons
- **Export Features**: PDF reports and data export
- **Integration**: CRM and lead management system integration
