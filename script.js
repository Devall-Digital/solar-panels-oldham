// Calculator State
// Updated: Realistic UK solar panel calculations (2024)
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
// Updated with realistic UK values and formulas
function calculateSolarSystem() {
    const { roofSize, energyUsage, roofOrientation, roofPitch, shading, propertyType } = calculatorState;
    
    // UK Realistic Values (2024)
    // Solar irradiance for Greater Manchester/Oldham area: ~950 kWh/m²/year
    const annualSolarIrradiance = 950; // kWh/m²/year (UK average is 900-1100)
    
    // Modern UK solar panel specifications
    const panelEfficiency = 0.20; // 20% efficiency (typical modern panels)
    const panelSize = 1.7; // m² per panel (standard UK panel size)
    const panelPower = 0.375; // kW per panel (375W - typical modern UK panel)
    
    // UK installation costs (2024)
    const costPerkW = 2000; // £2,000 per kW installed (includes panels, inverter, installation)
    
    // UK electricity price (2024 average)
    const electricityPrice = 0.32; // £0.32 per kWh (UK average as of 2024)
    const exportPrice = 0.15; // £0.15 per kWh (Smart Export Guarantee - typical rate)
    
    // Orientation efficiency multipliers (UK-specific, south-facing is optimal)
    const orientationEfficiency = {
        'south': 1.0,        // Optimal
        'southeast': 0.95,   // Very good
        'southwest': 0.95,   // Very good
        'east': 0.85,        // Good
        'west': 0.85         // Good
    };
    
    // Pitch efficiency (30-40 degrees is optimal for UK latitude ~53°N)
    // Optimal pitch for UK is around 35-40 degrees
    const optimalPitch = 37.5; // degrees
    const pitchEfficiency = Math.max(0.75, 1 - Math.abs(roofPitch - optimalPitch) / 60);
    
    // Shading efficiency (reduces output linearly)
    // Shading value: 0-100 (0 = no shading, 100 = fully shaded)
    const shadingEfficiency = 1 - (shading / 100) * 0.4; // Up to 40% reduction
    
    // Calculate available roof area for panels
    // Typically 70-80% of roof area can be used (accounting for edges, obstructions, etc.)
    const usableRoofArea = roofSize * 0.75; // 75% usable area
    
    // Calculate maximum number of panels that fit
    const maxPanels = Math.floor(usableRoofArea / panelSize);
    const maxSystemSize = maxPanels * panelPower;
    
    // Calculate annual energy generation per kW of system
    // Formula: Annual Irradiance (kWh/m²/year) × Area per kW (m²/kW) × Panel Efficiency × Performance Factors
    const systemPerformanceRatio = orientationEfficiency[roofOrientation] * 
                                   pitchEfficiency * 
                                   shadingEfficiency;
    
    // Calculate area required per kW of installed capacity
    // 1 kW = panelPower kW per panel, so 1 kW = 1/panelPower panels
    // Area per kW = (1/panelPower) × panelSize
    const areaPerkW = (1 / panelPower) * panelSize; // m² per kW
    
    // Annual generation per kW of installed capacity
    // This accounts for: irradiance per m² × area per kW × efficiency × performance factors
    const annualGenerationPerkW = annualSolarIrradiance * areaPerkW * panelEfficiency * systemPerformanceRatio;
    
    // Calculate required system size based on energy usage
    const annualEnergyUsage = energyUsage * 12; // Convert monthly to annual
    
    // Target: Generate enough to cover 80-90% of usage (accounting for seasonal variation)
    const targetCoverage = 0.85; // 85% of annual usage
    const requiredGeneration = annualEnergyUsage * targetCoverage;
    const requiredSystemSize = requiredGeneration / annualGenerationPerkW;
    
    // Determine actual system size (limited by roof space and budget)
    const budgetSystemSize = calculatorState.budget / costPerkW;
    
    // Take the minimum of: required size, roof capacity, and budget
    const systemSize = Math.min(requiredSystemSize, maxSystemSize, budgetSystemSize);
    
    // Round down to nearest panel
    const numPanels = Math.max(1, Math.floor(systemSize / panelPower));
    const actualSystemSize = numPanels * panelPower;
    
    // Calculate actual annual generation
    const annualGeneration = actualSystemSize * annualGenerationPerkW;
    
    // Calculate costs
    // Base cost scales with system size
    let baseCost = actualSystemSize * costPerkW;
    
    // Small systems (< 3kW) have slightly higher per-kW cost
    if (actualSystemSize < 3) {
        baseCost = actualSystemSize * (costPerkW * 1.1);
    }
    // Large systems (> 6kW) have slightly lower per-kW cost
    else if (actualSystemSize > 6) {
        baseCost = actualSystemSize * (costPerkW * 0.95);
    }
    
    const installationCost = Math.round(baseCost);
    
    // Calculate savings
    // Self-consumption: Typically 30-50% of generation is used directly
    // Remaining is exported to grid
    const selfConsumptionRate = 0.4; // 40% self-consumed, 60% exported
    const selfConsumed = Math.min(annualGeneration * selfConsumptionRate, annualEnergyUsage);
    const exported = annualGeneration - selfConsumed;
    
    // Savings from self-consumption (avoid buying from grid)
    const selfConsumptionSavings = selfConsumed * electricityPrice;
    
    // Income from export (Smart Export Guarantee)
    const exportIncome = exported * exportPrice;
    
    // Total annual savings
    const annualSavings = selfConsumptionSavings + exportIncome;
    
    // Calculate ROI and payback period
    const roi = installationCost > 0 ? ((annualSavings / installationCost) * 100).toFixed(1) : '0.0';
    const paybackPeriod = annualSavings > 0 ? (installationCost / annualSavings).toFixed(1) : '999';
    
    // CO2 reduction (UK grid average: 0.233 kg CO2 per kWh)
    const co2PerkWh = 0.233; // kg CO2 per kWh
    const co2Reduction = (annualGeneration * co2PerkWh / 1000).toFixed(1); // Convert to tonnes
    
    return {
        systemSize: actualSystemSize,
        numPanels: numPanels,
        installCost: installationCost,
        annualSavings: annualSavings,
        roi: roi,
        paybackPeriod: paybackPeriod,
        co2Reduction: co2Reduction,
        annualGeneration: annualGeneration,
        annualConsumption: annualEnergyUsage,
        selfConsumed: selfConsumed,
        exported: exported
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
            maintainAspectRatio: false,
            aspectRatio: 2,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
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
            maintainAspectRatio: false,
            aspectRatio: 2,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
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
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            cutout: '70%',
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
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
    
    // Handle window resize to ensure charts stay responsive
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (savingsChart) savingsChart.resize();
            if (energyChart) energyChart.resize();
            if (roiChart) roiChart.resize();
        }, 250);
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
    
    // Physics-based bouncing for shapes
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const shapePhysics = Array.from(shapes).map((shape, index) => {
        const rect = shape.getBoundingClientRect();
        const width = rect.width || 200;
        const height = rect.height || 150;
        
        // Random starting position (with padding from edges)
        const isMobile = viewportWidth < 768;
        const padding = isMobile ? 60 : 100;
        const startX = padding + Math.random() * (viewportWidth - padding * 2);
        const startY = padding + Math.random() * (viewportHeight - padding * 2);
        
        return {
            element: shape,
            x: startX, // Center X
            y: startY,  // Center Y
            vx: (Math.random() - 0.5) * 0.4, // Random velocity X (-0.2 to 0.2 px/frame)
            vy: (Math.random() - 0.5) * 0.4, // Random velocity Y (-0.2 to 0.2 px/frame)
            width: width,
            height: height
        };
    });
    
    // Scroll tracking variables
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollVelocity = 0;
    let lastScrollTime = Date.now();
    let scrollTimeout = null;
    
    // Cursor tracking variables (desktop only)
    let mouseX = 0;
    let mouseY = 0;
    let isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    // Physics animation loop
    function animateShapes() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobile = viewportWidth < 768;
        const padding = isMobile ? 30 : 50; // Smaller padding on mobile
        
        shapePhysics.forEach(physics => {
            // Update dimensions from element (in case of resize)
            const rect = physics.element.getBoundingClientRect();
            physics.width = rect.width;
            physics.height = rect.height;
            
            // Update position
            physics.x += physics.vx;
            physics.y += physics.vy;
            
            // Bounce off edges (with some padding to keep shapes visible)
            if (physics.x - physics.width / 2 < padding || physics.x + physics.width / 2 > viewportWidth - padding) {
                physics.vx *= -1; // Reverse X velocity
                physics.x = Math.max(padding + physics.width / 2, Math.min(viewportWidth - padding - physics.width / 2, physics.x));
            }
            
            if (physics.y - physics.height / 2 < padding || physics.y + physics.height / 2 > viewportHeight - padding) {
                physics.vy *= -1; // Reverse Y velocity
                physics.y = Math.max(padding + physics.height / 2, Math.min(viewportHeight - padding - physics.height / 2, physics.y));
            }
            
            // Update CSS position (absolute positioning with parallax offset)
            const parallaxX = physics.element.style.getPropertyValue('--parallax-x') || '0px';
            const parallaxY = physics.element.style.getPropertyValue('--parallax-y') || '0px';
            
            // Apply position directly in pixels (more accurate for bouncing)
            physics.element.style.left = `calc(${physics.x - physics.width / 2}px + ${parallaxX})`;
            physics.element.style.top = `calc(${physics.y - physics.height / 2}px + ${parallaxY})`;
            physics.element.style.right = 'auto';
            physics.element.style.bottom = 'auto';
        });
        
        requestAnimationFrame(animateShapes);
    }
    
    // Start physics animation
    animateShapes();
    
    // Handle window resize - keep shapes within bounds
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            
            const isMobile = newWidth < 768;
            const padding = isMobile ? 30 : 50;
            
            shapePhysics.forEach(physics => {
                // Update dimensions
                const rect = physics.element.getBoundingClientRect();
                physics.width = rect.width;
                physics.height = rect.height;
                
                // Keep shapes within new viewport bounds
                physics.x = Math.max(physics.width / 2 + padding, Math.min(newWidth - physics.width / 2 - padding, physics.x));
                physics.y = Math.max(physics.height / 2 + padding, Math.min(newHeight - physics.height / 2 - padding, physics.y));
            });
        }, 250);
    });
    
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

