/**
 * Component: Hero Section
 * Module: Hero
 * Purpose: Interactive hero section with particle animations and counter effects
 * Dependencies: /core/state.js, /core/events.js
 * Author: Solar Panels Oldham Development Agent
 * Date: November 2024
 */

class HeroComponent {
    constructor(element) {
        this.element = element;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationFrame = null;
        this.counters = [];
        this.isVisible = false;

        // Particle system settings
        this.particleSettings = {
            count: 80,
            colors: ['#FFD700', '#FFED4A', '#F59E0B'],
            minSize: 1.5,
            maxSize: 3,
            minSpeed: 0.1,
            maxSpeed: 0.5,
            connectionDistance: 150,
            mouseInfluence: 100
        };

        this.init();
    }

    /**
     * Initialize the hero component
     */
    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupResizeHandler();

        // Start animation loop
        this.animate();

        console.info('Hero component initialized');
    }

    /**
     * Set up the particle canvas
     */
    setupCanvas() {
        const particlesContainer = this.element.querySelector('.hero-particles');
        if (!particlesContainer) {
            console.warn('Hero particles container not found');
            return;
        }

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';

        particlesContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Set initial canvas size
        this.resizeCanvas();
    }

    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        if (!this.canvas) return;

        const container = this.element.querySelector('.hero-particles');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width || window.innerWidth;
        this.canvas.height = rect.height || window.innerHeight;
    }

    /**
     * Create particle objects
     */
    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.particleSettings.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.particleSettings.maxSpeed,
                vy: (Math.random() - 0.5) * this.particleSettings.maxSpeed,
                size: Math.random() * (this.particleSettings.maxSize - this.particleSettings.minSize) + this.particleSettings.minSize,
                color: this.particleSettings.colors[Math.floor(Math.random() * this.particleSettings.colors.length)],
                originalVx: 0,
                originalVy: 0
            });
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Mouse interaction
        let mouse = { x: null, y: null };

        this.element.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        this.element.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Store mouse reference
        this.mouse = mouse;

        // Handle CTA button clicks
        const ctaButton = this.element.querySelector('.btn-primary');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                const action = ctaButton.dataset.action;
                if (action) {
                    this.emit('hero:action', { action, element: ctaButton });
                }
            });
        }
    }

    /**
     * Set up intersection observer for performance
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                    if (!this.isVisible && this.animationFrame) {
                        cancelAnimationFrame(this.animationFrame);
                        this.animationFrame = null;
                    } else if (this.isVisible && !this.animationFrame) {
                        this.animate();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(this.element);
    }

    /**
     * Set up resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.createParticles(); // Recreate particles for new size
            }, 250);
        });
    }

    /**
     * Animation loop
     */
    animate = () => {
        if (!this.isVisible || !this.ctx) return;

        this.updateParticles();
        this.drawParticles();

        this.animationFrame = requestAnimationFrame(this.animate);
    }

    /**
     * Update particle positions and interactions
     */
    updateParticles() {
        const mouse = this.mouse;

        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.particleSettings.mouseInfluence) {
                    const force = (this.particleSettings.mouseInfluence - distance) / this.particleSettings.mouseInfluence;
                    particle.vx -= (dx / distance) * force * 0.5;
                    particle.vy -= (dy / distance) * force * 0.5;
                }
            }

            // Apply damping to prevent particles from going too fast
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    /**
     * Draw particles and connections
     */
    drawParticles() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first (behind particles)
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.particleSettings.connectionDistance) {
                    const opacity = 1 - (distance / this.particleSettings.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.2})`;
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Add glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.size * 2;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * Initialize animated counters
     */
    initCounters() {
        const counterElements = this.element.querySelectorAll('.stat-item');

        counterElements.forEach((counter, index) => {
            const target = parseInt(counter.dataset.count);
            const numberElement = counter.querySelector('.stat-number');

            if (!numberElement || isNaN(target)) return;

            // Store counter info
            this.counters.push({
                element: numberElement,
                target: target,
                current: 0,
                started: false
            });

            // Set up intersection observer for each counter
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.counters[index].started) {
                            this.startCounter(index);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(counter);
        });
    }

    /**
     * Start counting animation
     */
    startCounter(index) {
        const counter = this.counters[index];
        if (!counter || counter.started) return;

        counter.started = true;

        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = counter.target / (duration / 16); // 60fps
        let current = start;

        const updateCounter = () => {
            current += increment;

            if (current < counter.target) {
                counter.element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.element.textContent = counter.target.toLocaleString();
            }
        };

        updateCounter();
    }

    /**
     * Emit events
     */
    emit(eventType, data) {
        // Use the global event bus if available
        if (window.app && window.app.eventBus) {
            window.app.eventBus.emit(eventType, data);
        }

        // Also dispatch custom event
        const event = new CustomEvent(eventType, { detail: data });
        this.element.dispatchEvent(event);
    }

    /**
     * Update component data
     */
    updateData(newData) {
        // Update counter values
        if (newData.counters) {
            Object.keys(newData.counters).forEach(key => {
                const statItem = this.element.querySelector(`[data-count="${key}"]`);
                if (statItem) {
                    statItem.dataset.count = newData.counters[key];
                }
            });
        }

        // Update text content
        if (newData.line1) {
            const line1 = this.element.querySelector('.hero-title-line1');
            if (line1) line1.textContent = newData.line1;
        }

        if (newData.line2) {
            const line2 = this.element.querySelector('.hero-title-line2');
            if (line2) line2.textContent = newData.line2;
        }

        if (newData.accent) {
            const accent = this.element.querySelector('.hero-accent');
            if (accent) accent.textContent = newData.accent;
        }

        if (newData.subtitle) {
            const subtitle = this.element.querySelector('.hero-subtitle');
            if (subtitle) subtitle.textContent = newData.subtitle;
        }

        if (newData.cta_text) {
            const ctaText = this.element.querySelector('.btn-text');
            if (ctaText) ctaText.textContent = newData.cta_text;
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Remove event listeners
        window.removeEventListener('resize', this.resizeCanvas);

        // Clear particles
        this.particles = [];

        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        console.info('Hero component destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroElements = document.querySelectorAll('[data-component="hero"]');

    heroElements.forEach(element => {
        if (!element.heroComponent) {
            element.heroComponent = new HeroComponent(element);
        }
    });
});

// Export for manual initialization
export default HeroComponent;
