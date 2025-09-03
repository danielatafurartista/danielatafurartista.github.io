// Translation system for Epitome portfolio
const translations = {
    en: {
        // Navigation
        intro: "Intro",
        about: "About",
        services: "Services",
        works: "Works",
        contact: "Contact",

        // Hero section
        hero_greeting: "Hello, I'm Pablo",
        hero_title_line1: "I'm creating this",
        hero_title_line2: "website so Dani",
        hero_title_line3: "can see how the journey is <3",
        scroll_more: "Scroll For More",

        // About section
        about_title: "About Me",
        about_subtitle: "More about me",

        // Services section  
        services_title: "Services",
        services_subtitle: "What I do",

        // Works section
        works_title: "Works",
        works_subtitle: "Selected works",

        // Contact section
        contact_title: "Contact",
        contact_subtitle: "Get in touch",

        // Language switcher
        language: "Language",
        lang_english: "English",
        lang_spanish: "Español"
    },
    es: {
        // Navigation
        intro: "Inicio",
        about: "Acerca",
        services: "Servicios",
        works: "Trabajos",
        contact: "Saluda",

        // Hero section
        hero_greeting: "Hola, soy Pablo",
        hero_title_line1: "Estoy haciendo esta",
        hero_title_line2: "pagina web para que Dani",
        hero_title_line3: "vea como es la vuelta <3",
        scroll_more: "Desliza para más",

        // About section
        about_title: "Acerca de Mí",
        about_subtitle: "Más sobre mí",

        // Services section
        services_title: "Servicios",
        services_subtitle: "Lo que hago",

        // Works section
        works_title: "Trabajos",
        works_subtitle: "Trabajos seleccionados",

        // Contact section
        contact_title: "Saluda",
        contact_subtitle: "Ponte en contacto",

        // Language switcher
        language: "Idioma",
        lang_english: "English",
        lang_spanish: "Español"
    }
};

// Function to detect browser language
function detectBrowserLanguage() {
    // Get all browser language preferences in order
    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];

    // Check each language preference
    for (let lang of browserLangs) {
        // Extract the primary language code (e.g., 'en' from 'en-US')
        const primaryLang = lang.split('-')[0].toLowerCase();

        // Check if we support this language
        if (translations[primaryLang]) {
            return primaryLang;
        }
    }

    // Fallback to Spanish (since your content is originally in Spanish)
    return 'es';
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
function switchLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        updateTranslations();

        // Update language switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    }
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Log language detection info for debugging
    logLanguageDetection();

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
