/* ===================================================================
 * Epitome - Main JS
 *
 * ------------------------------------------------------------------- */

(function () {

    "use strict";

    var cfg = {
        scrollDuration: 800 // smoothscroll duration
    };

    // Add the User Agent to the <html>
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


    /* Preloader
     * -------------------------------------------------- */
    var ssPreloader = function () {

        document.documentElement.classList.add('ss-preload');

        window.addEventListener('load', function () {

            // will first fade out the loading animation 
            var loader = document.getElementById('loader');
            var preloader = document.getElementById('preloader');

            loader.style.transition = 'opacity 0.5s';
            loader.style.opacity = '0';

            setTimeout(function () {
                loader.style.display = 'none';

                preloader.style.transition = 'opacity 0.5s';
                preloader.style.opacity = '0';

                setTimeout(function () {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);

            // for hero content animations 
            document.documentElement.classList.remove('ss-preload');
            document.documentElement.classList.add('ss-loaded');

            // Scroll to hash if present
            if (window.location.hash) {
                var target = document.querySelector(window.location.hash);
                if (target) {
                    smoothScrollTo(target.offsetTop, 800);
                }
            }

        });
    };


    /* Menu on Scrolldown
     * ------------------------------------------------------ */
    var ssMenuOnScrolldown = function () {

        var hdr = document.querySelector('.s-header');
        var hdrTop = hdr.offsetTop;

        window.addEventListener('scroll', function () {

            if (window.pageYOffset > hdrTop) {
                hdr.classList.add('sticky');
            }
            else {
                hdr.classList.remove('sticky');
            }

        });
    };


    /* Mobile Menu
     * ---------------------------------------------------- */
    var ssMobileMenu = function () {

        var toggleButton = document.querySelector('.header-menu-toggle');
        var nav = document.querySelector('.header-nav-wrap');

        toggleButton.addEventListener('click', function (event) {
            event.preventDefault();

            toggleButton.classList.toggle('is-clicked');
            slideToggle(nav);
        });

        if (isVisible(toggleButton)) nav.classList.add('mobile');

        window.addEventListener('resize', function () {
            if (isVisible(toggleButton)) nav.classList.add('mobile');
            else nav.classList.remove('mobile');
        });

        var navLinks = nav.querySelectorAll('a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (nav.classList.contains('mobile')) {
                    toggleButton.classList.toggle('is-clicked');
                    slideToggle(nav);
                }
            });
        });

    };

    /* Highlight the current section in the navigation bar
     * ------------------------------------------------------ */
    var ssWaypoints = function () {

        var sections = document.querySelectorAll(".target-section");
        var navigation_links = document.querySelectorAll(".header-main-nav li a");

        // Use Intersection Observer API (native, no library needed)
        var observerOptions = {
            rootMargin: '-25% 0px -75% 0px', // Trigger when section is 25% from top
            threshold: 0
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var sectionId = entry.target.getAttribute('id');
                    var activeLink = document.querySelector('.header-main-nav li a[href="#' + sectionId + '"]');

                    if (activeLink) {
                        // Remove current class from all nav links
                        navigation_links.forEach(function (link) {
                            link.parentElement.classList.remove('current');
                        });

                        // Add current class to active link
                        activeLink.parentElement.classList.add('current');
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(function (section) {
            observer.observe(section);
        });

    };




    /* Smooth Scrolling
     * ------------------------------------------------------ */
    var ssSmoothScroll = function () {

        var smoothScrollLinks = document.querySelectorAll('.smoothscroll');

        smoothScrollLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var target = this.hash;
                var targetElement = document.querySelector(target);

                if (!targetElement) return;

                e.preventDefault();
                e.stopPropagation();

                smoothScrollTo(targetElement.offsetTop, cfg.scrollDuration, function () {
                    // check if menu is open
                    if (document.body.classList.contains('menu-is-open')) {
                        document.querySelector('.header-menu-toggle').click();
                    }

                    window.location.hash = target;
                });
            });
        });

    };




    /* Animate On Scroll
     * ------------------------------------------------------ */
    var ssAOS = function () {

        AOS.init({
            offset: 200,
            duration: 600,
            easing: 'ease-in-sine',
            delay: 300,
            once: true,
            disable: 'mobile'
        });

    };


    /* Initialize
     * ------------------------------------------------------ */
    (function clInit() {

        ssPreloader();
        ssMenuOnScrolldown();
        ssMobileMenu();
        ssWaypoints();
        ssSmoothScroll();
        ssAOS();

    })();


    /* Helper Functions
     * ------------------------------------------------------ */

    // Smooth scroll to position
    function smoothScrollTo(to, duration, callback) {
        var start = window.pageYOffset;
        var change = to - start;
        var startTime = performance.now();

        function animateScroll(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);

            // Easing function (swing/ease-in-out)
            var easeProgress = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, start + change * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else if (callback) {
                callback();
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // Slide toggle helper
    function slideToggle(element) {
        if (element.style.display === 'none' || !element.style.display) {
            slideDown(element);
        } else {
            slideUp(element);
        }
    }

    function slideDown(element) {
        element.style.display = 'block';
        var height = element.scrollHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.transition = 'height 0.3s ease';

        setTimeout(function () {
            element.style.height = height + 'px';
        }, 10);

        setTimeout(function () {
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, 300);
    }

    function slideUp(element) {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = 'height 0.3s ease';

        setTimeout(function () {
            element.style.height = '0px';
        }, 10);

        setTimeout(function () {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, 300);
    }

    // Check if element is visible
    function isVisible(element) {
        return element.offsetWidth > 0 || element.offsetHeight > 0;
    }

})();
