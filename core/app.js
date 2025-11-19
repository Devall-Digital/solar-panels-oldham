/**
 * Component: Main Application Controller
 * Module: Core
 * Purpose: Initialize and manage the Solar Panels Oldham application
 * Dependencies: router.js, state.js, events.js, components.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { Router } from './router.js';
import { state, setState, subscribe } from './state.js';
import { EventBus } from './events.js';
import { initComponents } from './components.js';

class SolarPanelsApp {
    constructor() {
        this.router = null;
        this.eventBus = new EventBus();
        this.initialized = false;
        
        // Application configuration
        this.config = {
            appName: 'Solar Panels Oldham',
            version: '1.0.0',
            api: {
                baseUrl: '/api',
                timeout: 10000
            },
            analytics: {
                enabled: true,
                trackingId: 'GA-MEASUREMENT-ID' // Replace with actual ID
            },
            features: {
                animations: true,
                sounds: true,
                particles: true
            }
        };
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.info('🚀 Initializing Solar Panels Oldham...');
            
            // Set initial state
            setState('app', {
                loading: true,
                error: null,
                ready: false
            });
            
            // Initialize router
            this.router = new Router();
            await this.router.init();
            
            // Initialize all components
            await initComponents();
            
            // Set up global error handling
            this.setupErrorHandling();
            
            // Set up performance monitoring
            this.setupPerformanceMonitoring();
            
            // Load user preferences
            await this.loadUserPreferences();
            
            // Subscribe to state changes
            this.subscribeToStateChanges();
            
            // Mark app as ready
            setState('app', {
                loading: false,
                ready: true
            });
            
            this.initialized = true;
            this.eventBus.emit('app:ready');
            
            console.info('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            setState('app', {
                loading: false,
                error: error.message,
                ready: false
            });
            
            // Show error UI
            this.showErrorUI(error);
        }
    }
    
    /**
     * Set up global error handling
     */
    setupErrorHandling() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error, 'window.error');
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason, 'unhandledrejection');
        });
    }
    
    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Monitor long tasks
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            console.warn('Long task detected:', {
                                duration: entry.duration,
                                startTime: entry.startTime
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // PerformanceObserver not supported
            }
            
            // Log initial load performance
            window.addEventListener('load', () => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                console.info('Page load performance:', {
                    totalTime: loadTime,
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime
                });
                
                // Track if load time exceeds target
                if (loadTime > 2000) {
                    this.eventBus.emit('performance:slow-load', { loadTime });
                }
            });
        }
    }
    
    /**
     * Load user preferences from localStorage
     */
    async loadUserPreferences() {
        try {
            const savedPrefs = localStorage.getItem('userPreferences');
            if (savedPrefs) {
                const prefs = JSON.parse(savedPrefs);
                setState('preferences', prefs);
                
                // Apply preferences
                this.applyPreferences(prefs);
            } else {
                // Set default preferences
                const defaultPrefs = {
                    animations: true,
                    sounds: true,
                    theme: 'auto', // auto, light, dark
                    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                };
                setState('preferences', defaultPrefs);
                this.applyPreferences(defaultPrefs);
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
        }
    }
    
    /**
     * Apply user preferences
     */
    applyPreferences(prefs) {
        // Apply theme
        if (prefs.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', prefs.theme);
        }
        
        // Apply animation preferences
        if (!prefs.animations || prefs.reducedMotion) {
            document.documentElement.classList.add('no-animations');
        } else {
            document.documentElement.classList.remove('no-animations');
        }
        
        // Update config
        this.config.features.animations = prefs.animations && !prefs.reducedMotion;
        this.config.features.sounds = prefs.sounds;
    }
    
    /**
     * Subscribe to state changes
     */
    subscribeToStateChanges() {
        // Save preferences when they change
        subscribe('preferences', (prefs) => {
            localStorage.setItem('userPreferences', JSON.stringify(prefs));
            this.applyPreferences(prefs);
        });
        
        // Handle route changes
        subscribe('route', (route) => {
            this.eventBus.emit('route:change', route);
            
            // Track page view
            if (this.config.analytics.enabled && window.gtag) {
                gtag('config', this.config.analytics.trackingId, {
                    page_path: route.path
                });
            }
        });
    }
    
    /**
     * Handle errors
     */
    handleError(error, source = 'unknown') {
        const errorData = {
            message: error.message || 'An unexpected error occurred',
            stack: error.stack,
            source,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Emit error event
        this.eventBus.emit('app:error', errorData);
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.error('Error details:', errorData);
        }
        
        // Track error in analytics
        if (this.config.analytics.enabled && window.gtag) {
            gtag('event', 'exception', {
                description: errorData.message,
                fatal: false
            });
        }
        
        // TODO: Send to error reporting service
    }
    
    /**
     * Show error UI
     */
    showErrorUI(error) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'app-error';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>Oops! Something went wrong</h2>
                <p>We're sorry, but there was an error loading the application.</p>
                <button onclick="window.location.reload()">Reload Page</button>
            </div>
        `;
        document.body.appendChild(errorContainer);
    }
    
    /**
     * API request helper
     */
    async api(endpoint, options = {}) {
        const url = `${this.config.api.baseUrl}${endpoint}`;
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        // Add CSRF token if available
        const csrfToken = this.getCSRFToken();
        if (csrfToken && mergedOptions.method !== 'GET') {
            mergedOptions.headers['X-CSRF-Token'] = csrfToken;
        }
        
        try {
            const response = await fetch(url, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            this.handleError(error, 'api');
            throw error;
        }
    }
    
    /**
     * Get CSRF token
     */
    getCSRFToken() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : null;
    }
}

// Create and export app instance
const app = new SolarPanelsApp();

// Make app globally accessible for debugging and navigation
window.app = app;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export { app, SolarPanelsApp };
