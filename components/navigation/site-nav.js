/**
 * Component: Site Navigation
 * Module: Navigation
 * Purpose: Sticky navigation with scroll progress, dynamic states, and smooth scrolling
 * Dependencies: /core/events.js
 * Author: GPT-5.1 Codex
 * Date: November 2025
 */

import { emit, on } from '/core/events.js';

export default class SiteNavigation {
    constructor(element) {
        this.element = element;
        this.progressBar = element?.querySelector('.site-nav__progress-bar') || null;
        this.navLinks = element ? Array.from(element.querySelectorAll('.nav-link')) : [];
        this.sections = [];
        this.sectionPositions = [];
        this.hideThreshold = 120;
        this.lastScrollY = window.scrollY || 0;
        this.scrollTicking = false;
        this.isMenuOpen = false;
        this.shouldReduceMotion = false;
        this.motionQuery = null;
        this.motionChangeHandler = null;
        this.sectionObserver = null;
        this.unsubscribe = [];
        this.boundHandleScroll = this.handleScroll.bind(this);
        this.boundHandleResize = this.handleResize.bind(this);
    }

    async init() {
        if (!this.element) {
            return;
        }

        this.setupMotionPreference();
        this.cacheSections();
        this.bindNavLinks();
        this.bindFocusStyles();
        this.setupSectionObserver();
        this.handleScroll();

        window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
        window.addEventListener('resize', this.boundHandleResize);

        this.unsubscribe.push(on('mobile-menu:state-change', (state) => this.handleMenuState(state)));
        this.unsubscribe.push(on('route:change', () => this.onRouteChange()));

        window.addEventListener('load', () => this.cacheSections(), { once: true });

        emit('component:site-nav:ready', { element: this.element });
    }

    setupMotionPreference() {
        if (typeof window.matchMedia !== 'function') {
            return;
        }

        this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.shouldReduceMotion = this.motionQuery.matches;

        this.motionChangeHandler = (event) => {
            this.shouldReduceMotion = event.matches;
            if (!this.shouldReduceMotion) {
                this.handleScroll();
            }
        };

        if (this.motionQuery.addEventListener) {
            this.motionQuery.addEventListener('change', this.motionChangeHandler);
        } else if (this.motionQuery.addListener) {
            this.motionQuery.addListener(this.motionChangeHandler);
        }
    }

    setupSectionObserver() {
        const target = document.getElementById('app') || document.body;
        if (!target) return;

        this.sectionObserver = new MutationObserver(() => {
            this.cacheSections();
        });

        this.sectionObserver.observe(target, { childList: true, subtree: true });
    }

    cacheSections() {
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        this.sectionPositions = this.sections
            .map((section) => ({
                id: section.id,
                offsetTop: section.getBoundingClientRect().top + window.scrollY
            }))
            .sort((a, b) => a.offsetTop - b.offsetTop);
    }

    bindNavLinks() {
        this.navLinks.forEach((link) => {
            link.addEventListener('click', (event) => this.handleNavLinkClick(event, link));
        });
    }

    handleNavLinkClick(event, link) {
        const target = link.getAttribute('href');
        if (!target || !target.startsWith('#')) {
            return;
        }

        event.preventDefault();
        this.scrollToSection(target);

        emit('nav:link-click', { targetId: target.replace('#', '') });

        const mobileMenu = this.element.querySelector('[data-component="mobile-menu"]');
        if (mobileMenu) {
            mobileMenu.dispatchEvent(new CustomEvent('mobile-menu:request-close', { bubbles: true }));
        }
    }

    scrollToSection(target) {
        const destination = document.querySelector(target);
        if (!destination) {
            return;
        }

        const navHeight = this.element.getBoundingClientRect().height || 0;
        const offset = destination.getBoundingClientRect().top + window.scrollY - (navHeight + 12);

        window.scrollTo({
            top: Math.max(offset, 0),
            behavior: this.shouldReduceMotion ? 'auto' : 'smooth'
        });
    }

    bindFocusStyles() {
        this.element.addEventListener('focusin', () => {
            this.element.classList.add('site-nav--focus');
        });

        this.element.addEventListener('focusout', (event) => {
            if (!this.element.contains(event.relatedTarget)) {
                this.element.classList.remove('site-nav--focus');
            }
        });
    }

    handleScroll() {
        if (this.scrollTicking) {
            return;
        }

        this.scrollTicking = true;
        requestAnimationFrame(() => {
            const current = window.scrollY || 0;
            this.updateNavState(current);
            this.updateProgress(current);
            this.highlightActiveLink(current);
            this.lastScrollY = current;
            this.scrollTicking = false;
        });
    }

    updateNavState(scrollY) {
        const isScrolled = scrollY > 16;

        this.element.classList.toggle('site-nav--scrolled', isScrolled);

        if (this.isMenuOpen) {
            this.element.classList.remove('site-nav--hidden');
            this.element.setAttribute('data-nav-state', 'menu');
            return;
        }

        const shouldHide = !this.shouldReduceMotion && scrollY > this.hideThreshold && scrollY > this.lastScrollY;
        this.element.classList.toggle('site-nav--hidden', shouldHide);

        if (shouldHide) {
            this.element.setAttribute('data-nav-state', 'hidden');
        } else {
            this.element.setAttribute('data-nav-state', isScrolled ? 'scrolled' : 'default');
        }
    }

    updateProgress(scrollY) {
        if (!this.progressBar) {
            return;
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll <= 0 ? 0 : Math.min(scrollY / maxScroll, 1);
        this.progressBar.style.transform = `scaleX(${ratio})`;
    }

    highlightActiveLink(scrollY) {
        if (!this.sectionPositions.length || !this.navLinks.length) {
            return;
        }

        const navHeight = this.element.getBoundingClientRect().height || 0;
        const threshold = scrollY + navHeight + 48;
        let currentId = this.sectionPositions[0]?.id || null;

        for (const section of this.sectionPositions) {
            if (threshold >= section.offsetTop) {
                currentId = section.id;
            } else {
                break;
            }
        }

        this.navLinks.forEach((link) => {
            const target = link.getAttribute('href');
            if (!target || !target.startsWith('#')) {
                return;
            }

            const isActive = target === `#${currentId}`;
            link.classList.toggle('is-active', isActive);
            link.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    handleResize() {
        this.cacheSections();
        this.handleScroll();
    }

    handleMenuState(state = {}) {
        this.isMenuOpen = Boolean(state?.open);
        this.element.classList.toggle('site-nav--menu-open', this.isMenuOpen);

        if (this.isMenuOpen) {
            this.element.classList.remove('site-nav--hidden');
            this.element.setAttribute('data-nav-state', 'menu');
        } else {
            this.handleScroll();
        }
    }

    onRouteChange() {
        this.cacheSections();
        this.handleScroll();
    }

    destroy() {
        window.removeEventListener('scroll', this.boundHandleScroll);
        window.removeEventListener('resize', this.boundHandleResize);

        this.unsubscribe.forEach((unsubscribe) => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });

        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }

        if (this.motionQuery && this.motionChangeHandler) {
            if (this.motionQuery.removeEventListener) {
                this.motionQuery.removeEventListener('change', this.motionChangeHandler);
            } else if (this.motionQuery.removeListener) {
                this.motionQuery.removeListener(this.motionChangeHandler);
            }
        }

        emit('component:site-nav:destroyed');
    }
}

