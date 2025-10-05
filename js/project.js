// Fetch project slug from URL, load data/projects.json and render content.
(function ($) {
    'use strict';

    // --- Carousel Logic ---
    let currentSlide = 0;
    let slides = [];

    function showSlide(index) {
        slides.hide();
        $(slides[index]).show();
        currentSlide = index;
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0; // Loop back to the start
        }
        showSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1; // Loop to the end
        }
        showSlide(newIndex);
    }


    // --- Data Loading and Page Building ---
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function buildPage(project) {
        // Set page title
        document.title = project.title + ' — Daniela Tafur';

        // 1. Build Carousel
        const carouselContainer = $('#project-carousel');
        let carouselHtml = '';
        if (project.images && project.images.length) {
            project.images.forEach(img => {
                carouselHtml += `<div class="slide"><img src="${img.src}" alt="${img.alt || project.title}"></div>`;
            });
        }
        carouselContainer.html(carouselHtml);

        // 2. Build Project Info
        const infoContainer = $('#project-info');
        let infoHtml = `
            <div class="title">
                <h1>${project.title}</h1>
            </div>
            <p> ${project.technical_details.replace(/\n/g, '<br>') || 'N/A'}</p>
            <p>${(project.description || '').replace(/\n/g, '<br>')}</p>
            
        `;
        infoContainer.html(infoHtml);

        // 3. Initialize Carousel
        slides = carouselContainer.find('.slide');
        if (slides.length > 1) {
            $('.carousel-nav').show(); // Show navigation
            $('#prev-slide').on('click', prevSlide);
            $('#next-slide').on('click', nextSlide);
            showSlide(0); // Ensure first slide is shown
        } else {
            // Hide nav if only one image (already hidden by default, but good for clarity)
            $('.carousel-nav').hide();
        }
    }

    function init() {
        const slug = getQueryParam('project');
        if (!slug) {
            $('#project-root').html('<p style="text-align:center;">Proyecto no encontrado. <a href="index.html">Volver</a>.</p>');
            return;
        }

        $.getJSON('data/projects.json')
            .done(function (data) {
                const project = (data.projects || []).find(p => p.slug === slug);
                if (project) {
                    buildPage(project);
                } else {
                    $('#project-root').html('<p style="text-align:center;">Proyecto no encontrado. <a href="index.html">Volver</a>.</p>');
                }
            })
            .fail(function () {
                $('#project-root').html('<p style="text-align:center;">Error al cargar los datos del proyecto. <a href="index.html">Volver</a>.</p>');
            });
    }

    // Run on document ready
    $(init);

})(jQuery);