// Calculator State
// Updated: Full design elements deployment
const calculatorState = {
    location: 'oldham',
    roofSize: 50,
    energyUsage: 300,
    roofOrientation: 'southwest',
    roofPitch: 35,
    shading: 20,
    propertyType: 'semi',
    budget: 10000
};

// Chart instances
let savingsChart = null;
let energyChart = null;
let roiChart = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeCalculator();
    initializeCharts();
    initializeAnimations();
    initializeForm();
    initializeShapeInteractions();
});

// Initialize Calculator
function initializeCalculator() {
    // Location dropdown
    const locationSelect = document.getElementById('location');
    locationSelect.addEventListener('change', (e) => {
        calculatorState.location = e.target.value;
        updateCalculations();
    });
    
    // Roof size slider
    const roofSizeSlider = document.getElementById('roofSize');
    const roofSizeValue = document.getElementById('roofSizeValue');
    roofSizeSlider.addEventListener('input', (e) => {
        calculatorState.roofSize = parseInt(e.target.value);
        roofSizeValue.textContent = calculatorState.roofSize;
        updateSliderTrack(roofSizeSlider);
        updateCalculations();
    });
    updateSliderTrack(roofSizeSlider);
    
    // Energy usage slider
    const energyUsageSlider = document.getElementById('energyUsage');
    const energyUsageValue = document.getElementById('energyUsageValue');
    energyUsageSlider.addEventListener('input', (e) => {
        calculatorState.energyUsage = parseInt(e.target.value);
        energyUsageValue.textContent = calculatorState.energyUsage;
        updateSliderTrack(energyUsageSlider);
        updateCalculations();
    });
    updateSliderTrack(energyUsageSlider);
    
    // Roof orientation buttons
    const orientationButtons = document.querySelectorAll('.orientation-btn');
    orientationButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            orientationButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            calculatorState.roofOrientation = e.target.dataset.orientation;
            updateCalculations();
        });
    });
    
    // Roof pitch slider
    const roofPitchSlider = document.getElementById('roofPitch');
    const roofPitchValue = document.getElementById('roofPitchValue');
    roofPitchSlider.addEventListener('input', (e) => {
        calculatorState.roofPitch = parseInt(e.target.value);
        roofPitchValue.textContent = calculatorState.roofPitch;
        updateSliderTrack(roofPitchSlider);
        updateCalculations();
    });
    updateSliderTrack(roofPitchSlider);
    
    // Shading slider
    const shadingSlider = document.getElementById('shading');
    const shadingValue = document.getElementById('shadingValue');
    shadingSlider.addEventListener('input', (e) => {
        const shadingLevel = parseInt(e.target.value);
        calculatorState.shading = shadingLevel;
        
        let shadingText = 'Low';
        if (shadingLevel > 60) shadingText = 'High';
        else if (shadingLevel > 30) shadingText = 'Medium';
        
        shadingValue.textContent = shadingText;
        updateSliderTrack(shadingSlider);
        updateCalculations();
    });
    updateSliderTrack(shadingSlider);
    
    // Property type buttons
    const propertyButtons = document.querySelectorAll('.property-btn');
    propertyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            propertyButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            calculatorState.propertyType = e.target.dataset.type;
            updateCalculations();
        });
    });
    
    // Budget slider
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budgetValue');
    budgetSlider.addEventListener('input', (e) => {
        calculatorState.budget = parseInt(e.target.value);
        budgetValue.textContent = calculatorState.budget.toLocaleString();
        updateSliderTrack(budgetSlider);
        updateCalculations();
    });
    updateSliderTrack(budgetSlider);
    
    // Initial calculation
    updateCalculations();
}

// Update slider track width
function updateSliderTrack(slider) {
    const track = slider.nextElementSibling;
    if (track && track.classList.contains('slider-track')) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const value = parseFloat(slider.value) || 0;
        const percentage = ((value - min) / (max - min)) * 100;
        track.style.width = percentage + '%';
    }
}

// Calculate solar panel system
function calculateSolarSystem() {
    const { roofSize, energyUsage, roofOrientation, roofPitch, shading, propertyType } = calculatorState;
    
    // Orientation efficiency (south is best)
    const orientationEfficiency = {
        'south': 1.0,
        'southeast': 0.95,
        'southwest': 0.95,
        'east': 0.85,
        'west': 0.85
    };
    
    // Pitch efficiency (30-40 degrees is optimal)
    const pitchEfficiency = Math.max(0.7, 1 - Math.abs(roofPitch - 35) / 50);
    
    // Shading efficiency
    const shadingEfficiency = 1 - (shading / 100) * 0.3;
    
    // Average solar irradiance in Oldham area (kWh/m²/day)
    const solarIrradiance = 2.8;
    
    // Panel efficiency and size
    const panelEfficiency = 0.20; // 20% efficiency
    const panelSize = 1.7; // m² per panel
    const panelPower = 0.4; // kW per panel
    
    // Calculate available roof area for panels
    const usableRoofArea = roofSize * 0.8; // 80% usable
    
    // Calculate max panels that fit
    const maxPanels = Math.floor(usableRoofArea / panelSize);
    
    // Calculate energy generation per panel per year
    const energyPerPanel = panelPower * solarIrradiance * 365 * 
                          orientationEfficiency[roofOrientation] * 
                          pitchEfficiency * 
                          shadingEfficiency;
    
    // Calculate required system size based on energy usage
    const annualEnergyUsage = energyUsage * 12;
    const requiredSystemSize = annualEnergyUsage / (energyPerPanel / panelPower);
    
    // Determine actual system size (limited by roof space and budget)
    const maxSystemSize = maxPanels * panelPower;
    const budgetSystemSize = calculatorState.budget / 2000; // £2000 per kW
    
    const systemSize = Math.min(requiredSystemSize, maxSystemSize, budgetSystemSize);
    const numPanels = Math.floor(systemSize / panelPower);
    const actualSystemSize = numPanels * panelPower;
    
    // Calculate costs
    const costPerkW = 2000;
    const baseCost = actualSystemSize * costPerkW;
    const installationCost = baseCost * 1.15; // 15% installation overhead
    
    // Calculate savings
    const electricityPrice = 0.34; // £ per kWh
    const annualGeneration = actualSystemSize * solarIrradiance * 365 * 
                            orientationEfficiency[roofOrientation] * 
                            pitchEfficiency * 
                            shadingEfficiency;
    const annualSavings = Math.min(annualGeneration * electricityPrice, annualEnergyUsage * electricityPrice * 0.9);
    
    // Calculate ROI and payback
    const roi = ((annualSavings / installationCost) * 100).toFixed(1);
    const paybackPeriod = (installationCost / annualSavings).toFixed(1);
    
    // CO2 reduction (kg CO2 per kWh)
    const co2PerkWh = 0.233;
    const co2Reduction = (annualGeneration * co2PerkWh / 1000).toFixed(1);
    
    return {
        systemSize: actualSystemSize,
        numPanels: numPanels,
        installCost: installationCost,
        annualSavings: annualSavings,
        roi: roi,
        paybackPeriod: paybackPeriod,
        co2Reduction: co2Reduction,
        annualGeneration: annualGeneration,
        annualConsumption: annualEnergyUsage
    };
}

// Update calculations and display
function updateCalculations() {
    const results = calculateSolarSystem();
    
    // Update result displays with animation
    animateValue('systemSize', results.systemSize.toFixed(1) + ' kW');
    animateValue('numPanels', results.numPanels);
    animateValue('installCost', '£' + Math.round(results.installCost).toLocaleString());
    animateValue('annualSavings', '£' + Math.round(results.annualSavings).toLocaleString());
    animateValue('roi', results.roi + '%');
    animateValue('paybackPeriod', results.paybackPeriod + ' years');
    animateValue('co2Reduction', results.co2Reduction + ' tonnes/year');
    
    // Update hidden form fields
    document.getElementById('calcSystemSize').value = results.systemSize.toFixed(1);
    document.getElementById('calcNumPanels').value = results.numPanels;
    document.getElementById('calcInstallCost').value = Math.round(results.installCost);
    document.getElementById('calcAnnualSavings').value = Math.round(results.annualSavings);
    document.getElementById('calcRoi').value = results.roi;
    document.getElementById('calcPaybackPeriod').value = results.paybackPeriod;
    document.getElementById('calcLocation').value = calculatorState.location;
    
    // Update charts
    updateCharts(results);
}

// Animate value changes
function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
    }, 100);
}

// Initialize Charts
function initializeCharts() {
    const savingsCtx = document.getElementById('savingsChart');
    const energyCtx = document.getElementById('energyChart');
    const roiCtx = document.getElementById('roiChart');
    
    if (!savingsCtx || !energyCtx || !roiCtx) return;
    
    // Chart.js default colors
    Chart.defaults.color = '#a0a0b0';
    Chart.defaults.borderColor = 'rgba(139, 92, 246, 0.2)';
    
    // Savings over time chart
    savingsChart = new Chart(savingsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Cumulative Savings (£)',
                data: [],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#8b5cf6',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1,
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(139, 92, 246, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0b0',
                        callback: function(value) {
                            return '£' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(139, 92, 246, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0b0'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    // Energy comparison chart
    energyChart = new Chart(energyCtx, {
        type: 'bar',
        data: {
            labels: ['Generation', 'Consumption'],
            datasets: [{
                label: 'Energy (kWh/year)',
                data: [0, 0],
                backgroundColor: [
                    'rgba(6, 182, 212, 0.6)',
                    'rgba(139, 92, 246, 0.6)'
                ],
                borderColor: [
                    '#06b6d4',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1,
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(139, 92, 246, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0b0',
                        callback: function(value) {
                            return value.toLocaleString() + ' kWh';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0a0b0'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    // ROI gauge chart
    roiChart = new Chart(roiCtx, {
        type: 'doughnut',
        data: {
            labels: ['ROI', 'Remaining'],
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(139, 92, 246, 0.2)'
                ],
                borderColor: [
                    '#06b6d4',
                    '#8b5cf6'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1,
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    padding: 12
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Update charts with new data
function updateCharts(results) {
    if (!savingsChart || !energyChart || !roiChart) return;
    
    // Update savings chart (25 years projection)
    const years = [];
    const savings = [];
    let cumulativeSavings = 0;
    const installCost = results.installCost;
    
    for (let year = 0; year <= 25; year++) {
        years.push('Year ' + year);
        cumulativeSavings += results.annualSavings;
        savings.push(cumulativeSavings - installCost);
    }
    
    savingsChart.data.labels = years;
    savingsChart.data.datasets[0].data = savings;
    savingsChart.update('active');
    
    // Update energy chart
    energyChart.data.datasets[0].data = [
        Math.round(results.annualGeneration),
        Math.round(results.annualConsumption)
    ];
    energyChart.update('active');
    
    // Update ROI chart
    const roiValue = Math.min(parseFloat(results.roi), 100);
    roiChart.data.datasets[0].data = [roiValue, Math.max(0, 100 - roiValue)];
    roiChart.update('active');
    
    // Add ROI text in center
    const roiCtx = document.getElementById('roiChart');
    if (roiCtx) {
        const ctx = roiCtx.getContext('2d');
        const centerX = roiCtx.width / 2;
        const centerY = roiCtx.height / 2;
        
        // This will be handled by Chart.js plugin if needed
    }
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.benefits, .calculator-section, .quote-section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize form
function initializeForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const formMessage = document.getElementById('formMessage');
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span>';
        
        // Get form data
        const formData = new FormData(form);
        
        try {
            const response = await fetch('calculator.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                formMessage.className = 'form-message success';
                formMessage.textContent = 'Thank you! Your quote request has been submitted successfully. We will contact you shortly.';
                form.reset();
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                formMessage.className = 'form-message error';
                formMessage.textContent = result.message || 'There was an error submitting your request. Please try again.';
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'There was an error submitting your request. Please try again later.';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Quote Request</span>';
        }
    });
    
    // Add input animations
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// Debounce function for slider updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Particle System
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    // Add new particles periodically
    setInterval(() => {
        if (particlesContainer.children.length < particleCount) {
            createParticle(particlesContainer);
        }
    }, 2000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 2px and 8px
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random animation duration
    const duration = Math.random() * 10 + 15; // 15-25 seconds
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    // Random color variation - solar themed (sun yellow/orange, cyan energy, purple panels)
    const colorVariation = Math.random();
    if (colorVariation > 0.66) {
        // Cyan energy particles
        particle.style.background = 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0.4) 30%, transparent 70%)';
        particle.style.boxShadow = '0 0 10px rgba(6, 182, 212, 0.5)';
    } else if (colorVariation > 0.33) {
        // Purple panel particles
        particle.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.4) 30%, transparent 70%)';
        particle.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.5)';
    } else {
        // Sun/yellow energy particles
        particle.style.background = 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(251, 191, 36, 0.3) 40%, transparent 70%)';
        particle.style.boxShadow = '0 0 8px rgba(251, 191, 36, 0.4)';
    }
    
    container.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, duration * 1000);
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('submit-btn') || e.target.closest('.submit-btn')) {
        const button = e.target.closest('.submit-btn') || e.target;
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Initialize Shape Interactions (Scroll & Cursor)
function initializeShapeInteractions() {
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length === 0) return;
    
    // Scroll tracking variables
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollVelocity = 0;
    let lastScrollTime = Date.now();
    let scrollTimeout = null;
    
    // Cursor tracking variables (desktop only)
    let mouseX = 0;
    let mouseY = 0;
    let isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    // Scroll event handler
    function handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const currentTime = Date.now();
        const timeDelta = currentTime - lastScrollTime;
        
        // Calculate scroll velocity (pixels per second)
        if (timeDelta > 0) {
            const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
            scrollVelocity = (scrollDelta / timeDelta) * 1000; // Convert to px/s
        }
        
        // Update shapes based on scroll speed
        shapes.forEach(shape => {
            shape.classList.remove('scroll-fast', 'scroll-slow');
            
            if (scrollVelocity > 100) {
                // Fast scrolling
                shape.classList.add('scroll-fast');
            } else if (scrollVelocity < 20 && scrollVelocity > 0) {
                // Slow scrolling
                shape.classList.add('scroll-slow');
            }
        });
        
        lastScrollTop = currentScrollTop;
        lastScrollTime = currentTime;
        
        // Reset scroll velocity after scrolling stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollVelocity = 0;
            shapes.forEach(shape => {
                shape.classList.remove('scroll-fast', 'scroll-slow');
            });
        }, 150);
    }
    
    // Cursor tracking (desktop only)
    function handleMouseMove(e) {
        if (!isDesktop) return;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        shapes.forEach(shape => {
            const rect = shape.getBoundingClientRect();
            const shapeCenterX = rect.left + rect.width / 2;
            const shapeCenterY = rect.top + rect.height / 2;
            
            // Calculate distance from cursor to shape center
            const distance = Math.sqrt(
                Math.pow(mouseX - shapeCenterX, 2) + 
                Math.pow(mouseY - shapeCenterY, 2)
            );
            
            // React if cursor is within 300px of shape
            const maxDistance = 300;
            const proximity = 1 - (distance / maxDistance);
            
            shape.classList.remove('cursor-near', 'cursor-far');
            
            if (distance < maxDistance) {
                if (proximity > 0.5) {
                    shape.classList.add('cursor-near');
                } else {
                    shape.classList.add('cursor-far');
                }
                
                // Add parallax effect using CSS variables (works with animations)
                const moveX = (mouseX - shapeCenterX) * 0.03;
                const moveY = (mouseY - shapeCenterY) * 0.03;
                
                shape.style.setProperty('--parallax-x', `${moveX}px`);
                shape.style.setProperty('--parallax-y', `${moveY}px`);
            } else {
                // Reset parallax when cursor is far
                shape.classList.remove('cursor-near', 'cursor-far');
                shape.style.setProperty('--parallax-x', '0px');
                shape.style.setProperty('--parallax-y', '0px');
            }
        });
    }
    
    // Throttled scroll handler for performance
    let scrollThrottle = null;
    window.addEventListener('scroll', () => {
        if (!scrollThrottle) {
            scrollThrottle = requestAnimationFrame(() => {
                handleScroll();
                scrollThrottle = null;
            });
        }
    }, { passive: true });
    
    // Mouse move handler (desktop only)
    if (isDesktop) {
        let mouseThrottle = null;
        document.addEventListener('mousemove', (e) => {
            if (!mouseThrottle) {
                mouseThrottle = requestAnimationFrame(() => {
                    handleMouseMove(e);
                    mouseThrottle = null;
                });
            }
        }, { passive: true });
        
        // Reset shapes when mouse leaves window
        document.addEventListener('mouseleave', () => {
            shapes.forEach(shape => {
                shape.classList.remove('cursor-near', 'cursor-far');
                shape.style.setProperty('--parallax-x', '0px');
                shape.style.setProperty('--parallax-y', '0px');
            });
        });
    }
    
}

