const fs = require('fs');

// Enhanced browser environment simulation
const browserEnv = {
  window: {
    innerWidth: 1920,
    innerHeight: 1080,
    location: {
      href: 'http://localhost:8000',
      pathname: '/',
      hostname: 'localhost'
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: () => {},
    performance: {
      now: () => Date.now(),
      getEntriesByType: () => [{
        loadEventEnd: Date.now(),
        loadEventStart: Date.now() - 100
      }]
    },
    matchMedia: () => ({ matches: false }),
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      deviceMemory: 8,
      hardwareConcurrency: 8,
      maxTouchPoints: 0,
      connection: {
        effectiveType: '4g'
      }
    },
    console: {
      log: () => {},
      error: (msg) => {
        console.error('❌ Console Error:', msg);
      },
      warn: (msg) => {
        console.warn('⚠️  Console Warning:', msg);
      }
    },
    dataLayer: [],
    gtag: function() {
      this.dataLayer.push(arguments);
    }
  }
};

// Set up global environment
Object.assign(global, browserEnv);
global.document = {
  head: {
    appendChild: () => {},
    querySelector: () => null
  },
  body: {
    appendChild: () => {},
    classList: {
      add: () => {},
      remove: () => {}
    },
    style: {}
  },
  documentElement: {
    classList: {
      remove: () => {},
      add: () => {}
    },
    style: {
      setProperty: () => {}
    }
  },
  querySelector: (selector) => {
    const elements = {
      '.cursor-follower': {
        style: { display: 'none', opacity: '0', left: '0px', top: '0px', transform: 'scale(1)', backgroundColor: '#ffffff' }
      },
      '.line': {
        style: {},
        addEventListener: () => {},
        getBoundingClientRect: () => ({ left: 0, top: 0 }),
        appendChild: () => {}
      },
      '.container': {
        style: { transform: 'perspective(1000px) rotateX(0deg)' }
      },
      '.background-pattern': {
        style: { transform: 'translate(0px, 0px)' }
      },
      '.pulse-circle': {
        style: { animationDuration: '2s' }
      },
      '.rotating-border': {
        style: { animationDuration: '6s' }
      },
      '.skip-link': null,
      '.nav-toggle': null,
      '.nav-menu': null,
      '.hero': null
    };
    return elements[selector] || null;
  },
  querySelectorAll: (selector) => {
    if (selector === '.line') {
      return [
        {
          style: {},
          addEventListener: () => {},
          getBoundingClientRect: () => ({ left: 0, top: 0 }),
          appendChild: () => {}
        },
        {
          style: {},
          addEventListener: () => {},
          getBoundingClientRect: () => ({ left: 0, top: 0 }),
          appendChild: () => {}
        },
        {
          style: {},
          addEventListener: () => {},
          getBoundingClientRect: () => ({ left: 0, top: 0 }),
          appendChild: () => {}
        }
      ];
    }
    if (selector === '.reveal, .reveal-left, .reveal-right, .stagger-item') {
      return [];
    }
    if (selector === 'a, button, .interactive, .service-card, .link-item') {
      return [];
    }
    if (selector === '.cursor-outline, .cursor-dot, .cursor-follower') {
      return [];
    }
    if (selector === '.particle, .pulse-circle, .rotating-border') {
      return [];
    }
    if (selector === '[data-parallax]') {
      return [];
    }
    if (selector === '.floating-card, .hero-image') {
      return [];
    }
    if (selector === '.service-card, .area-card, .tech-card') {
      return [];
    }
    if (selector === 'img') {
      return [];
    }
    return [];
  },
  addEventListener: () => {},
  createElement: (tag) => ({
    style: {},
    appendChild: () => {},
    remove: () => {},
    setAttribute: () => {},
    textContent: '',
    getAttribute: () => null
  }),
  head: {
    appendChild: () => {}
  }
};

global.navigator = global.window.navigator;
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

// Test JavaScript files
const jsFiles = [
  'js/utilities.js',
  'js/mobile-responsiveness.js', 
  'js/mobile-optimization.js',
  'js/performance-monitor.js',
  'script.js'
];

console.log('🧪 Comprehensive JavaScript Testing...\n');

let totalErrors = 0;
let totalWarnings = 0;

jsFiles.forEach(file => {
  try {
    console.log(`Testing ${file}...`);
    
    // Read and execute the file
    const code = fs.readFileSync(file, 'utf8');
    
    // Track errors and warnings
    const originalError = console.error;
    const originalWarn = console.warn;
    let fileErrors = 0;
    let fileWarnings = 0;
    
    console.error = (msg) => {
      fileErrors++;
      totalErrors++;
      originalError(`❌ ${file}: ${msg}`);
    };
    
    console.warn = (msg) => {
      fileWarnings++;
      totalWarnings++;
      originalWarn(`⚠️  ${file}: ${msg}`);
    };
    
    // Execute the code
    try {
      eval(code);
      
      if (fileErrors === 0 && fileWarnings === 0) {
        console.log(`✅ ${file}: No errors or warnings`);
      } else {
        console.log(`📊 ${file}: ${fileErrors} errors, ${fileWarnings} warnings`);
      }
      
    } catch (runtimeError) {
      console.error(`❌ ${file}: Runtime error - ${runtimeError.message}`);
      totalErrors++;
    }
    
    // Restore console methods
    console.error = originalError;
    console.warn = originalWarn;
    
  } catch (fileError) {
    console.error(`❌ ${file}: File error - ${fileError.message}`);
    totalErrors++;
  }
});

console.log('\n📊 TEST SUMMARY:');
console.log(`Total Errors: ${totalErrors}`);
console.log(`Total Warnings: ${totalWarnings}`);

if (totalErrors === 0 && totalWarnings === 0) {
  console.log('🎉 All tests passed! No console errors or warnings detected.');
} else if (totalErrors === 0) {
  console.log('✅ No errors detected, but there are some warnings to review.');
} else {
  console.log('⚠️  Some errors were detected. Please review the output above.');
}

console.log('\n🎯 Testing completed!');