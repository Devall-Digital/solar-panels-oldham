// Solar Panels Oldham - Performance Monitor
// Real-time performance monitoring and automatic optimization

(function() {
    'use strict';

    const PerformanceMonitor = {
        fps: 0,
        frameCount: 0,
        lastTime: 0,
        lowPerformanceCount: 0,
        isMonitoring: false,
        optimizationLevel: 0,
        
        init: function() {
            this.startMonitoring();
            this.setupPerformanceObservers();
            this.monitorMemoryUsage();
            this.detectJittering();
        },
        
        startMonitoring: function() {
            if (this.isMonitoring) return;
            this.isMonitoring = true;
            this.lastTime = performance.now();
            this.monitorFrameRate();
        },
        
        monitorFrameRate: function() {
            const currentTime = performance.now();
            this.frameCount++;
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                
                // Check for performance issues
                this.checkPerformance();
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(() => this.monitorFrameRate());
            }
        },
        
        checkPerformance: function() {
            // Log performance metrics
            if (window.SolarConfig && window.SolarConfig.debug) {
                console.log(`[Performance] FPS: ${this.fps}, Level: ${this.optimizationLevel}`);
            }
            
            // Apply optimizations based on performance
            if (this.fps < 30) {
                this.lowPerformanceCount++;
                
                if (this.lowPerformanceCount >= 3) {
                    this.applyOptimization(1);
                }
            } else if (this.fps < 45) {
                this.lowPerformanceCount++;
                
                if (this.lowPerformanceCount >= 5) {
                    this.applyOptimization(2);
                }
            } else {
                this.lowPerformanceCount = Math.max(0, this.lowPerformanceCount - 1);
            }
            
            // Emergency optimization for very low performance
            if (this.fps < 20) {
                this.applyEmergencyOptimization();
            }
        },
        
        applyOptimization: function(level) {
            if (level <= this.optimizationLevel) return;
            
            this.optimizationLevel = level;
            
            switch (level) {
                case 1:
                    this.applyLevel1Optimization();
                    break;
                case 2:
                    this.applyLevel2Optimization();
                    break;
                case 3:
                    this.applyLevel3Optimization();
                    break;
            }
            
            if (window.SolarConfig && window.SolarConfig.debug) {
                console.log(`[Performance] Applied optimization level ${level}`);
            }
        },
        
        applyLevel1Optimization: function() {
            // Reduce animation complexity
            const style = document.createElement('style');
            style.textContent = `
                .perf-level-1 * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.1s !important;
                }
                
                .perf-level-1 .floating-card {
                    animation: none !important;
                }
                
                .perf-level-1 .particle {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('perf-level-1');
        },
        
        applyLevel2Optimization: function() {
            // Disable most animations
            const style = document.createElement('style');
            style.textContent = `
                .perf-level-2 * {
                    animation: none !important;
                    transition: none !important;
                }
                
                .perf-level-2 .cursor-follower,
                .perf-level-2 .cursor-outline,
                .perf-level-2 .cursor-dot {
                    display: none !important;
                }
                
                .perf-level-2 .hero-image {
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('perf-level-2');
        },
        
        applyLevel3Optimization: function() {
            // Maximum optimization
            const style = document.createElement('style');
            style.textContent = `
                .perf-level-3 * {
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                }
                
                .perf-level-3 .floating-card,
                .perf-level-3 .hero-image,
                .perf-level-3 .stat {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('perf-level-3');
        },
        
        applyEmergencyOptimization: function() {
            // Emergency mode - disable everything
            const style = document.createElement('style');
            style.textContent = `
                .emergency-mode * {
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                }
                
                .emergency-mode .floating-card,
                .emergency-mode .hero-image,
                .emergency-mode .stat,
                .emergency-mode .cursor-follower,
                .emergency-mode .particle {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('emergency-mode');
            
            // Stop all animation loops
            this.stopAllAnimations();
        },
        
        stopAllAnimations: function() {
            // Cancel all requestAnimationFrame calls
            if (window.MobileOptimizer && window.MobileOptimizer.activeAnimations) {
                window.MobileOptimizer.activeAnimations.forEach(id => {
                    cancelAnimationFrame(id);
                });
                window.MobileOptimizer.activeAnimations.clear();
            }
        },
        
        setupPerformanceObservers: function() {
            // Monitor layout shifts
            if ('PerformanceObserver' in window) {
                const layoutShiftObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.value > 0.1) {
                            console.warn('[Performance] Large layout shift detected:', entry.value);
                            this.applyOptimization(1);
                        }
                    }
                });
                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            }
            
            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('[Performance] Long task detected:', entry.duration + 'ms');
                            this.applyOptimization(1);
                        }
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            }
        },
        
        monitorMemoryUsage: function() {
            if ('memory' in performance) {
                setInterval(() => {
                    const memory = performance.memory;
                    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                    
                    if (usedMB > 100) {
                        console.warn('[Performance] High memory usage:', usedMB + 'MB');
                        this.applyOptimization(2);
                    }
                }, 10000); // Check every 10 seconds
            }
        },
        
        detectJittering: function() {
            // Monitor for rapid DOM changes that might indicate jittering
            let changeCount = 0;
            let lastChangeTime = 0;
            
            const observer = new MutationObserver((mutations) => {
                const now = performance.now();
                
                // Count rapid changes
                if (now - lastChangeTime < 100) {
                    changeCount++;
                    
                    if (changeCount > 10) {
                        console.warn('[Performance] Potential jittering detected');
                        this.applyOptimization(1);
                        changeCount = 0;
                    }
                } else {
                    changeCount = 0;
                }
                
                lastChangeTime = now;
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        },
        
        // Public API
        getFPS: function() {
            return this.fps;
        },
        
        getOptimizationLevel: function() {
            return this.optimizationLevel;
        },
        
        resetOptimizations: function() {
            // Remove all optimization classes
            document.body.classList.remove('perf-level-1', 'perf-level-2', 'perf-level-3', 'emergency-mode');
            this.optimizationLevel = 0;
            this.lowPerformanceCount = 0;
        }
    };

    // Initialize performance monitor
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PerformanceMonitor.init();
        });
    } else {
        PerformanceMonitor.init();
    }

    // Export for use in other modules
    window.PerformanceMonitor = PerformanceMonitor;
})();