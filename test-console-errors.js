const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  location: {
    href: 'http://localhost:8000',
    pathname: '/',
    hostname: 'localhost'
  },
  document: {
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
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => ({
      style: {},
      appendChild: () => {},
      remove: () => {},
      setAttribute: () => {},
      textContent: ''
    }),
    head: {
      appendChild: () => {}
    }
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
  }
};

global.document = global.window.document;
global.navigator = global.window.navigator;
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

// Mock DOM elements
global.document.querySelector = (selector) => {
  if (selector === '.cursor-follower') {
    return {
      style: { display: 'none', opacity: '0', left: '0px', top: '0px', transform: 'scale(1)', backgroundColor: '#ffffff' }
    };
  }
  if (selector === '.line') {
    return {
      style: {},
      addEventListener: () => {},
      getBoundingClientRect: () => ({ left: 0, top: 0 }),
      appendChild: () => {}
    };
  }
  if (selector === '.container') {
    return {
      style: { transform: 'perspective(1000px) rotateX(0deg)' }
    };
  }
  if (selector === '.background-pattern') {
    return {
      style: { transform: 'translate(0px, 0px)' }
    };
  }
  if (selector === '.pulse-circle') {
    return {
      style: { animationDuration: '2s' }
    };
  }
  if (selector === '.rotating-border') {
    return {
      style: { animationDuration: '6s' }
    };
  }
  return null;
};

global.document.querySelectorAll = (selector) => {
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
  return [];
};

// Test JavaScript files
const jsFiles = [
  'js/utilities.js',
  'js/mobile-responsiveness.js', 
  'js/mobile-optimization.js',
  'js/performance-monitor.js',
  'script.js'
];

console.log('🧪 Testing JavaScript files for console errors...\n');

jsFiles.forEach(file => {
  try {
    console.log(`Testing ${file}...`);
    
    // Read and execute the file
    const code = fs.readFileSync(file, 'utf8');
    
    // Wrap in try-catch to catch any runtime errors
    try {
      eval(code);
      console.log(`✅ ${file}: No errors detected`);
    } catch (runtimeError) {
      console.error(`❌ ${file}: Runtime error - ${runtimeError.message}`);
    }
    
  } catch (fileError) {
    console.error(`❌ ${file}: File error - ${fileError.message}`);
  }
});

console.log('\n🎯 Console error testing completed!');