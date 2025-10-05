const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.eot': 'application/vnd.ms-fontobject',
    '.webmanifest': 'application/manifest+json'
};

function buildSite() {
    console.log('🔄 Rebuilding...');

    try {
        let html = fs.readFileSync('index-template.html', 'utf8');

        const sections = ['works', 'about', 'experience', 'contact'];

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
    } catch (error) {
        console.error('❌ Build failed:', error.message);
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, pathname);
    const ext = path.parse(filePath).ext;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
});

buildSite();

let buildTimeout = null;
function scheduleBuild(delay = 120) {
    if (buildTimeout) clearTimeout(buildTimeout);
    buildTimeout = setTimeout(() => {
        buildSite();
        buildTimeout = null;
    }, delay);
}

// watch views/ for changes (existing behavior)
if (fs.existsSync('views/')) {
    fs.watch('views/', (eventType, filename) => {
        if (filename && filename.endsWith('.html')) {
            console.log(`📝 views/${filename} changed (${eventType})`);
            scheduleBuild();
        }
    });
}

// watch the main template file
if (fs.existsSync('index-template.html')) {
    fs.watch('index-template.html', (eventType, filename) => {
        console.log(`📝 index-template.html changed (${eventType})`);
        scheduleBuild();
    });
}

// watch css/ folder for changes to rebuild when styles change
if (fs.existsSync('css/')) {
    try {
        fs.watch('css/', { persistent: true }, (eventType, filename) => {
            if (!filename) return;
            const ext = path.extname(filename).toLowerCase();
            if (ext === '.css') {
                console.log(`📝 css/${filename} changed (${eventType})`);
                scheduleBuild();
            }
        });
    } catch (err) {
        console.warn('⚠️ css folder watch failed, changes to CSS may not auto-rebuild:', err.message);
    }
}

// NEW: watch entire project directory (recursive where supported)
// - Debounced rebuilds
// - Ignore generated index.html and common VCS/node folders
try {
    const IGNORE_PREFIXES = ['node_modules', '.git', '.vscode'];
    const GENERATED_FILES = ['index.html']; // avoid rebuild loop when index.html is written

    fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        // normalize forward slashes
        const normalized = filename.replace(/\\/g, '/');

        // ignore generated files to prevent rebuild loops
        if (GENERATED_FILES.includes(path.basename(normalized))) return;

        // ignore common folders
        for (const p of IGNORE_PREFIXES) {
            if (normalized.startsWith(p + '/') || normalized === p) return;
        }

        // ignore temporary editor swap files or hidden temp names
        if (normalized.startsWith('.') || normalized.endsWith('~') || normalized.indexOf('~$') !== -1) return;

        // don't trigger on our own dev-server.js reading index.html when building (best-effort)
        console.log(`📝 ${normalized} changed (${eventType}) — scheduling rebuild`);
        scheduleBuild();
    });
} catch (err) {
    console.warn('⚠️ Project-wide watch failed, fallback watches remain:', err.message);
}

server.listen(PORT, () => {
    console.log('\n🚀 Development server started!');
    console.log(`🌐 Website: http://localhost:${PORT}`);
    console.log('📝 Edit files in views/, index-template.html, css/ or any project file - auto-rebuilds enabled');
    console.log('🛑 Press Ctrl+C to stop\n');
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down development server...');
    server.close(() => {
        process.exit(0);
    });
});
