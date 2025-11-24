/**
 * Hero Section Component
 * Interactive hero with counters, particles, and animations
 */

class HeroSection {
  constructor(element) {
    this.element = element;
    this.counters = [];
    this.particles = [];
    this.observers = [];
    this.initialized = false;
  }

  async init() {
    try {
      console.log('Initializing Hero Section component');

      // Initialize counters
      this.initCounters();

      // Initialize particles
      this.initParticles();

      // Initialize scroll effects
      this.initScrollEffects();

      // Initialize interactive elements
      this.initInteractiveElements();

      // Start animation loop
      this.startAnimationLoop();

      this.initialized = true;
      console.log('Hero Section component initialized successfully');

    } catch (error) {
      console.error('Hero Section initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize animated counters
   */
  initCounters() {
    const counterElements = this.element.querySelectorAll('[data-counter]');

    counterElements.forEach(element => {
      const target = parseInt(element.dataset.counter);
      const counter = {
        element,
        target,
        current: 0,
        speed: target / 2000, // 2 second animation
        active: false
      };

      this.counters.push(counter);
    });

    // Start counters when hero is visible
    this.observeHeroVisibility();
  }

  /**
   * Observe when hero section becomes visible
   */
  observeHeroVisibility() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.countersStarted) {
          this.startCounters();
          this.countersStarted = true;
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(this.element);
    this.observers.push(observer);
  }

  /**
   * Start counter animations
   */
  startCounters() {
    this.counters.forEach(counter => {
      counter.active = true;
      this.animateCounter(counter);
    });
  }

  /**
   * Animate individual counter
   */
  animateCounter(counter) {
    if (!counter.active) return;

    counter.current += counter.speed;

    if (counter.current >= counter.target) {
      counter.current = counter.target;
      counter.active = false;

      // Create celebration particles when counter finishes
      this.createCelebrationParticles(counter.element);
    }

    // Format and display number
    const formatted = this.formatCounter(counter.current, counter.target);
    counter.element.textContent = formatted;

    if (counter.active) {
      requestAnimationFrame(() => this.animateCounter(counter));
    }
  }

  /**
   * Format counter numbers
   */
  formatCounter(value, target) {
    const numValue = Math.floor(value);

    if (target >= 1000000) {
      return (numValue / 1000000).toFixed(1) + 'M';
    } else if (target >= 1000) {
      return (numValue / 1000).toFixed(0) + 'K';
    }

    return numValue.toLocaleString();
  }

  /**
   * Create celebration particles when counter finishes
   */
  createCelebrationParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';

      // Random direction and distance
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      // Random colors
      const colors = ['#FFD700', '#00BFFF', '#FF4500', '#10B981'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  /**
   * Initialize particle system
   */
  initParticles() {
    const particleContainer = this.element.querySelector('#hero-particles');
    if (!particleContainer) return;

    // Create ambient particles
    this.createAmbientParticles(particleContainer, 30);

    // Create electricity arcs
    this.createElectricityArcs();

    // Create energy waves
    this.createEnergyWaves();
  }

  /**
   * Create ambient floating particles
   */
  createAmbientParticles(container, count) {
    const colors = ['#00BFFF', '#0080FF', '#FFD700', '#FF8C00', '#FF4500'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'ambient-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = 0.6;

      container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  /**
   * Create electricity arc effects
   */
  createElectricityArcs() {
    const arcs = this.element.querySelectorAll('.electricity-arc');

    arcs.forEach((arc, index) => {
      // Add dynamic styling
      arc.style.animationDelay = (index * 0.5) + 's';
      arc.style.animationDuration = (2 + Math.random()) + 's';
    });
  }

  /**
   * Create energy wave effects
   */
  createEnergyWaves() {
    const waves = this.element.querySelectorAll('.energy-wave');

    waves.forEach((wave, index) => {
      wave.style.animationDelay = (index * 2) + 's';
    });
  }

  /**
   * Initialize scroll effects
   */
  initScrollEffects() {
    this.scrollHandler = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrolled = window.scrollY;
    const windowHeight = window.innerHeight;

    // Parallax effect on hero background
    const heroBg = this.element.querySelector('.hero-bg-effects');
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Update particle positions based on scroll
    this.updateParticlesOnScroll(scrolled);

    // Update scroll indicator
    this.updateScrollIndicator(scrolled);
  }

  /**
   * Update particles based on scroll position
   */
  updateParticlesOnScroll(scrolled) {
    this.particles.forEach((particle, index) => {
      const speed = 0.1 + (index % 3) * 0.1;
      const yOffset = scrolled * speed;
      particle.style.transform = `translateY(${-yOffset}px)`;
    });
  }

  /**
   * Update scroll indicator
   */
  updateScrollIndicator(scrolled) {
    const indicator = this.element.querySelector('.scroll-indicator');
    if (!indicator) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrolled / documentHeight, 1);

    const progressBar = indicator.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.height = (progress * 100) + '%';
    }
  }

  /**
   * Initialize interactive elements
   */
  initInteractiveElements() {
    // Add hover effects to buttons
    const buttons = this.element.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.createButtonHoverEffect(button);
      });
    });

    // Add click effects
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.createButtonClickEffect(button);
      });
    });
  }

  /**
   * Create button hover effect
   */
  createButtonHoverEffect(button) {
    // Add glow effect
    button.style.boxShadow = '0 0 30px rgba(0, 191, 255, 0.6)';

    // Create subtle particles
    const rect = button.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'button-hover-particle';
      particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
      particle.style.top = (rect.top + Math.random() * rect.height) + 'px';

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1000);
    }
  }

  /**
   * Create button click effect
   */
  createButtonClickEffect(button) {
    // Scale animation
    button.style.animation = 'buttonClick 0.3s ease-out';

    // Create burst particles
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'button-click-particle';

      const angle = (i / 8) * Math.PI * 2;
      const distance = 30;
      particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
      particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';

      const colors = ['#FFD700', '#00BFFF', '#FF4500'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 800);
    }

    setTimeout(() => {
      button.style.animation = '';
    }, 300);
  }

  /**
   * Start animation loop for continuous effects
   */
  startAnimationLoop() {
    this.animationLoop = () => {
      this.updateDynamicEffects();
      requestAnimationFrame(this.animationLoop);
    };

    this.animationLoop();
  }

  /**
   * Update dynamic effects each frame
   */
  updateDynamicEffects() {
    // Update electricity arc opacity based on time
    const time = Date.now() * 0.001;
    const arcs = this.element.querySelectorAll('.electricity-arc');

    arcs.forEach((arc, index) => {
      const opacity = 0.3 + Math.sin(time + index) * 0.2;
      arc.style.opacity = Math.max(0.1, opacity);
    });
  }

  /**
   * Destroy component
   */
  destroy() {
    // Remove event listeners
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }

    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());

    // Stop animation loop
    if (this.animationLoop) {
      cancelAnimationFrame(this.animationLoop);
    }

    // Remove particles
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });

    this.initialized = false;
    console.log('Hero Section component destroyed');
  }
}

// Export for use in other modules
export default HeroSection;

// Make available globally
window.HeroSection = HeroSection;