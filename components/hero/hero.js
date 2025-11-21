/**
 * Component: Hero Section
 * Module: Components
 * Purpose: Main landing area with animated particles and counters
 * Dependencies: /core/events.js
 * Author: Development Agent
 * Date: November 2024
 */

import { emit } from '/core/events.js';

export default class HeroSection {
    constructor(element) {
        this.element = element;
        this.particlesContainer = element.querySelector('.hero-particles');
        this.contentContainer = element.querySelector('.hero-content');
        this.initialized = false;

        // Configuration
        this.config = {
            particles: {
                count: 80,
                colors: ['#FFD700', '#FFED4A', '#F59E0B'],
                speed: 0.5,
                size: { min: 1.5, max: 3 },
                connectionDistance: 150,
                mouseInfluence: 100
            },
            counters: {
                duration: 2000,
                easing: 'easeOutCubic'
            }
        };

        // State
        this.state = {
            particles: [],
            counters: [],
            mouse: { x: null, y: null },
            animationFrame: null,
            canvas: null,
            ctx: null
        };

        // Bind methods
        this.handleMouseMove = this.onMouseMove.bind(this);
        this.handleMouseLeave = this.onMouseLeave.bind(this);
        this.handleResize = this.onResize.bind(this);
    }

    async init() {
        try {
            console.log('Initializing Hero Section component');

            // Initialize particles system
            this.initParticles();

            // Initialize counters
            this.initCounters();

            // Set up event listeners
            this.setupEventListeners();

            // Add intersection observer for animations
            this.setupIntersectionObserver();

            this.initialized = true;
            emit('component:hero:initialized', { element: this.element });

        } catch (error) {
            console.error('Hero initialization failed:', error);
            emit('component:hero:error', { element: this.element, error });
        }
    }

    /**
     * Initialize particle system
     */
    initParticles() {
        if (!this.particlesContainer) {
            console.warn('Particles container not found');
            return;
        }

        // Create canvas
        this.state.canvas = document.createElement('canvas');
        this.state.canvas.className = 'hero-particles-canvas';
        this.state.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        this.particlesContainer.appendChild(this.state.canvas);

        this.state.ctx = this.state.canvas.getContext('2d');

        // Set canvas size
        this.updateCanvasSize();

        // Create particles
        this.createParticles();

        // Start animation
        this.animate();

        // Set up mouse interaction
        this.particlesContainer.addEventListener('mousemove', this.handleMouseMove);
        this.particlesContainer.addEventListener('mouseleave', this.handleMouseLeave);
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Update canvas size
     */
    updateCanvasSize() {
        if (!this.state.canvas) return;

        const rect = this.particlesContainer.getBoundingClientRect();
        this.state.canvas.width = rect.width || window.innerWidth;
        this.state.canvas.height = rect.height || window.innerHeight;
    }

    /**
     * Create particle objects
     */
    createParticles() {
        this.state.particles = [];

        for (let i = 0; i < this.config.particles.count; i++) {
            this.state.particles.push({
                x: Math.random() * this.state.canvas.width,
                y: Math.random() * this.state.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particles.speed,
                vy: (Math.random() - 0.5) * this.config.particles.speed,
                size: Math.random() * (this.config.particles.size.max - this.config.particles.size.min) + this.config.particles.size.min,
                color: this.config.particles.colors[Math.floor(Math.random() * this.config.particles.colors.length)],
                originalVx: 0,
                originalVy: 0
            });
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.state.ctx || !this.state.canvas) return;

        const ctx = this.state.ctx;
        const canvas = this.state.canvas;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        this.state.particles.forEach((particle, i) => {
            this.updateParticle(particle);
            this.drawParticle(particle);

            // Draw connections
            this.drawConnections(particle, i);
        });

        this.state.animationFrame = requestAnimationFrame(() => this.animate());
    }

    /**
     * Update particle position and behavior
     */
    updateParticle(particle) {
        // Store original velocity
        if (particle.originalVx === 0 && particle.originalVy === 0) {
            particle.originalVx = particle.vx;
            particle.originalVy = particle.vy;
        }

        // Mouse interaction
        if (this.state.mouse.x !== null && this.state.mouse.y !== null) {
            const dx = this.state.mouse.x - particle.x;
            const dy = this.state.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.particles.mouseInfluence) {
                const force = (this.config.particles.mouseInfluence - distance) / this.config.particles.mouseInfluence;
                particle.vx -= (dx / distance) * force * 0.5;
                particle.vy -= (dy / distance) * force * 0.5;
            }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= this.state.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= this.state.canvas.height) {
            particle.vy *= -1;
        }

        // Apply friction to mouse-influenced particles
        const friction = 0.98;
        particle.vx *= friction;
        particle.vy *= friction;

        // Reset to original velocity if too slow
        if (Math.abs(particle.vx) < 0.01) particle.vx = particle.originalVx;
        if (Math.abs(particle.vy) < 0.01) particle.vy = particle.originalVy;
    }

    /**
     * Draw particle
     */
    drawParticle(particle) {
        const ctx = this.state.ctx;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    }

    /**
     * Draw connections between particles
     */
    drawConnections(particle, index) {
        const ctx = this.state.ctx;

        for (let j = index + 1; j < this.state.particles.length; j++) {
            const other = this.state.particles[j];
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.particles.connectionDistance) {
                const opacity = 1 - (distance / this.config.particles.connectionDistance);
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    /**
     * Initialize animated counters
     */
    initCounters() {
        const counterElements = this.element.querySelectorAll('.stat-item');

        counterElements.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const numberElement = counter.querySelector('.stat-number');

            if (!numberElement || isNaN(target)) return;

            // Create counter state
            const counterState = {
                element: numberElement,
                target,
                current: 0,
                startTime: null,
                duration: this.config.counters.duration,
                observer: null
            };

            this.state.counters.push(counterState);

            // Set up intersection observer
            counterState.observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counterState.startTime) {
                        counterState.startTime = performance.now();
                        this.animateCounter(counterState);
                        counterState.observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterState.observer.observe(counter);
        });
    }

    /**
     * Animate counter
     */
    animateCounter(counterState) {
        const elapsed = performance.now() - counterState.startTime;
        const progress = Math.min(elapsed / counterState.duration, 1);

        // Easing function
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        counterState.current = counterState.target * easedProgress;

        // Update display
        counterState.element.textContent = Math.floor(counterState.current).toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(() => this.animateCounter(counterState));
        } else {
            counterState.element.textContent = counterState.target.toLocaleString();
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // CTA button clicks
        const ctaButton = this.element.querySelector('.hero-cta .btn-primary');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                const action = ctaButton.dataset.action;
                emit('hero:cta:click', { action, element: this.element });
            });
        }
    }

    /**
     * Set up intersection observer for entrance animations
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.element.classList.add('hero-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(this.element);
    }

    /**
     * Mouse move handler
     */
    onMouseMove(event) {
        const rect = this.particlesContainer.getBoundingClientRect();
        this.state.mouse.x = event.clientX - rect.left;
        this.state.mouse.y = event.clientY - rect.top;
    }

    /**
     * Mouse leave handler
     */
    onMouseLeave() {
        this.state.mouse.x = null;
        this.state.mouse.y = null;
    }

    /**
     * Resize handler
     */
    onResize() {
        this.updateCanvasSize();
        // Recreate particles for new canvas size
        this.createParticles();
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // Reinitialize if needed
        if (newConfig.particles) {
            this.createParticles();
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        // Cancel animation
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }

        // Remove event listeners
        if (this.particlesContainer) {
            this.particlesContainer.removeEventListener('mousemove', this.handleMouseMove);
            this.particlesContainer.removeEventListener('mouseleave', this.handleMouseLeave);
        }
        window.removeEventListener('resize', this.handleResize);

        // Clean up canvas
        if (this.state.canvas && this.state.canvas.parentNode) {
            this.state.canvas.parentNode.removeChild(this.state.canvas);
        }

        // Clean up counter observers
        this.state.counters.forEach(counter => {
            if (counter.observer) {
                counter.observer.disconnect();
            }
        });

        this.initialized = false;
        emit('component:hero:destroyed', { element: this.element });
    }
}
