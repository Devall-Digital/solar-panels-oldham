/* Solar Panels Oldham - Build System */
/* Optimizes and prepares files for production deployment */

const fs = require('fs');
const path = require('path');

// Build configuration
const config = {
    sourceDir: './assets',
    outputDir: './public',
    buildDir: './build/dist',
    reportsDir: './build/reports',
    
    // Files to process
    cssFiles: [
        'css/main.css',
        'css/responsive.css', 
        'css/components.css'
    ],
    jsFiles: [
        'js/config.js',
        'js/performance.js',
        'js/main.js',
        'js/forms.js',
        'js/analytics.js',
        'js/accessibility.js',
        'js/error-handling.js'
    ],
    
    // Performance targets
    targets: {
        cssSize: 100 * 1024, // 100KB
        jsSize: 200 * 1024,  // 200KB
        imageSize: 500 * 1024 // 500KB
    }
};

// Utility functions
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`Created directory: ${dir}`);
    }
}

function copyFile(src, dest) {
    try {
        ensureDir(path.dirname(dest));
        fs.copyFileSync(src, dest);
        log(`Copied: ${src} → ${dest}`);
        return true;
    } catch (error) {
        log(`Failed to copy ${src}: ${error.message}`, 'error');
        return false;
    }
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Build functions
function buildCSS() {
    log('Building CSS files...');
    let totalSize = 0;
    
    config.cssFiles.forEach(cssFile => {
        const srcPath = path.join(config.sourceDir, cssFile);
        const destPath = path.join(config.outputDir, cssFile);
        
        if (copyFile(srcPath, destPath)) {
            const size = getFileSize(destPath);
            totalSize += size;
            log(`CSS: ${cssFile} (${formatBytes(size)})`);
        }
    });
    
    log(`Total CSS size: ${formatBytes(totalSize)}`);
    return totalSize;
}

function buildJS() {
    log('Building JavaScript files...');
    let totalSize = 0;
    
    config.jsFiles.forEach(jsFile => {
        const srcPath = path.join(config.sourceDir, jsFile);
        const destPath = path.join(config.outputDir, jsFile);
        
        if (copyFile(srcPath, destPath)) {
            const size = getFileSize(destPath);
            totalSize += size;
            log(`JS: ${jsFile} (${formatBytes(size)})`);
        }
    });
    
    log(`Total JS size: ${formatBytes(totalSize)}`);
    return totalSize;
}

function buildImages() {
    log('Building image files...');
    const imageDir = path.join(config.sourceDir, 'images');
    const outputImageDir = path.join(config.outputDir, 'images');
    
    if (!fs.existsSync(imageDir)) {
        log('No images directory found', 'error');
        return 0;
    }
    
    let totalSize = 0;
    let fileCount = 0;
    
    function copyImagesRecursive(srcDir, destDir) {
        ensureDir(destDir);
        
        const items = fs.readdirSync(srcDir);
        items.forEach(item => {
            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);
            const stat = fs.statSync(srcPath);
            
            if (stat.isDirectory()) {
                copyImagesRecursive(srcPath, destPath);
            } else {
                if (copyFile(srcPath, destPath)) {
                    const size = getFileSize(destPath);
                    totalSize += size;
                    fileCount++;
                    log(`Image: ${item} (${formatBytes(size)})`);
                }
            }
        });
    }
    
    copyImagesRecursive(imageDir, outputImageDir);
    log(`Total images: ${fileCount} files, ${formatBytes(totalSize)}`);
    return totalSize;
}

function buildHTML() {
    log('Building HTML files...');
    
    // Copy main index.html
    const srcIndex = path.join(config.outputDir, 'index.html');
    const destIndex = path.join(config.buildDir, 'index.html');
    
    if (fs.existsSync(srcIndex)) {
        let htmlContent = fs.readFileSync(srcIndex, 'utf8');
        
        // Update paths for production (remove ../assets/ prefix)
        htmlContent = htmlContent.replace(/\.\.\/assets\//g, 'assets/');
        
        ensureDir(path.dirname(destIndex));
        fs.writeFileSync(destIndex, htmlContent);
        log(`Built: index.html (${formatBytes(getFileSize(destIndex))})`);
    }
    
    // Copy other HTML files
    const htmlFiles = ['404.html'];
    htmlFiles.forEach(htmlFile => {
        const srcPath = path.join(config.outputDir, htmlFile);
        const destPath = path.join(config.buildDir, htmlFile);
        copyFile(srcPath, destPath);
    });
}

function buildServerFiles() {
    log('Building server files...');
    
    const serverFiles = [
        'robots.txt',
        'sitemap.xml',
        'favicon.ico'
    ];
    
    serverFiles.forEach(file => {
        const srcPath = path.join(config.outputDir, file);
        const destPath = path.join(config.buildDir, file);
        copyFile(srcPath, destPath);
    });
}

function generateReport(cssSize, jsSize, imageSize) {
    log('Generating build report...');
    
    const report = {
        timestamp: new Date().toISOString(),
        buildType: 'production',
        fileSizes: {
            css: {
                size: cssSize,
                formatted: formatBytes(cssSize),
                target: config.targets.cssSize,
                targetFormatted: formatBytes(config.targets.cssSize)
            },
            js: {
                size: jsSize,
                formatted: formatBytes(jsSize),
                target: config.targets.jsSize,
                targetFormatted: formatBytes(config.targets.jsSize)
            },
            images: {
                size: imageSize,
                formatted: formatBytes(imageSize),
                target: config.targets.imageSize,
                targetFormatted: formatBytes(config.targets.imageSize)
            }
        },
        totalSize: cssSize + jsSize + imageSize,
        performance: {
            cssOptimized: cssSize <= config.targets.cssSize,
            jsOptimized: jsSize <= config.targets.jsSize,
            imagesOptimized: imageSize <= config.targets.imageSize
        },
        recommendations: []
    };
    
    // Generate recommendations
    if (cssSize > config.targets.cssSize) {
        report.recommendations.push('Consider CSS minification and critical CSS inlining');
    }
    if (jsSize > config.targets.jsSize) {
        report.recommendations.push('Consider JavaScript bundling and code splitting');
    }
    if (imageSize > config.targets.imageSize) {
        report.recommendations.push('Optimize images and consider WebP format');
    }
    
    // Save report
    const reportPath = path.join(config.reportsDir, `build-report-${Date.now()}.json`);
    ensureDir(config.reportsDir);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    log(`Build report saved: ${reportPath}`);
    return report;
}

// Main build function
function build(type = 'complete') {
    log(`Starting ${type} build...`);
    
    try {
        // Ensure build directories exist
        ensureDir(config.buildDir);
        ensureDir(config.reportsDir);
        
        let cssSize = 0, jsSize = 0, imageSize = 0;
        
        switch (type) {
            case 'css':
                cssSize = buildCSS();
                break;
            case 'js':
                jsSize = buildJS();
                break;
            case 'images':
                imageSize = buildImages();
                break;
            case 'html':
                buildHTML();
                break;
            case 'server':
                buildServerFiles();
                break;
            case 'complete':
            default:
                cssSize = buildCSS();
                jsSize = buildJS();
                imageSize = buildImages();
                buildHTML();
                buildServerFiles();
                break;
        }
        
        // Generate report for complete builds
        if (type === 'complete') {
            const report = generateReport(cssSize, jsSize, imageSize);
            log(`Build complete! Total size: ${formatBytes(report.totalSize)}`);
            
            // Display recommendations
            if (report.recommendations.length > 0) {
                log('Recommendations:', 'info');
                report.recommendations.forEach(rec => log(`  • ${rec}`));
            }
        }
        
        log(`Build completed successfully!`, 'success');
        
    } catch (error) {
        log(`Build failed: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Command line interface
const args = process.argv.slice(2);
const buildType = args[0] || 'complete';

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Solar Panels Oldham - Build System

Usage: node build.js [type]

Types:
  complete    - Full build (default)
  css         - CSS files only
  js          - JavaScript files only
  images      - Image files only
  html        - HTML files only
  server      - Server files only

Examples:
  node build.js
  node build.js css
  node build.js js
    `);
    process.exit(0);
}

build(buildType);