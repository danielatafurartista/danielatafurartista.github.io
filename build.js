// Build script - combines views into main index.html
const fs = require('fs');

console.log('🔨 Building website...');

// Read the template file
let html = fs.readFileSync('index-template.html', 'utf8');

// List of sections to include
const sections = ['intro', 'works', 'about', 'services', 'testimonies', 'contact'];

// Replace each data-include with actual content
sections.forEach(section => {
    const placeholder = `<div data-include="${section}"></div>`;

    try {
        const sectionContent = fs.readFileSync(`views/${section}.html`, 'utf8');
        html = html.replace(placeholder, sectionContent);
        console.log(`✓ Included ${section} section`);
    } catch (error) {
        console.error(`❌ Failed to read views/${section}.html:`, error.message);
    }
});

// Remove the include-loader script since we don't need it
html = html.replace('<script src="js/include-loader.js"></script>', '');

// Remove the include-fix CSS since we don't need it
html = html.replace('<link rel="stylesheet" href="css/include-fix.css">', '');

// Write the final index.html
fs.writeFileSync('index.html', html);

console.log('✅ Built index.html successfully!');
console.log('🌐 Your website is ready at http://localhost:8000');
console.log('');
console.log('📝 To make changes:');
console.log('   1. Edit files in views/ directory');
console.log('   2. Run: node build.js');
console.log('   3. Refresh browser');
console.log('');
console.log('🚀 For auto-rebuild: node watch-build.js');