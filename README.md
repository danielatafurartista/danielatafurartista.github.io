# Epitome Website - Modular Build System

## Overview

This website uses a **build system** to combine modular sections into a single `index.html` file. Each section is stored separately in the `views/` directory for easy editing and organization.

## File Structure

```
├── index.html              # 🎯 Main website (auto-generated)
├── index-template.html     # 📄 Template with placeholders
├── views/                  # 📁 Individual sections (edit these!)
│   ├── intro.html         # Hero section
│   ├── works.html         # Portfolio section
│   ├── about.html         # About section
│   ├── services.html      # Services section
│   ├── testimonies.html   # Testimonials section
│   └── contact.html       # Contact section
├── build.js               # 🔨 Build script
├── watch-build.js         # 👀 Auto-rebuild watcher
└── css/, js/, images/     # 📦 Assets
```

## Development Workflow

### Option 1: All-in-One Dev Server (Recommended)

```bash
# Start development server with auto-build
node dev-server.js

# 🎉 Serves website + auto-rebuilds when views/ change!
# View at http://localhost:8000
```

### Option 2: Manual Build + Separate Server

```bash
# 1. Edit any file in views/ directory
# 2. Build the website
node build.js

# 3. Start server
npx http-server -p 8000
```

### Option 3: Auto-Build Watcher + Separate Server

```bash
# Terminal 1: Start auto-rebuild watcher
node watch-build.js

# Terminal 2: Start server
npx http-server -p 8000
```

## How It Works

1. **Template**: `index-template.html` contains placeholders like `<div data-include="intro"></div>`
2. **Sections**: Individual HTML sections in `views/` directory
3. **Build**: Script replaces placeholders with actual section content
4. **Output**: Creates complete `index.html` file

## Editing Content

✅ **DO**: Edit files in `views/` directory  
✅ **DO**: Run build script after changes  
❌ **DON'T**: Edit `index.html` directly (it gets overwritten)

## Benefits

- ✅ **Modular**: Each section in separate file
- ✅ **Clean**: No JavaScript dependencies in final site
- ✅ **Fast**: Perfect CSS compatibility
- ✅ **Simple**: Just HTML, CSS, and a build step
- ✅ **GitHub Pages Ready**: Deploy `index.html` directly

## Deployment

For GitHub Pages or any web server:

1. Run `node build.js`
2. Commit and push `index.html`
3. Your site is ready! 🚀

## Local Development Server

```bash
# Start local server with Node.js
npx http-server -p 8000

# Or if you have http-server installed globally:
# npm install -g http-server
# http-server -p 8000

# View at http://localhost:8000
```

---

**🎯 Your website is now at: http://localhost:8000**  
**📝 Edit sections in `views/` directory**  
**🔨 Run `node build.js` or `node watch-build.js` to rebuild**
