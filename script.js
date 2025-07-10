// Custom cursor follower (mobile-optimized)
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let animationId = null;

// Check if mobile device and disable cursor if needed
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEndDevice = (navigator.deviceMemory || 4) < 4 || (navigator.hardwareConcurrency || 4) < 4;

if (isMobile || isLowEndDevice) {
    // Disable cursor on mobile/low-end devices
    if (cursorFollower) {
        cursorFollower.style.display = 'none';
    }
} else {
    // Show cursor after page loads (desktop only)
    setTimeout(() => {
        if (cursorFollower) {
            cursorFollower.style.opacity = '1';
        }
    }, 2000);

    // Mouse movement tracking (desktop only)
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor following animation with conflict prevention
    function animateCursor() {
        if (!cursorFollower) return;
        
        const speed = 0.15;
        
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursorFollower.style.left = cursorX - 10 + 'px';
        cursorFollower.style.top = cursorY - 10 + 'px';
        
        animationId = requestAnimationFrame(animateCursor);
    }

    // Start animation only if not already running
    if (!animationId) {
        animateCursor();
    }
    
    // Clean up animation on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// Enhanced hover effects for text lines
const textLines = document.querySelectorAll('.line');
const container = document.querySelector('.container');

textLines.forEach((line, index) => {
    line.addEventListener('mouseenter', () => {
        // Scale up cursor
        cursorFollower.style.transform = 'scale(2)';
        cursorFollower.style.backgroundColor = '#ffffff';
        
        // Add glow effect to text
        line.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        
        // Subtle container tilt based on which line is hovered
        const tiltAmount = (index - 1) * 2; // -2, 0, 2 for the three lines
        container.style.transform = `perspective(1000px) rotateX(${tiltAmount}deg)`;
    });
    
    line.addEventListener('mouseleave', () => {
        // Reset cursor
        cursorFollower.style.transform = 'scale(1)';
        cursorFollower.style.backgroundColor = '#ffffff';
        
        // Remove glow effect
        line.style.textShadow = 'none';
        
        // Reset container tilt
        container.style.transform = 'perspective(1000px) rotateX(0deg)';
    });
    
    // Click effect
    line.addEventListener('click', (event) => {
        // Brief scale animation
        line.style.transform = 'scale(0.95)';
        setTimeout(() => {
            line.style.transform = 'scale(1)';
        }, 150);
        
        // Create ripple effect
        createRipple(event);
    });
});

// Ripple effect function
function createRipple(event) {
    const ripple = document.createElement('div');
    const rect = event.target.getBoundingClientRect();
    const size = 60;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 100;
    `;
    
    event.target.style.position = 'relative';
    event.target.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Background interaction based on mouse position (mobile-optimized)
let ticking = false;
let mouseMoveAnimationId = null;

function throttledMouseMove(e) {
    if (!ticking) {
        ticking = true;
        
        mouseMoveAnimationId = requestAnimationFrame(() => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Only apply effects on desktop
            if (!isMobile && !isLowEndDevice) {
                // Subtle parallax effect on background pattern
                const backgroundPattern = document.querySelector('.background-pattern');
                if (backgroundPattern) {
                    const moveX = (x - 0.5) * 30;
                    const moveY = (y - 0.5) * 30;
                    backgroundPattern.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
                
                // Adjust animation speeds based on mouse position
                const pulseCircle = document.querySelector('.pulse-circle');
                const rotatingBorder = document.querySelector('.rotating-border');
                
                if (pulseCircle) {
                    const pulseSpeed = 2 + (x * 2); // 2-4 seconds
                    pulseCircle.style.animationDuration = `${pulseSpeed}s`;
                }
                
                if (rotatingBorder) {
                    const rotateSpeed = 6 + (y * 4); // 6-10 seconds
                    rotatingBorder.style.animationDuration = `${rotateSpeed}s`;
                }
            }
            
            ticking = false;
        });
    }
}

// Only add mouse move listener on desktop
if (!isMobile && !isLowEndDevice) {
    document.addEventListener('mousemove', throttledMouseMove);
}

// Keyboard interactions
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        
        // Random text effects on spacebar
        textLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transform = 'scale(1.1) rotate(1deg)';
                line.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
                
                setTimeout(() => {
                    line.style.transform = 'scale(1) rotate(0deg)';
                    line.style.textShadow = 'none';
                }, 200);
            }, index * 100);
        });
    }
});

// Touch device support (mobile-optimized)
let touchStartX = 0;
let touchStartY = 0;
let touchAnimationId = null;

// Only enable touch effects on desktop (not mobile)
if (!isMobile && !isLowEndDevice) {
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        // Only prevent default for specific elements to avoid conflicts
        if (e.target.closest('.cursor-follower, .particle, .pulse-circle')) {
            e.preventDefault();
        }
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        // Create touch-based tilt effect with throttling
        if (!touchAnimationId) {
            touchAnimationId = requestAnimationFrame(() => {
                const tiltX = deltaY / 10;
                const tiltY = deltaX / 10;
                
                if (container) {
                    container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                }
                touchAnimationId = null;
            });
        }
    });

    document.addEventListener('touchend', () => {
        if (container) {
            container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    });
}

// Preload animation sequence
window.addEventListener('load', () => {
    // Trigger text animations with slight delays
    setTimeout(() => {
        textLines.forEach((line, index) => {
            line.style.animationDelay = `${0.2 + index * 0.2}s`;
        });
    }, 1000);
    
    // Initialize interactive elements
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2500);
});



// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length &&
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg: Invert colors
        document.body.style.background = '#ffffff';
        document.body.style.color = '#000000';
        textLines.forEach(line => {
            line.style.color = '#000000';
            if (line.style.webkitTextStroke) {
                line.style.webkitTextStroke = '2px #000000';
            }
        });
        
        setTimeout(() => {
            document.body.style.background = '#000000';
            document.body.style.color = '#ffffff';
            textLines.forEach(line => {
                line.style.color = '#ffffff';
                if (line.style.webkitTextStroke) {
                    line.style.webkitTextStroke = '2px #ffffff';
                }
            });
        }, 2000);
        
        konamiCode = [];
    }
});