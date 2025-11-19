/**
 * Component: Client-Side Router
 * Module: Core
 * Purpose: Handle client-side routing for SPA functionality
 * Dependencies: state.js, events.js
 * Author: Initial Setup Agent
 * Date: November 2024
 */

import { state, setState } from './state.js';
import { EventBus } from './events.js';

export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.eventBus = new EventBus();
        this.beforeHooks = [];
        this.afterHooks = [];
        
        // Default routes
        this.setupDefaultRoutes();
    }
    
    /**
     * Initialize the router
     */
    async init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            this.handleRoute(window.location.pathname, false);
        });
        
        // Handle link clicks
        document.addEventListener('click', (event) => {
            // Check if it's a link
            const link = event.target.closest('a');
            if (!link) return;
            
            // Check if it's an internal link
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#')) return;
            
            // Prevent default and handle routing
            event.preventDefault();
            this.navigate(href);
        });
        
        // Handle initial route
        await this.handleRoute(window.location.pathname, false);
    }
    
    /**
     * Set up default routes
     */
    setupDefaultRoutes() {
        // Home page
        this.addRoute('/', {
            name: 'home',
            title: 'Solar Panels Oldham | Premium Solar Installation',
            component: 'home',
            module: '/modules/home/home.js',
            meta: {
                description: 'Professional solar panel installation in Oldham, Saddleworth & Greater Manchester'
            }
        });
        
        // Area pages
        this.addRoute('/oldham', {
            name: 'area-oldham',
            title: 'Solar Panels Oldham | Local Solar Installation',
            component: 'area',
            data: { area: 'oldham' }
        });
        
        this.addRoute('/saddleworth', {
            name: 'area-saddleworth',
            title: 'Solar Panels Saddleworth | Local Solar Installation',
            component: 'area',
            data: { area: 'saddleworth' }
        });
        
        this.addRoute('/uppermill', {
            name: 'area-uppermill',
            title: 'Solar Panels Uppermill | Local Solar Installation',
            component: 'area',
            data: { area: 'uppermill' }
        });
        
        // Feature pages
        this.addRoute('/calculator', {
            name: 'calculator',
            title: 'Solar Savings Calculator | Solar Panels Oldham',
            component: 'calculator',
            module: '/modules/calculator/calculator.js'
        });
        
        this.addRoute('/quote', {
            name: 'quote',
            title: 'Get Your Free Quote | Solar Panels Oldham',
            component: 'quote'
        });
        
        // 404 page
        this.addRoute('*', {
            name: '404',
            title: 'Page Not Found | Solar Panels Oldham',
            component: '404'
        });
    }
    
    /**
     * Add a route
     */
    addRoute(path, config) {
        this.routes.set(path, {
            path,
            ...config,
            regex: this.pathToRegex(path)
        });
    }
    
    /**
     * Convert path to regex
     */
    pathToRegex(path) {
        if (path === '*') return /.*/;
        
        const regex = path
            .replace(/\//g, '\\/')
            .replace(/:\w+/g, '([^/]+)');
            
        return new RegExp(`^${regex}$`);
    }
    
    /**
     * Navigate to a route
     */
    async navigate(path, data = {}) {
        // Run before hooks
        for (const hook of this.beforeHooks) {
            const proceed = await hook(path, this.currentRoute);
            if (!proceed) return;
        }
        
        // Update URL
        window.history.pushState(data, '', path);
        
        // Handle the route
        await this.handleRoute(path, true);
    }
    
    /**
     * Handle route change
     */
    async handleRoute(path, isNavigation = true) {
        // Find matching route
        let matchedRoute = null;
        let params = {};
        
        for (const [routePath, route] of this.routes) {
            if (routePath === path) {
                matchedRoute = route;
                break;
            }
            
            const match = path.match(route.regex);
            if (match) {
                matchedRoute = route;
                // Extract params
                const paramNames = (routePath.match(/:\w+/g) || []).map(p => p.slice(1));
                match.slice(1).forEach((value, index) => {
                    params[paramNames[index]] = value;
                });
                break;
            }
        }
        
        // Use 404 if no match
        if (!matchedRoute) {
            matchedRoute = this.routes.get('*');
        }
        
        // Update state
        const routeData = {
            ...matchedRoute,
            params,
            query: this.parseQuery(window.location.search),
            hash: window.location.hash
        };
        
        setState('route', routeData);
        this.currentRoute = routeData;
        
        // Update page title
        document.title = matchedRoute.title || 'Solar Panels Oldham';
        
        // Update meta tags
        this.updateMetaTags(matchedRoute.meta || {});
        
        // Emit route change event
        this.eventBus.emit('route:change', routeData);
        
        // Load component
        await this.loadComponent(matchedRoute.component, routeData);
        
        // Run after hooks
        for (const hook of this.afterHooks) {
            await hook(routeData, isNavigation);
        }
        
        // Scroll to top on navigation
        if (isNavigation && !window.location.hash) {
            window.scrollTo(0, 0);
        }
    }
    
    /**
     * Parse query string
     */
    parseQuery(queryString) {
        const query = {};
        const params = new URLSearchParams(queryString);
        
        for (const [key, value] of params) {
            query[key] = value;
        }
        
        return query;
    }
    
    /**
     * Update meta tags
     */
    updateMetaTags(meta) {
        // Update description
        if (meta.description) {
            let descTag = document.querySelector('meta[name="description"]');
            if (!descTag) {
                descTag = document.createElement('meta');
                descTag.name = 'description';
                document.head.appendChild(descTag);
            }
            descTag.content = meta.description;
        }
        
        // Update OG tags
        if (meta.ogTitle) {
            let ogTag = document.querySelector('meta[property="og:title"]');
            if (!ogTag) {
                ogTag = document.createElement('meta');
                ogTag.setAttribute('property', 'og:title');
                document.head.appendChild(ogTag);
            }
            ogTag.content = meta.ogTitle;
        }
    }
    
    /**
     * Load component for route
     */
    async loadComponent(componentName, routeData) {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('App container not found');
            return;
        }
        
        // Show loading state
        appContainer.classList.add('loading');
        
        try {
            // Check if route has custom module path
            const modulePath = routeData.module || `/modules/${componentName}/${componentName}.js`;
            
            // Dynamically import component module
            const module = await import(modulePath);
            
            // Create instance and initialize
            if (module.default) {
                const instance = new module.default();
                if (typeof instance.init === 'function') {
                    await instance.init(appContainer, routeData);
                } else {
                    console.warn(`Component ${componentName} has no init method`);
                }
            } else {
                console.warn(`Module ${componentName} has no default export`);
            }
            
            // Remove loading state
            appContainer.classList.remove('loading');
            
        } catch (error) {
            console.error(`Failed to load component ${componentName}:`, error);
            
            // Show error page
            appContainer.innerHTML = `
                <div class="route-error">
                    <h1>Error Loading Page</h1>
                    <p>We're sorry, but there was an error loading this page.</p>
                    <a href="/" class="btn-primary">Go Home</a>
                </div>
            `;
            
            appContainer.classList.remove('loading');
        }
    }
    
    /**
     * Add before navigation hook
     */
    beforeEach(hook) {
        this.beforeHooks.push(hook);
    }
    
    /**
     * Add after navigation hook
     */
    afterEach(hook) {
        this.afterHooks.push(hook);
    }
    
    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * Check if path matches current route
     */
    isActive(path) {
        return this.currentRoute && this.currentRoute.path === path;
    }
    
    /**
     * Go back in history
     */
    back() {
        window.history.back();
    }
    
    /**
     * Go forward in history
     */
    forward() {
        window.history.forward();
    }
}
