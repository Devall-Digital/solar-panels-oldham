/**
 * Component: Hero Section
 * Module: Components
 * Purpose: Main landing area with animated particles and compelling CTAs
 * Dependencies: /core/events.js, /core/state.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { emit, on } from '/core/events.js';
import { setState, getState } from '/core/state.js';

export default class HeroSection {
    constructor(element) {
        console.log('Hero component constructor called');
        this.element = element;
        this.particles = [];
        this.animationFrame = null;
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;
        
        // Configuration
        this.config = {
            particleCount: 50,
            particleSpeed: 0.5,
            particleSize: { min: 1, max: 3 },
            particleColors: ['#FFD700', '#FFED4A', '#F59E0B'],
            connectionDistance: 150,
            mouseRadius: 100
        };
        
        // Mouse position
        this.mouse = {
            x: null,
            y: null
        };
    }
    
    async init() {
        try {
            console.log('Hero component init called');
            // Initialize particles canvas
            await this.initParticles();
            
            // Initialize counters
            this.initCounters();
            
            // Initialize CTA effects
            this.initCTAEffects();
            
            // Add resize handler
            this.handleResize = this.onResize.bind(this);
            window.addEventListener('resize', this.handleResize);
            
            // Start animation
            this.animate();
            
            // Mark as initialized
            this.initialized = true;
            emit('component:hero:initialized');
            
        } catch (error) {
            console.error('Hero initialization failed:', error);
            emit('component:hero:error', error);
        }
    }
    
    /**
     * Initialize particle system
     */
    async initParticles() {
        const particleContainer = this.element.querySelector('.hero-particles');
        if (!particleContainer) return;
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        particleContainer.appendChild(this.canvas);
        
        // Get context
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        this.createParticles();
        
        // Add mouse move handler
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Reset mouse on leave
        this.element.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    /**
     * Create particles
     */
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                color: this.config.particleColors[Math.floor(Math.random() * this.config.particleColors.length)]
            });
        }
    }
    
    /**
     * Resize canvas
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.element.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Recreate particles on resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    /**
     * Animate particles
     */
    animate() {
        if (!this.ctx || !this.initialized) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x <= 0 || particle.x >= this.canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= this.canvas.height) particle.vy *= -1;
            
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    particle.vx -= (dx / distance) * force * 0.5;
                    particle.vy -= (dy / distance) * force * 0.5;
                }
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Initialize counting animations
     */
    initCounters() {
        const counters = this.element.querySelectorAll('.stat-item');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const numberElement = counter.querySelector('.stat-number');
            
            if (!numberElement || isNaN(target)) return;
            
            // Set up intersection observer
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(numberElement, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    /**
     * Animate counter
     */
    animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                element.classList.add('count-complete');
                
                // Add pulse effect on complete
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        };
        
        updateCounter();
    }
    
    /**
     * Initialize CTA button effects
     */
    initCTAEffects() {
        const ctaButton = this.element.querySelector('.btn-primary');
        if (!ctaButton) return;
        
        // Add shine effect on hover
        const shine = ctaButton.querySelector('.btn-shine');
        if (shine) {
            ctaButton.addEventListener('mouseenter', () => {
                shine.style.animation = 'shine 0.6s ease-out';
            });
            
            ctaButton.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    shine.style.animation = 'none';
                }, 600);
            });
        }
        
        // Add click ripple effect
        ctaButton.addEventListener('click', (e) => {
            const rect = ctaButton.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            ctaButton.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Emit CTA click event
            const action = ctaButton.dataset.action;
            emit('hero:cta:click', { action });
        });
    }
    
    /**
     * Handle resize
     */
    onResize() {
        this.resizeCanvas();
    }
    
    /**
     * Destroy component
     */
    destroy() {
        this.initialized = false;
        
        // Cancel animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }
        
        // Clear particles
        this.particles = [];
        
        // Remove canvas
        if (this.canvas) {
            this.canvas.remove();
        }
        
        emit('component:hero:destroyed');
    }
}
