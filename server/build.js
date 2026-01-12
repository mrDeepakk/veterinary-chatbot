/**
 * Build script to prepare public folder with widget and SDK loader
 * Run this before starting the server
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building Veterinary Chatbot...\n');

// Paths
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const sdkLoaderPath = path.join(rootDir, 'sdk', 'loader.js');
const widgetDir = path.join(rootDir, 'widget');

// Step 1: Ensure public directory exists
console.log('📁 Creating public directory...');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✅ Created public directory\n');
} else {
    console.log('✅ Public directory exists\n');
}

// Step 2: Build widget
console.log('⚛️  Building React widget...');
try {
    execSync('npm run build', {
        cwd: widgetDir,
        stdio: 'inherit'
    });
    console.log('✅ Widget built successfully\n');
} catch (error) {
    console.error('❌ Widget build failed:', error.message);
    process.exit(1);
}

// Step 3: Copy SDK loader to public folder
console.log('📋 Copying SDK loader...');
try {
    const chatbotJsPath = path.join(publicDir, 'chatbot.js');
    fs.copyFileSync(sdkLoaderPath, chatbotJsPath);
    console.log('✅ SDK loader copied to public/chatbot.js\n');
} catch (error) {
    console.error('❌ Failed to copy SDK loader:', error.message);
    process.exit(1);
}

// Step 4: Verify files exist
console.log('🔍 Verifying build artifacts...');
const requiredFiles = [
    'chatbot.js',
    'widget.js',
    'widget.js.LICENSE.txt'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ✅ ${file} (${sizeKB} KB)`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

console.log('');

if (allFilesExist) {
    console.log('✅ Build completed successfully!\n');
    console.log('🚀 You can now run: npm start\n');
} else {
    console.error('❌ Build incomplete - some files are missing\n');
    process.exit(1);
}
