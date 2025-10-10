// Fetch project slug from URL, load data/projects.json and render content.
(function () {
    'use strict';

    // --- Carousel Logic ---
    let currentSlide = 0;
    let slides = [];

    function showSlide(index) {
        slides.forEach(function (slide) {
            slide.style.display = 'none';
        });
        if (slides[index]) {
            slides[index].style.display = 'block';
        }
        currentSlide = index;
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) newIndex = 0;
        showSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        showSlide(newIndex);
    }


    // --- Data Loading and Page Building ---
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function buildPage(project, lang) {
        const content = project[lang] || project.es; // Fallback to Spanish
        document.title = content.title + ' — Daniela Tafur';
        const carouselContainer = document.getElementById('project-carousel');
        let carouselHtml = '';

        // Support both "images" (backward compatibility) and "media" (new format)
        const mediaItems = project.media || project.images || [];

        if (mediaItems.length) {
            mediaItems.forEach((item, index) => {
                // First item loads eager with high priority, rest lazy
                const loading = index === 0 ? 'eager' : 'lazy';
                const fetchpriority = index === 0 ? 'fetchpriority="high"' : '';
                const decoding = index === 0 ? 'decoding="sync"' : 'decoding="async"';

                // Check if item has explicit type or infer from structure
                const itemType = item.type || (item.videoId ? 'youtube' : 'image');

                if (itemType === 'youtube') {
                    carouselHtml += `
                        <div class="slide">
                            <iframe 
                                src="https://www.youtube.com/embed/${item.videoId}?rel=0" 
                                title="${item.alt || content.title}"
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowfullscreen
                                loading="${loading}">
                            </iframe>
                        </div>`;
                } else {
                    carouselHtml += `
                        <div class="slide">
                            <img src="${item.src}" 
                                 alt="${item.alt || content.title}" 
                                 loading="${loading}" 
                                 ${fetchpriority} 
                                 ${decoding}>
                        </div>`;
                }
            });
        }
        carouselContainer.innerHTML = carouselHtml;

        const infoContainer = document.getElementById('project-info');
        let infoHtml = `
            <div class="project-title">
                <h1>${content.title}</h1>
            </div>
            <div class="project-details">
                <p>${content.technical_details.replace(/\n/g, '<br>') || 'N/A'}</p>
                <p>${(content.description || '').replace(/\n/g, '<br>')}</p>
            </div>
        `;
        infoContainer.innerHTML = infoHtml;

        slides = Array.from(carouselContainer.querySelectorAll('.slide'));
        const carouselNav = document.querySelector('.carousel-nav');
        const prevButton = document.getElementById('prev-slide');
        const nextButton = document.getElementById('next-slide');

        if (slides.length > 1) {
            carouselNav.style.display = 'block';
            carouselNav.classList.add('visible');

            // Remove old event listeners by cloning and replacing
            const newPrevButton = prevButton.cloneNode(true);
            const newNextButton = nextButton.cloneNode(true);
            prevButton.parentNode.replaceChild(newPrevButton, prevButton);
            nextButton.parentNode.replaceChild(newNextButton, nextButton);

            newPrevButton.addEventListener('click', prevSlide);
            newNextButton.addEventListener('click', nextSlide);
            showSlide(0);
        } else if (slides.length === 1) {
            carouselNav.style.display = 'none';
            carouselNav.classList.remove('visible');
            showSlide(0);
        } else {
            carouselNav.style.display = 'none';
            carouselNav.classList.remove('visible');
        }
    }

    let currentProject = null;
    let projectsData = null;

    function getCurrentLanguage() {
        return localStorage.getItem('language') || 'es';
    }

    function loadAndRender() {
        const slug = getQueryParam('project');
        const lang = getCurrentLanguage();
        const projectRoot = document.getElementById('project-root');

        if (!slug) {
            projectRoot.innerHTML = '<p style="text-align:center;">Proyecto no encontrado. <a href="index.html">Volver</a>.</p>';
            return;
        }

        if (projectsData && currentProject) {
            buildPage(currentProject, lang);
        } else {
            fetch('data/projects.json')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(function (data) {
                    projectsData = data;
                    currentProject = (data.projects || []).find(p => p.slug === slug);
                    if (currentProject) {
                        buildPage(currentProject, lang);
                    } else {
                        projectRoot.innerHTML = '<p style="text-align:center;">Proyecto no encontrado. <a href="index.html">Volver</a>.</p>';
                    }
                })
                .catch(function () {
                    projectRoot.innerHTML = '<p style="text-align:center;">Error al cargar los datos del proyecto. <a href="index.html">Volver</a>.</p>';
                });
        }
    }

    function init() {
        loadAndRender();
        window.addEventListener('languageChanged', function () {
            loadAndRender();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
