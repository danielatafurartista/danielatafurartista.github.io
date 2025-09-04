const fs = require('fs');

console.log('👀 Auto-build watcher started');
console.log('🌐 Your website: http://localhost:8000');
console.log('📝 Edit any file in views/ directory to auto-rebuild');
console.log('🛑 Press Ctrl+C to stop\n');

function buildSite() {
    console.log('🔄 Rebuilding...');

    let html = fs.readFileSync('index-template.html', 'utf8');


    const sections = ['intro', 'works', 'about', 'services', 'testimonies', 'contact'];

    sections.forEach(section => {
        const placeholder = `<div data-include="${section}"></div>`;

        try {
            const sectionContent = fs.readFileSync(`views/${section}.html`, 'utf8');
            html = html.replace(placeholder, sectionContent);
        } catch (error) {
            console.error(`❌ Failed to read views/${section}.html:`, error.message);
        }
    });

    html = html.replace('<script src="js/include-loader.js"></script>', '');

    html = html.replace('<link rel="stylesheet" href="css/include-fix.css">', '');

    fs.writeFileSync('index.html', html);

    const timestamp = new Date().toLocaleTimeString();
    console.log(`✅ Built index.html (${timestamp})`);
}


buildSite();


fs.watch('views/', (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
        console.log(`📝 ${filename} changed`);
        buildSite();
    }
});


process.on('SIGINT', () => {
    console.log('\n👋 Stopping auto-build watcher...');
    process.exit(0);
});