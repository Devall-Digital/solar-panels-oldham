/**
 * Solar Calculator Component
 * Futuristic, interactive calculator with real-time updates
 */

class SolarCalculator {
  constructor(element) {
    this.element = element;
    this.state = {
      monthlyBill: 120,
      propertyType: 'semi',
      roofOrientation: 'south',
      systemSize: null, // Auto-calculated
      investmentPeriod: 25
    };
    this.previousResults = {};
    this.animationTimeouts = [];
    this.initialized = false;
  }

  async init() {
    try {
      console.log('Initializing Solar Calculator component');

      // Load HTML content
      await this.loadHTML();

      // Set up event listeners
      this.setupEventListeners();

      // Initialize calculator state
      this.loadSavedState();

      // Update UI with initial state
      this.updateUI();

      // Calculate initial results
      this.calculateSavings();

      // Initialize particle effects
      this.initParticles();

      // Start real-time updates
      this.startRealTimeUpdates();

      this.initialized = true;
      console.log('Solar Calculator component initialized successfully');

      // Emit ready event
      emit('calculator:ready', { component: this });

    } catch (error) {
      console.error('Solar Calculator initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load HTML content
   */
  async loadHTML() {
    try {
      const response = await fetch('/components/calculator/calculator.html');
      const html = await response.text();
      this.element.innerHTML = html;
    } catch (error) {
      console.error('Failed to load calculator HTML:', error);
      // Fallback: create basic structure
      this.createFallbackStructure();
    }
  }

  /**
   * Create fallback structure if HTML loading fails
   */
  createFallbackStructure() {
    this.element.innerHTML = `
      <div class="solar-calculator-futuristic" id="solar-calculator">
        <div class="control-panel">
          <div class="panel-header">
            <div class="panel-icon">⚡</div>
            <h3 class="panel-title">Energy Configuration</h3>
          </div>
          <div class="controls-grid">
            <div class="control-group">
              <label class="control-label">
                <span class="label-icon">💡</span>
                Monthly Electricity Bill
              </label>
              <div class="slider-container-futuristic">
                <input type="range" min="50" max="500" value="120" step="5" class="futuristic-slider" data-input="bill" id="bill-slider">
                <div class="slider-track">
                  <div class="slider-fill" id="bill-fill"></div>
                </div>
                <div class="slider-value-display">
                  <span class="currency-symbol">£</span>
                  <span class="value-number" data-value="bill">120</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="results-dashboard">
          <div class="dashboard-header">
            <div class="dashboard-icon">📊</div>
            <h3 class="dashboard-title">Energy Savings Analysis</h3>
          </div>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">💰</div>
              <div class="metric-content">
                <div class="metric-value">£<span data-result="annual">0</span></div>
                <div class="metric-label">Annual Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Bill slider
    const billSlider = this.element.querySelector('#bill-slider');
    if (billSlider) {
      billSlider.addEventListener('input', (e) => {
        this.updateBill(parseFloat(e.target.value));
      });
    }

    // Property type buttons
    const propertyButtons = this.element.querySelectorAll('[data-property]');
    propertyButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectProperty(button.dataset.property);
      });
    });

    // Orientation buttons
    const orientationButtons = this.element.querySelectorAll('[data-orientation]');
    orientationButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectOrientation(button.dataset.orientation);
      });
    });

    // Size buttons
    const sizeButtons = this.element.querySelectorAll('[data-size]');
    sizeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectSize(button.dataset.size);
      });
    });

    // Chart toggle buttons
    const chartButtons = this.element.querySelectorAll('.chart-toggle');
    chartButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectChart(button.dataset.chart);
      });
    });
  }

  /**
   * Update electricity bill
   */
  updateBill(value) {
    this.state.monthlyBill = value;
    this.createSliderParticles();
    this.calculateSavings();
    this.saveState();
  }

  /**
   * Select property type
   */
  selectProperty(type) {
    // Update UI
    this.element.querySelectorAll('[data-property]').forEach(btn => {
      btn.classList.remove('active');
    });
    this.element.querySelector(`[data-property="${type}"]`).classList.add('active');

    // Update state
    this.state.propertyType = type;
    this.createButtonParticles(this.element.querySelector(`[data-property="${type}"]`));
    this.calculateSavings();
    this.saveState();
  }

  /**
   * Select roof orientation
   */
  selectOrientation(orientation) {
    // Update UI
    this.element.querySelectorAll('[data-orientation]').forEach(btn => {
      btn.classList.remove('active');
    });
    this.element.querySelector(`[data-orientation="${orientation}"]`).classList.add('active');

    // Update state
    this.state.roofOrientation = orientation;
    this.createButtonParticles(this.element.querySelector(`[data-orientation="${orientation}"]`));
    this.updateSunPosition(orientation);
    this.calculateSavings();
    this.saveState();
  }

  /**
   * Select system size
   */
  selectSize(size) {
    // Update UI
    this.element.querySelectorAll('[data-size]').forEach(btn => {
      btn.classList.remove('active');
    });
    this.element.querySelector(`[data-size="${size}"]`).classList.add('active');

    // Update state
    this.state.systemSizeOverride = size === 'auto' ? null : parseFloat(size);
    this.createButtonParticles(this.element.querySelector(`[data-size="${size}"]`));
    this.updateSolarPanels(this.state.systemSizeOverride);
    this.calculateSavings();
    this.saveState();
  }

  /**
   * Select chart type
   */
  selectChart(chartType) {
    // Update UI
    this.element.querySelectorAll('.chart-toggle').forEach(btn => {
      btn.classList.remove('active');
    });
    this.element.querySelector(`[data-chart="${chartType}"]`).classList.add('active');

    // Update chart
    this.currentChartType = chartType;
    this.updateChart();
  }

  /**
   * Calculate solar savings
   */
  calculateSavings() {
    // Get system specifications
    const systemSpecs = {
      terraced: { size: 2.5, cost: 3800 },
      semi: { size: 3.5, cost: 4800 },
      detached: { size: 4.5, cost: 6200 },
      bungalow: { size: 4.0, cost: 5500 }
    };

    const system = systemSpecs[this.state.propertyType] || systemSpecs.semi;

    // Apply size override if set
    const systemSize = this.state.systemSizeOverride || system.size;
    const systemCost = this.state.systemSizeOverride ?
      systemCost * (this.state.systemSizeOverride / system.size) : system.cost;

    // Orientation efficiency
    const orientationFactors = {
      south: 1.0,
      'east-west': 0.75,
      north: 0.5
    };

    const orientationFactor = orientationFactors[this.state.roofOrientation] || 1.0;

    // Calculations
    const annualBill = this.state.monthlyBill * 12;
    const annualGeneration = systemSize * 900 * orientationFactor; // kWh
    const selfConsumption = annualGeneration * 0.65;
    const savingsFromConsumption = selfConsumption * 0.34; // £/kWh
    const exported = annualGeneration * 0.35;
    const earningsFromExport = exported * 0.15; // Smart Export Guarantee
    const totalAnnualSavings = savingsFromConsumption + earningsFromExport;
    const realisticSavings = Math.min(totalAnnualSavings, annualBill * 0.8);

    // ROI calculation
    const paybackYears = systemCost / realisticSavings;
    const totalSavings25Years = realisticSavings * 25;
    const netBenefit25Years = totalSavings25Years - systemCost;
    const roi25Year = netBenefit25Years / systemCost * 100;

    // Update results
    const results = {
      annualSavings: Math.round(realisticSavings),
      systemSize: systemSize.toFixed(1),
      systemCost: Math.round(systemCost).toLocaleString(),
      paybackYears: paybackYears.toFixed(1),
      roi: Math.round(Math.max(0, Math.min(roi25Year, 25))),
      annualGeneration: Math.round(annualGeneration)
    };

    this.updateResults(results);
    this.updateChart();
  }

  /**
   * Update results display
   */
  updateResults(results) {
    // Animate each metric
    this.animateMetric('annual', results.annualSavings, (v) => `£${Math.floor(v).toLocaleString()}`);
    this.animateMetric('roi', results.roi, (v) => `${Math.floor(v)}%`);
    this.animateMetric('payback', results.paybackYears, (v) => `${parseFloat(v).toFixed(1)} years`);
    this.animateMetric('systemSize', parseFloat(results.systemSize), (v) => v.toFixed(1));
    this.animateMetric('systemCost', parseInt(results.systemCost.replace(/,/g, '')), (v) => `£${v.toLocaleString()}`);
    this.animateMetric('annualGeneration', results.annualGeneration, (v) => Math.round(v).toLocaleString());

    // Update trend indicators
    this.updateTrends(results);

    // Trigger dopamine effects
    this.animateResultsUpdate();

    // Store for next calculation
    this.previousResults = { ...results };
  }

  /**
   * Animate individual metric
   */
  animateMetric(selector, targetValue, formatter = (v) => v.toString()) {
    const element = this.element.querySelector(`[data-result="${selector}"]`);
    if (!element) return;

    const startValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValue + (targetValue - startValue) * easedProgress;
      element.textContent = formatter(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Update trend indicators
   */
  updateTrends(results) {
    const metrics = ['annual', 'roi', 'payback'];

    metrics.forEach(metric => {
      const trendElement = this.element.querySelector(`[data-trend="${metric}"]`);
      if (!trendElement || !this.previousResults[metric]) return;

      const current = results[metric];
      const previous = this.previousResults[metric];
      const change = current - previous;
      const percentage = Math.abs(previous) > 0 ? (change / previous) * 100 : 0;

      if (Math.abs(percentage) > 1) {
        const isPositive = change > 0;
        trendElement.textContent = `${isPositive ? '↗️' : '↘️'} ${Math.abs(percentage).toFixed(1)}%`;
        trendElement.style.color = isPositive ? '#10b981' : '#ef4444';
        trendElement.style.animation = 'trendPulse 0.5s ease-out';
      }
    });
  }

  /**
   * Animate results update
   */
  animateResultsUpdate() {
    const cards = this.element.querySelectorAll('.metric-card');
    cards.forEach((card, index) => {
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = `cardUpdate 0.6s ease-out ${index * 0.1}s`;
      }, 10);
    });
  }

  /**
   * Update sun position visualization
   */
  updateSunPosition(orientation) {
    const sun = this.element.querySelector('#sun-position');
    if (!sun) return;

    const positions = {
      'south': 'right: 20px; top: -20px;',
      'east-west': 'left: 50%; top: -20px; transform: translateX(-50%);',
      'north': 'left: 20px; top: -20px;'
    };

    sun.style.cssText = positions[orientation] || positions['south'];
  }

  /**
   * Update solar panel visualization
   */
  updateSolarPanels(sizeOverride) {
    const container = this.element.querySelector('#solar-panels-viz');
    if (!container) return;

    // Clear existing panels
    container.innerHTML = '';

    // Calculate panel count
    const systemSize = sizeOverride || this.getSystemSize();
    const panelCount = Math.max(2, Math.min(8, Math.round(systemSize / 0.5)));

    for (let i = 0; i < panelCount; i++) {
      const panel = document.createElement('div');
      panel.className = 'solar-panel';
      panel.style.animationDelay = (i * 0.1) + 's';
      container.appendChild(panel);
    }
  }

  /**
   * Get current system size
   */
  getSystemSize() {
    const specs = {
      terraced: 2.5,
      semi: 3.5,
      detached: 4.5,
      bungalow: 4.0
    };
    return specs[this.state.propertyType] || 3.5;
  }

  /**
   * Initialize particle effects
   */
  initParticles() {
    const particleContainer = this.element.querySelector('#calculator-particles');
    if (particleContainer) {
      this.createAmbientParticles(particleContainer, 20);
    }
  }

  /**
   * Create ambient particles
   */
  createAmbientParticles(container, count) {
    const colors = ['#00BFFF', '#FFD700', '#FF4500', '#10B981'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'ambient-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      container.appendChild(particle);
    }
  }

  /**
   * Create slider particles
   */
  createSliderParticles() {
    const slider = this.element.querySelector('#bill-slider');
    if (!slider) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'slider-particle';
      particle.style.left = (slider.offsetLeft + slider.offsetWidth * (this.state.monthlyBill - 50) / (500 - 50)) + 'px';
      particle.style.top = (slider.offsetTop + slider.offsetHeight / 2) + 'px';
      particle.style.background = ['#FFD700', '#00BFFF', '#FF4500'][Math.floor(Math.random() * 3)];

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1000);
    }
  }

  /**
   * Create button particles
   */
  createButtonParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'button-particle';

      const angle = (i / 8) * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
      particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
      particle.style.background = ['#FFD700', '#00BFFF', '#FF4500', '#10B981'][Math.floor(Math.random() * 4)];

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1000);
    }
  }

  /**
   * Update chart display
   */
  updateChart() {
    // For now, just update with current data
    // In a full implementation, this would render different chart types
    const results = this.previousResults;
    if (results.annualSavings) {
      this.drawChart(results.annualSavings);
    }
  }

  /**
   * Draw savings chart
   */
  drawChart(annualSavings) {
    // Simple chart implementation - could be enhanced with Chart.js
    const canvas = this.element.querySelector('#savings-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw simple bar chart
    const barWidth = 40;
    const barSpacing = 20;
    const maxHeight = height - 40;

    // Sample data: Year 1, 5, 10, 15, 20, 25
    const years = [1, 5, 10, 15, 20, 25];
    const cumulativeSavings = years.map(year => annualSavings * year);

    const maxValue = Math.max(...cumulativeSavings);

    years.forEach((year, index) => {
      const x = 50 + index * (barWidth + barSpacing);
      const barHeight = (cumulativeSavings[index] / maxValue) * maxHeight;
      const y = height - 30 - barHeight;

      // Draw bar
      ctx.fillStyle = '#00BFFF';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(year.toString(), x + barWidth / 2, height - 10);
    });
  }

  /**
   * Start real-time updates
   */
  startRealTimeUpdates() {
    // Update UI to match state
    this.updateUI();
  }

  /**
   * Update UI to match state
   */
  updateUI() {
    // Update slider
    const slider = this.element.querySelector('#bill-slider');
    const sliderValue = this.element.querySelector('[data-value="bill"]');
    if (slider && sliderValue) {
      slider.value = this.state.monthlyBill;
      sliderValue.textContent = this.state.monthlyBill;
      this.updateSliderFill();
    }

    // Update property selection
    this.element.querySelectorAll('[data-property]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.property === this.state.propertyType);
    });

    // Update orientation selection
    this.element.querySelectorAll('[data-orientation]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.orientation === this.state.roofOrientation);
    });

    // Update size selection
    this.element.querySelectorAll('[data-size]').forEach(btn => {
      const size = btn.dataset.size === 'auto' ? null : parseFloat(btn.dataset.size);
      btn.classList.toggle('active', size === this.state.systemSizeOverride);
    });
  }

  /**
   * Update slider fill
   */
  updateSliderFill() {
    const slider = this.element.querySelector('#bill-slider');
    const fill = this.element.querySelector('#bill-fill');
    if (slider && fill) {
      const percentage = ((this.state.monthlyBill - 50) / (500 - 50)) * 100;
      fill.style.width = `${percentage}%`;
    }
  }

  /**
   * Load saved state
   */
  loadSavedState() {
    const saved = getState('calculator');
    if (saved) {
      this.state = { ...this.state, ...saved };
    }
  }

  /**
   * Save state
   */
  saveState() {
    setState('calculator', this.state);
  }

  /**
   * Destroy component
   */
  destroy() {
    // Clear timeouts
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));

    this.initialized = false;
    console.log('Solar Calculator component destroyed');
  }
}

// Export for use in other modules
export default SolarCalculator;

// Make available globally
window.SolarCalculator = SolarCalculator;
