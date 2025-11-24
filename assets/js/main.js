/**
 * Solar Panels Oldham - Main Application
 * Futuristic Electricity Theme | Dopamine-Inducing Experience
 */

// Global application state
const App = {
  initialized: false,
  modules: new Map(),
  observers: new Map(),

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🚀 Initializing Solar Panels Oldham...');

      // Initialize core systems
      await this.initCore();

      // Initialize components
      await this.initComponents();

      // Initialize modules
      await this.initModules();

      // Start the experience
      this.startExperience();

      this.initialized = true;
      console.log('✅ Application initialized successfully');

    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.showError('Failed to initialize application. Please refresh the page.');
    }
  },

  /**
   * Initialize core systems
   */
  async initCore() {
    // Load core modules
    await this.loadScript('/core/events.js');
    await this.loadScript('/core/state.js');
    await this.loadScript('/core/components.js');
  },

  /**
   * Initialize components
   */
  async initComponents() {
    const components = [
      { name: 'hero', path: '/components/hero/hero.js' },
      { name: 'calculator', path: '/components/calculator/calculator.js' },
      { name: 'testimonials', path: '/components/testimonials/testimonials.js' },
      { name: 'cta', path: '/components/cta/cta.js' }
    ];

    for (const component of components) {
      try {
        await this.loadScript(component.path);
        console.log(`✅ Loaded component: ${component.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to load component: ${component.name}`, error);
      }
    }
  },

  /**
   * Initialize modules
   */
  async initModules() {
    // Initialize hero section
    if (window.HeroSection) {
      const heroElement = document.querySelector('.hero-section');
      if (heroElement) {
        this.modules.set('hero', new window.HeroSection(heroElement));
      }
    }

    // Initialize calculator
    if (window.SolarCalculator) {
      const calculatorElement = document.getElementById('solar-calculator');
      if (calculatorElement) {
        this.modules.set('calculator', new window.SolarCalculator(calculatorElement));
      }
    }

    // Initialize testimonials
    if (window.TestimonialsSection) {
      const testimonialsElement = document.querySelector('.testimonials-section');
      if (testimonialsElement) {
        this.modules.set('testimonials', new window.TestimonialsSection(testimonialsElement));
      }
    }

    // Initialize CTA
    if (window.CTASection) {
      const ctaElement = document.querySelector('.cta-section');
      if (ctaElement) {
        this.modules.set('cta', new window.CTASection(ctaElement));
      }
    }
  },

  /**
   * Start the interactive experience
   */
  startExperience() {
    // Initialize particle systems
    this.initParticles();

    // Set up global event listeners
    this.setupEventListeners();

    // Start performance monitoring
    this.startPerformanceMonitoring();

    // Show welcome message
    this.showWelcomeMessage();
  },

  /**
   * Initialize particle systems
   */
  initParticles() {
    // Initialize hero particles
    const heroParticles = document.getElementById('hero-particles');
    if (heroParticles) {
      this.createAmbientParticles(heroParticles, 30, 'electric');
    }

    // Initialize calculator particles
    const calcParticles = document.getElementById('calculator-particles');
    if (calcParticles) {
      this.createAmbientParticles(calcParticles, 20, 'mixed');
    }
  },

  /**
   * Create ambient particle field
   */
  createAmbientParticles(container, count, theme = 'electric') {
    const colors = {
      electric: ['#00BFFF', '#0080FF', '#FFD700', '#FF8C00'],
      solar: ['#FFD700', '#FF8C00', '#FF4500'],
      mixed: ['#00BFFF', '#FFD700', '#FF4500', '#10B981']
    };

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'ambient-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
      particle.style.background = colors[theme][Math.floor(Math.random() * colors[theme].length)];

      container.appendChild(particle);
    }
  },

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Handle CTA clicks
    document.addEventListener('click', (e) => {
      const cta = e.target.closest('[data-action]');
      if (cta) {
        this.handleAction(cta.dataset.action, cta, e);
      }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      // ESC to close modals
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    // Handle scroll events for animations
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    });

    // Handle resize events
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  },

  /**
   * Handle CTA actions
   */
  handleAction(action, element, event) {
    switch (action) {
      case 'calculator-scroll':
        this.scrollToCalculator();
        break;

      case 'quote-modal':
        this.openQuoteModal();
        break;

      case 'quote-submit':
        this.handleQuoteSubmit(element, event);
        break;

      case 'mobile-menu':
        this.toggleMobileMenu();
        break;

      default:
        console.log('Unknown action:', action);
    }
  },

  /**
   * Scroll to calculator section
   */
  scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
      calculator.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Add visual effect
      calculator.style.animation = 'highlight 1s ease-out';
      setTimeout(() => {
        calculator.style.animation = '';
      }, 1000);
    }
  },

  /**
   * Open quote modal
   */
  openQuoteModal() {
    const modal = document.getElementById('quote-modal');
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';

      // Focus management
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  },

  /**
   * Close modal
   */
  closeModal() {
    const modal = document.querySelector('.modal:not([hidden])');
    if (modal) {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  },

  /**
   * Handle quote form submission
   */
  async handleQuoteSubmission(form, event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate API call (replace with real endpoint)
      await this.simulateApiCall('/api/quote', data);

      // Show success message
      this.showNotification('Quote request sent successfully! We\'ll contact you within 24 hours.', 'success');

      // Close modal
      this.closeModal();

      // Reset form
      form.reset();

    } catch (error) {
      this.showNotification('Failed to send quote request. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileNav) {
      const isOpen = mobileNav.hasAttribute('hidden');
      mobileNav.hidden = !isOpen;
      menuToggle.setAttribute('aria-expanded', isOpen);
    }
  },

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrolled = window.scrollY;
    const windowHeight = window.innerHeight;

    // Update scroll indicator
    this.updateScrollIndicator(scrolled);

    // Animate elements on scroll
    this.animateOnScroll(scrolled, windowHeight);
  },

  /**
   * Update scroll indicator
   */
  updateScrollIndicator(scrolled) {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrolled / documentHeight, 1);

    const progressBar = indicator.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.height = (progress * 100) + '%';
    }

    // Hide indicator when scrolled
    indicator.style.opacity = scrolled > 100 ? '0' : '1';
  },

  /**
   * Animate elements on scroll
   */
  animateOnScroll(scrolled, windowHeight) {
    const elements = document.querySelectorAll('[data-animate]');

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementBottom = elementTop + rect.height;

      // Check if element is in viewport
      if (elementBottom > scrolled && elementTop < scrolled + windowHeight) {
        const animation = element.dataset.animate;
        element.style.animation = `${animation} 0.8s ease-out forwards`;
      }
    });
  },

  /**
   * Handle window resize
   */
  handleResize() {
    // Update any responsive elements
    this.updateScrollIndicator(window.scrollY);
  },

  /**
   * Start performance monitoring
   */
  startPerformanceMonitoring() {
    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // 50ms threshold
          console.warn('Long task detected:', {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime)
          });
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });

    // Monitor layout shifts
    const layoutObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.value > 0.1) { // 0.1 threshold
          console.warn('Layout shift detected:', {
            value: entry.value.toFixed(4),
            startTime: Math.round(entry.startTime)
          });
        }
      }
    });

    layoutObserver.observe({ entryTypes: ['layout-shift'] });
  },

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    // Add a subtle welcome effect
    setTimeout(() => {
      document.body.style.animation = 'fadeIn 1s ease-out';
    }, 100);
  },

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${type === 'success' ? '✓' : '⚠️'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">×</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);

    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
  },

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  },

  /**
   * Load script dynamically
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  /**
   * Simulate API call (replace with real implementation)
   */
  simulateApiCall(endpoint, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('API call failed'));
        }
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
