/**
 * Call-to-Action Section Component
 * Conversion-optimized CTA with interactive effects
 */

class CTASection {
  constructor(element) {
    this.element = element;
    this.particles = [];
    this.observers = [];
    this.initialized = false;
  }

  async init() {
    try {
      console.log('Initializing CTA Section component');

      // Load quote form template
      await this.loadQuoteForm();

      // Set up event listeners
      this.setupEventListeners();

      // Initialize particle effects
      this.initParticles();

      // Set up scroll-triggered animations
      this.setupScrollAnimations();

      // Start heartbeat effect
      this.startHeartbeatEffect();

      this.initialized = true;
      console.log('CTA Section component initialized successfully');

    } catch (error) {
      console.error('CTA Section initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // CTA button clicks
    const ctaButtons = this.element.querySelectorAll('[data-action]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleCTAAction(e.target.closest('[data-action]').dataset.action, e);
      });
    });

    // Hover effects
    const primaryBtn = this.element.querySelector('.btn-primary');
    if (primaryBtn) {
      primaryBtn.addEventListener('mouseenter', () => this.onButtonHover());
      primaryBtn.addEventListener('mouseleave', () => this.onButtonLeave());
      primaryBtn.addEventListener('click', () => this.onButtonClick());
    }

    // Contact number hover
    const contactNumber = this.element.querySelector('.contact-number');
    if (contactNumber) {
      contactNumber.addEventListener('mouseenter', () => this.onContactHover());
    }
  }

  /**
   * Handle CTA actions
   */
  handleCTAAction(action, event) {
    switch (action) {
      case 'quote-modal':
        event.preventDefault();
        this.openQuoteModal();
        break;

      case 'download-report':
        this.downloadReport();
        break;

      case 'call-now':
        // Let the tel: link handle this
        break;

      default:
        console.log('Unknown CTA action:', action);
    }
  }

  /**
   * Open quote modal
   */
  openQuoteModal() {
    // Emit event for main app to handle
    emit('cta:quote-modal', {
      source: 'cta-section'
    });
  }

  /**
   * Download report
   */
  downloadReport() {
    // Simulate download
    this.showDownloadAnimation();

    // In a real implementation, this would download a PDF report
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/assets/downloads/solar-savings-report.pdf';
      link.download = 'solar-savings-report.pdf';
      link.click();
    }, 1500);
  }

  /**
   * Show download animation
   */
  showDownloadAnimation() {
    const btn = this.element.querySelector('[data-action="download-report"]');
    if (!btn) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">📄</span>Generating Report...';

    // Show progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'download-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    btn.appendChild(progressBar);

    // Animate progress
    const progressFill = progressBar.querySelector('.progress-fill');
    progressFill.style.animation = 'progressFill 1.5s ease-out forwards';

    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  }

  /**
   * Button hover effect
   */
  onButtonHover() {
    const btn = this.element.querySelector('.btn-primary');
    if (!btn) return;

    // Create magnetic effect
    btn.style.transform = 'scale(1.05) translateY(-2px)';
    btn.style.boxShadow = '0 20px 40px rgba(0, 191, 255, 0.4)';

    // Create hover particles
    this.createHoverParticles(btn);
  }

  /**
   * Button leave effect
   */
  onButtonLeave() {
    const btn = this.element.querySelector('.btn-primary');
    if (!btn) return;

    btn.style.transform = '';
    btn.style.boxShadow = '';
  }

  /**
   * Button click effect
   */
  onButtonClick() {
    const btn = this.element.querySelector('.btn-primary');
    if (!btn) return;

    // Add click animation
    btn.style.animation = 'buttonPulse 0.6s ease-out';

    // Create click particles
    this.createClickParticles(btn);

    setTimeout(() => {
      btn.style.animation = '';
    }, 600);
  }

  /**
   * Contact hover effect
   */
  onContactHover() {
    const contact = this.element.querySelector('.contact-number');
    if (!contact) return;

    contact.style.animation = 'textGlow 0.8s ease-out infinite alternate';
  }

  /**
   * Create hover particles
   */
  createHoverParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'cta-hover-particle';

      const angle = (i / 6) * Math.PI * 2;
      const distance = 30;
      particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
      particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
      particle.style.background = ['#FFD700', '#00BFFF'][Math.floor(Math.random() * 2)];

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1000);
    }
  }

  /**
   * Create click particles
   */
  createClickParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'cta-click-particle';

      const angle = (i / 12) * Math.PI * 2;
      const distance = 40 + Math.random() * 40;
      particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
      particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
      particle.style.background = ['#FFD700', '#00BFFF', '#FF4500'][Math.floor(Math.random() * 3)];

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1200);
    }
  }

  /**
   * Initialize particle effects
   */
  initParticles() {
    const container = this.element.querySelector('.cta-section');
    if (!container) return;

    // Create background particles
    this.createBackgroundParticles(container);

    // Create energy pulse effect
    this.createEnergyPulse();

    // Create solar flare effect
    this.createSolarFlare();
  }

  /**
   * Create background particles
   */
  createBackgroundParticles(container) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'cta-bg-particles';
    container.appendChild(particleContainer);

    const colors = ['#FFD700', '#00BFFF', '#FF4500'];

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'cta-bg-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = 0.3 + Math.random() * 0.4;

      particleContainer.appendChild(particle);
      this.particles.push(particle);
    }
  }

  /**
   * Create energy pulse effect
   */
  createEnergyPulse() {
    const pulseElement = this.element.querySelector('.energy-pulse');
    if (!pulseElement) return;

    // Add dynamic pulsing
    pulseElement.style.animation = 'energyPulse 3s ease-in-out infinite';
  }

  /**
   * Create solar flare effect
   */
  createSolarFlare() {
    const flareElement = this.element.querySelector('.solar-flare');
    if (!flareElement) return;

    // Add flare animation
    flareElement.style.animation = 'solarFlare 4s ease-in-out infinite';
  }

  /**
   * Set up scroll-triggered animations
   */
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerCTAAnimation();
          observer.disconnect(); // Only trigger once
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
   * Trigger CTA section animation
   */
  triggerCTAAnimation() {
    const content = this.element.querySelector('.cta-content');
    if (!content) return;

    // Animate content in
    content.style.animation = 'slideUpFade 0.8s ease-out';

    // Animate particles
    const particles = this.element.querySelectorAll('.cta-bg-particle');
    particles.forEach((particle, index) => {
      particle.style.animationDelay = (index * 0.05) + 's';
      particle.style.animation = 'particleFadeIn 0.6s ease-out forwards';
    });

    // Start enhanced particle effects
    this.startEnhancedEffects();
  }

  /**
   * Start enhanced visual effects
   */
  startEnhancedEffects() {
    // Create floating energy orbs
    this.createEnergyOrbs();

    // Start button glow cycling
    this.startButtonGlowCycle();
  }

  /**
   * Create floating energy orbs
   */
  createEnergyOrbs() {
    const container = this.element.querySelector('.cta-visual');
    if (!container) return;

    for (let i = 0; i < 3; i++) {
      const orb = document.createElement('div');
      orb.className = 'energy-orb';
      orb.style.left = (20 + i * 30) + '%';
      orb.style.top = (30 + Math.random() * 40) + '%';
      orb.style.animationDelay = (i * 0.5) + 's';
      orb.style.background = ['#FFD700', '#00BFFF', '#FF4500'][i];

      container.appendChild(orb);

      // Remove after animation
      setTimeout(() => {
        if (orb.parentNode) {
          orb.parentNode.removeChild(orb);
        }
      }, 6000);
    }
  }

  /**
   * Start button glow cycling
   */
  startButtonGlowCycle() {
    const button = this.element.querySelector('.btn-primary');
    if (!button) return;

    let glowIndex = 0;
    const glows = [
      '0 0 20px rgba(0, 191, 255, 0.4)',
      '0 0 30px rgba(255, 215, 0, 0.5)',
      '0 0 25px rgba(255, 69, 0, 0.4)'
    ];

    const cycleGlow = () => {
      button.style.boxShadow = glows[glowIndex];
      glowIndex = (glowIndex + 1) % glows.length;

      if (this.initialized) {
        setTimeout(cycleGlow, 2000);
      }
    };

    cycleGlow();
  }

  /**
   * Start heartbeat effect for urgency
   */
  startHeartbeatEffect() {
    const title = this.element.querySelector('.cta-title');
    if (!title) return;

    // Subtle heartbeat animation every 8 seconds
    setInterval(() => {
      if (!this.isHovered) {
        title.style.animation = 'heartbeat 0.8s ease-out';
        setTimeout(() => {
          title.style.animation = '';
        }, 800);
      }
    }, 8000);
  }

  /**
   * Load quote form template
   */
  async loadQuoteForm() {
    try {
      const response = await fetch('/components/cta/quote-form.html');
      const html = await response.text();

      const modalBody = document.querySelector('.modal .modal-body');
      if (modalBody) {
        modalBody.innerHTML = html;
      }
    } catch (error) {
      console.error('Failed to load quote form:', error);
      // Fallback: create basic form
      const modalBody = document.querySelector('.modal .modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <form class="quote-form" id="quote-form">
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <input type="text" id="name" name="name" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" name="email" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Phone</label>
              <input type="tel" id="phone" name="phone" class="form-input" required>
            </div>
            <button type="submit" class="btn-primary">Get Free Quote</button>
          </form>
        `;
      }
    }
  }

  /**
   * Destroy component
   */
  destroy() {
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());

    // Remove particles
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });

    this.initialized = false;
    console.log('CTA Section component destroyed');
  }
}

// Export for use in other modules
export default CTASection;

// Make available globally
window.CTASection = CTASection;
