// Solar Panels Oldham - JavaScript Build Script
// Simple build tool for code optimization and minification

const fs = require('fs');
const path = require('path');

// ===== BUILD CONFIGURATION =====

const BUILD_CONFIG = {
    sourceDir: './js',
    outputDir: './dist/js',
    files: [
        'performance.js',
        'accessibility.js', 
        'error-handling.js',
        'main.js',
        'forms.js',
        'analytics.js'
    ],
    criticalFiles: [
        'performance.js',
        'main.js'
    ],
    nonCriticalFiles: [
        'accessibility.js',
        'error-handling.js',
        'forms.js',
        'analytics.js'
    ]
};

// ===== UTILITY FUNCTIONS =====

// Simple minification (remove comments, extra whitespace)
function minifyCode(code) {
    return code
        // Remove single-line comments (but keep license headers)
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments (but keep license headers)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around operators
        .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
        // Remove trailing whitespace
        .replace(/\s+$/gm, '')
        // Remove empty lines
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

// Add license header
function addLicenseHeader(code) {
    const header = `/* Solar Panels Oldham - Optimized JavaScript
 * Generated: ${new Date().toISOString()}
 * Size: ${code.length} bytes
 */\n\n`;
    return header + code;
}

// Create bundle
function createBundle(files, bundleName) {
    let bundle = '';
    
    files.forEach(file => {
        const filePath = path.join(BUILD_CONFIG.sourceDir, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            bundle += `\n// ${file}\n${content}\n`;
        } else {
            console.warn(`Warning: File ${file} not found`);
        }
    });
    
    return bundle;
}

// Write file with size information
function writeFile(filePath, content) {
    // Ensure output directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    const size = (content.length / 1024).toFixed(2);
    console.log(`✓ Created: ${filePath} (${size} KB)`);
}

// ===== BUILD FUNCTIONS =====

// Build critical bundle
function buildCriticalBundle() {
    console.log('\n🔧 Building critical bundle...');
    
    const bundle = createBundle(BUILD_CONFIG.criticalFiles, 'critical');
    const minified = minifyCode(bundle);
    const withHeader = addLicenseHeader(minified);
    
    const outputPath = path.join(BUILD_CONFIG.outputDir, 'critical.min.js');
    writeFile(outputPath, withHeader);
    
    return withHeader;
}

// Build non-critical bundle
function buildNonCriticalBundle() {
    console.log('\n🔧 Building non-critical bundle...');
    
    const bundle = createBundle(BUILD_CONFIG.nonCriticalFiles, 'non-critical');
    const minified = minifyCode(bundle);
    const withHeader = addLicenseHeader(minified);
    
    const outputPath = path.join(BUILD_CONFIG.outputDir, 'non-critical.min.js');
    writeFile(outputPath, withHeader);
    
    return withHeader;
}

// Build individual minified files
function buildIndividualFiles() {
    console.log('\n🔧 Building individual minified files...');
    
    BUILD_CONFIG.files.forEach(file => {
        const sourcePath = path.join(BUILD_CONFIG.sourceDir, file);
        if (fs.existsSync(sourcePath)) {
            const content = fs.readFileSync(sourcePath, 'utf8');
            const minified = minifyCode(content);
            const withHeader = addLicenseHeader(minified);
            
            const outputPath = path.join(BUILD_CONFIG.outputDir, file.replace('.js', '.min.js'));
            writeFile(outputPath, withHeader);
        }
    });
}

// Build complete bundle
function buildCompleteBundle() {
    console.log('\n🔧 Building complete bundle...');
    
    const bundle = createBundle(BUILD_CONFIG.files, 'complete');
    const minified = minifyCode(bundle);
    const withHeader = addLicenseHeader(minified);
    
    const outputPath = path.join(BUILD_CONFIG.outputDir, 'bundle.min.js');
    writeFile(outputPath, withHeader);
    
    return withHeader;
}

// Generate HTML includes
function generateHTMLIncludes() {
    console.log('\n🔧 Generating HTML includes...');
    
    const criticalPath = './dist/js/critical.min.js';
    const nonCriticalPath = './dist/js/non-critical.min.js';
    
    const html = `<!-- Critical JavaScript (load immediately) -->
<script src="${criticalPath}"></script>

<!-- Non-critical JavaScript (load after page load) -->
<script>
window.addEventListener('load', function() {
    const script = document.createElement('script');
    script.src = '${nonCriticalPath}';
    script.async = true;
    document.head.appendChild(script);
});
</script>`;
    
    const outputPath = path.join(BUILD_CONFIG.outputDir, 'includes.html');
    writeFile(outputPath, html);
    
    return html;
}

// Generate build report
function generateBuildReport() {
    console.log('\n📊 Generating build report...');
    
    const report = {
        timestamp: new Date().toISOString(),
        files: [],
        totalSize: 0,
        recommendations: []
    };
    
    BUILD_CONFIG.files.forEach(file => {
        const sourcePath = path.join(BUILD_CONFIG.sourceDir, file);
        const outputPath = path.join(BUILD_CONFIG.outputDir, file.replace('.js', '.min.js'));
        
        if (fs.existsSync(sourcePath) && fs.existsSync(outputPath)) {
            const sourceSize = fs.statSync(sourcePath).size;
            const outputSize = fs.statSync(outputPath).size;
            const compression = ((sourceSize - outputSize) / sourceSize * 100).toFixed(1);
            
            report.files.push({
                file: file,
                originalSize: (sourceSize / 1024).toFixed(2) + ' KB',
                minifiedSize: (outputSize / 1024).toFixed(2) + ' KB',
                compression: compression + '%'
            });
            
            report.totalSize += outputSize;
        }
    });
    
    // Add recommendations
    if (report.totalSize > 40 * 1024) { // 40KB
        report.recommendations.push('Consider code splitting to reduce bundle size');
    }
    
    if (report.totalSize > 100 * 1024) { // 100KB
        report.recommendations.push('Bundle size is large - implement lazy loading');
    }
    
    const reportPath = path.join(BUILD_CONFIG.outputDir, 'build-report.json');
    writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n📋 Build Summary:');
    console.log(`Total minified size: ${(report.totalSize / 1024).toFixed(2)} KB`);
    console.log(`Files processed: ${report.files.length}`);
    
    if (report.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        report.recommendations.forEach(rec => console.log(`- ${rec}`));
    }
    
    return report;
}

// ===== MAIN BUILD PROCESS =====

function build() {
    console.log('🚀 Starting JavaScript build process...');
    console.log(`Source directory: ${BUILD_CONFIG.sourceDir}`);
    console.log(`Output directory: ${BUILD_CONFIG.outputDir}`);
    
    try {
        // Build all bundles
        buildCriticalBundle();
        buildNonCriticalBundle();
        buildIndividualFiles();
        buildCompleteBundle();
        
        // Generate includes
        generateHTMLIncludes();
        
        // Generate report
        generateBuildReport();
        
        console.log('\n✅ Build completed successfully!');
        console.log(`Output files are in: ${BUILD_CONFIG.outputDir}`);
        
    } catch (error) {
        console.error('\n❌ Build failed:', error.message);
        process.exit(1);
    }
}

// ===== COMMAND LINE INTERFACE =====

if (require.main === module) {
    const args = process.argv.slice(2);
    
    switch (args[0]) {
        case 'critical':
            buildCriticalBundle();
            break;
        case 'non-critical':
            buildNonCriticalBundle();
            break;
        case 'individual':
            buildIndividualFiles();
            break;
        case 'complete':
            buildCompleteBundle();
            break;
        case 'html':
            generateHTMLIncludes();
            break;
        case 'report':
            generateBuildReport();
            break;
        default:
            build();
    }
}

// Export functions for programmatic use
module.exports = {
    build,
    buildCriticalBundle,
    buildNonCriticalBundle,
    buildIndividualFiles,
    buildCompleteBundle,
    generateHTMLIncludes,
    generateBuildReport,
    minifyCode,
    BUILD_CONFIG
};