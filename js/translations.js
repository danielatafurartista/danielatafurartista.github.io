// Translation system for Epitome portfolio
const translations = {};

// Supported languages
const supportedLanguages = ['en', 'es'];

// Function to detect browser language
function detectBrowserLanguage() {
    // Get all browser language preferences in order
    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];

    // Check each language preference
    for (let lang of browserLangs) {
        // Extract the primary language code (e.g., 'en' from 'en-US')
        const primaryLang = lang.split('-')[0].toLowerCase();

        // Check if we support this language
        if (supportedLanguages.includes(primaryLang)) {
            return primaryLang;
        }
    }

    // Fallback to Spanish (since your content is originally in Spanish)
    return 'es';
}

// Function to load translation file
async function loadTranslations(lang) {
    try {
        const response = await fetch(`data/translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }
        const data = await response.json();
        translations[lang] = data;
        return true;
    } catch (error) {
        console.error(`Error loading ${lang} translations:`, error);
        return false;
    }
}

// Function to log detected language (for debugging)
function logLanguageDetection() {
    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];
    const savedLang = localStorage.getItem('language');
    const detectedLang = detectBrowserLanguage();

    console.log('🌍 Language Detection Info:');
    console.log('Browser languages:', browserLangs);
    console.log('Saved preference:', savedLang);
    console.log('Detected language:', detectedLang);
    console.log('Final language:', currentLang);
}

// Current language - priority: saved preference > browser language > default Spanish
let currentLang = localStorage.getItem('language') || detectBrowserLanguage();

// Function to translate text
function translate(key) {
    return translations[currentLang][key] || key;
}

// Function to update all translatable elements
function updateTranslations() {
    // Update elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });

    // Update title attributes
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        element.setAttribute('title', translate(key));
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Save language preference
    localStorage.setItem('language', currentLang);
}

// Function to switch language
async function switchLanguage(lang) {
    if (!supportedLanguages.includes(lang)) {
        console.error(`Language ${lang} is not supported`);
        return;
    }

    // Load translations if not already loaded
    if (!translations[lang]) {
        const loaded = await loadTranslations(lang);
        if (!loaded) {
            console.error(`Failed to switch to ${lang}`);
            return;
        }
    }

    currentLang = lang;
    updateTranslations();

    // Update language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');

    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
    // Load the current language translations
    await loadTranslations(currentLang);

    // Log language detection info for debugging (disable in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logLanguageDetection();
    }

    updateTranslations();

    // Set active language button
    document.querySelector(`[data-lang="${currentLang}"]`)?.classList.add('active');

    // Language dropdown functionality
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageToggle = document.querySelector('.language-toggle');

    if (languageToggle) {
        languageToggle.addEventListener('click', (e) => {
            e.preventDefault();
            languageDropdown.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('active');
        }
    });

    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
            // Close dropdown after selection
            languageDropdown.classList.remove('active');
        });
    });
});
