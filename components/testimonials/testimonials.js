/**
 * Testimonials Section Component
 * Interactive testimonials with social proof
 */

class TestimonialsSection {
  constructor(element) {
    this.element = element;
    this.testimonials = [];
    this.currentIndex = 0;
    this.autoRotate = true;
    this.interval = null;
    this.initialized = false;
  }

  async init() {
    try {
      console.log('Initializing Testimonials Section component');

      // Load testimonials data
      this.loadTestimonials();

      // Create testimonials HTML
      this.renderTestimonials();

      // Set up event listeners
      this.setupEventListeners();

      // Start auto-rotation
      this.startAutoRotation();

      this.initialized = true;
      console.log('Testimonials Section component initialized successfully');

    } catch (error) {
      console.error('Testimonials Section initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load testimonials data
   */
  loadTestimonials() {
    this.testimonials = [
      {
        id: 1,
        name: 'Sarah & John Mitchell',
        location: 'Saddleworth',
        rating: 5,
        text: 'Our solar panels have transformed our household. We\'re now generating more electricity than we use, and our bills have dropped by £85 per month. The MCS certified installation was professional and the 25-year warranty gives us complete peace of mind.',
        system: '3.5 kWp System',
        savings: '£85/month',
        installDate: 'March 2024',
        image: '/assets/images/testimonials/sarah-john.jpg',
        verified: true
      },
      {
        id: 2,
        name: 'David Thompson',
        location: 'Oldham',
        rating: 5,
        text: 'From initial consultation to final installation, the entire process was seamless. The team explained everything clearly, and the real-time calculator helped me understand exactly what to expect. Highly recommended!',
        system: '4.2 kWp System',
        savings: '£110/month',
        installDate: 'January 2024',
        image: '/assets/images/testimonials/david.jpg',
        verified: true
      },
      {
        id: 3,
        name: 'Emma Wilson',
        location: 'Ashton-under-Lyne',
        rating: 5,
        text: 'The interactive calculator was incredibly accurate. After installation, our actual savings were within £5 of the predicted amount. The system monitoring app lets us track our energy production in real-time.',
        system: '2.8 kWp System',
        savings: '£65/month',
        installDate: 'February 2024',
        image: '/assets/images/testimonials/emma.jpg',
        verified: true
      },
      {
        id: 4,
        name: 'Mark & Lisa Roberts',
        location: 'Rochdale',
        rating: 5,
        text: 'We were initially skeptical about solar panels, but the detailed ROI projections and the fact that it\'s MCS certified gave us confidence. We\'ve already saved £2,400 in our first year!',
        system: '4.5 kWp System',
        savings: '£95/month',
        installDate: 'December 2023',
        image: '/assets/images/testimonials/mark-lisa.jpg',
        verified: true
      }
    ];
  }

  /**
   * Render testimonials HTML
   */
  renderTestimonials() {
    const container = this.element.querySelector('.testimonials-grid') ||
                     this.createTestimonialsContainer();

    container.innerHTML = `
      <!-- Main Testimonial Card -->
      <div class="testimonial-card main-testimonial">
        <div class="testimonial-header">
          <div class="testimonial-avatar">
            <img src="${this.testimonials[0].image}" alt="${this.testimonials[0].name}" loading="lazy">
            <div class="verified-badge" title="Verified Customer">
              <span class="verified-icon">✓</span>
            </div>
          </div>
          <div class="testimonial-meta">
            <div class="testimonial-name">${this.testimonials[0].name}</div>
            <div class="testimonial-location">${this.testimonials[0].location}</div>
            <div class="testimonial-rating">
              ${this.generateStars(this.testimonials[0].rating)}
            </div>
          </div>
        </div>
        <div class="testimonial-content">
          <blockquote class="testimonial-text">
            "${this.testimonials[0].text}"
          </blockquote>
          <div class="testimonial-stats">
            <div class="stat-item">
              <span class="stat-label">System:</span>
              <span class="stat-value">${this.testimonials[0].system}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Savings:</span>
              <span class="stat-value">${this.testimonials[0].savings}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Installed:</span>
              <span class="stat-value">${this.testimonials[0].installDate}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini Testimonials -->
      <div class="mini-testimonials">
        ${this.testimonials.slice(1, 4).map(testimonial => `
          <div class="mini-testimonial-card" data-testimonial-id="${testimonial.id}">
            <div class="mini-header">
              <div class="mini-avatar">
                <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
              </div>
              <div class="mini-meta">
                <div class="mini-name">${testimonial.name}</div>
                <div class="mini-rating">${this.generateStars(testimonial.rating)}</div>
              </div>
            </div>
            <div class="mini-content">
              <p class="mini-text">"${testimonial.text.substring(0, 100)}..."</p>
              <div class="mini-stats">
                <span class="mini-saving">${testimonial.savings}</span>
                <span class="mini-system">${testimonial.system}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Navigation -->
      <div class="testimonial-navigation">
        <button class="nav-btn prev-btn" aria-label="Previous testimonial">
          <span class="nav-icon">←</span>
        </button>
        <div class="testimonial-dots">
          ${this.testimonials.map((_, index) => `
            <button class="dot ${index === 0 ? 'active' : ''}"
                    data-slide="${index}"
                    aria-label="Go to testimonial ${index + 1}"></button>
          `).join('')}
        </div>
        <button class="nav-btn next-btn" aria-label="Next testimonial">
          <span class="nav-icon">→</span>
        </button>
      </div>
    `;

    // Add particle effects
    this.addParticleEffects();
  }

  /**
   * Create testimonials container if it doesn't exist
   */
  createTestimonialsContainer() {
    const container = document.createElement('div');
    container.className = 'testimonials-grid';
    this.element.appendChild(container);
    return container;
  }

  /**
   * Generate star rating HTML
   */
  generateStars(rating) {
    return Array(5).fill(0).map((_, i) =>
      `<span class="star ${i < rating ? 'filled' : ''}">⭐</span>`
    ).join('');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Navigation buttons
    const prevBtn = this.element.querySelector('.prev-btn');
    const nextBtn = this.element.querySelector('.next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousTestimonial());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextTestimonial());
    }

    // Dot navigation
    const dots = this.element.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToTestimonial(index));
    });

    // Mini testimonial clicks
    const miniCards = this.element.querySelectorAll('.mini-testimonial-card');
    miniCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.testimonialId);
        const index = this.testimonials.findIndex(t => t.id === id);
        if (index >= 0) {
          this.goToTestimonial(index);
        }
      });
    });

    // Pause auto-rotation on hover
    const testimonialCard = this.element.querySelector('.main-testimonial');
    if (testimonialCard) {
      testimonialCard.addEventListener('mouseenter', () => this.pauseAutoRotation());
      testimonialCard.addEventListener('mouseleave', () => this.resumeAutoRotation());
    }
  }

  /**
   * Go to previous testimonial
   */
  previousTestimonial() {
    const newIndex = this.currentIndex === 0 ?
      this.testimonials.length - 1 : this.currentIndex - 1;
    this.goToTestimonial(newIndex);
  }

  /**
   * Go to next testimonial
   */
  nextTestimonial() {
    const newIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.goToTestimonial(newIndex);
  }

  /**
   * Go to specific testimonial
   */
  goToTestimonial(index) {
    if (index === this.currentIndex) return;

    const testimonial = this.testimonials[index];
    if (!testimonial) return;

    // Update main testimonial
    this.updateMainTestimonial(testimonial);

    // Update dots
    this.updateDots(index);

    // Update current index
    this.currentIndex = index;

    // Create transition effect
    this.createTransitionEffect();
  }

  /**
   * Update main testimonial display
   */
  updateMainTestimonial(testimonial) {
    const mainCard = this.element.querySelector('.main-testimonial');
    if (!mainCard) return;

    // Animate out current content
    mainCard.style.opacity = '0';

    setTimeout(() => {
      // Update content
      const avatar = mainCard.querySelector('.testimonial-avatar img');
      const name = mainCard.querySelector('.testimonial-name');
      const location = mainCard.querySelector('.testimonial-location');
      const rating = mainCard.querySelector('.testimonial-rating');
      const text = mainCard.querySelector('.testimonial-text');
      const system = mainCard.querySelector('.stat-value:nth-child(1)');
      const savings = mainCard.querySelector('.stat-value:nth-child(2)');
      const installDate = mainCard.querySelector('.stat-value:nth-child(3)');

      if (avatar) avatar.src = testimonial.image;
      if (avatar) avatar.alt = testimonial.name;
      if (name) name.textContent = testimonial.name;
      if (location) location.textContent = testimonial.location;
      if (rating) rating.innerHTML = this.generateStars(testimonial.rating);
      if (text) text.textContent = `"${testimonial.text}"`;
      if (system) system.textContent = testimonial.system;
      if (savings) savings.textContent = testimonial.savings;
      if (installDate) installDate.textContent = testimonial.installDate;

      // Animate back in
      mainCard.style.opacity = '1';
    }, 300);
  }

  /**
   * Update dot navigation
   */
  updateDots(activeIndex) {
    const dots = this.element.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  /**
   * Create transition effect
   */
  createTransitionEffect() {
    const mainCard = this.element.querySelector('.main-testimonial');
    if (!mainCard) return;

    // Add sparkle effect
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'testimonial-sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = (i * 0.1) + 's';

      mainCard.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
  }

  /**
   * Start auto-rotation
   */
  startAutoRotation() {
    if (!this.autoRotate) return;

    this.interval = setInterval(() => {
      this.nextTestimonial();
    }, 5000); // Change every 5 seconds
  }

  /**
   * Pause auto-rotation
   */
  pauseAutoRotation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Resume auto-rotation
   */
  resumeAutoRotation() {
    if (this.autoRotate && !this.interval) {
      this.startAutoRotation();
    }
  }

  /**
   * Add particle effects
   */
  addParticleEffects() {
    const container = this.element.querySelector('.testimonials-section');
    if (!container) return;

    // Create floating particles
    const particleContainer = document.createElement('div');
    particleContainer.className = 'testimonial-particles';
    container.appendChild(particleContainer);

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 5 + 10) + 's';

      particleContainer.appendChild(particle);
    }
  }

  /**
   * Destroy component
   */
  destroy() {
    // Stop auto-rotation
    this.pauseAutoRotation();

    this.initialized = false;
    console.log('Testimonials Section component destroyed');
  }
}

// Export for use in other modules
export default TestimonialsSection;

// Make available globally
window.TestimonialsSection = TestimonialsSection;
