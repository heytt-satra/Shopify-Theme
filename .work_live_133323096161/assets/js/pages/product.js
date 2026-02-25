/* ============================================================
   SWARNA PALACE — Product Detail Page JS
   ============================================================ */

(function () {
    'use strict';

    document.addEventListener('sp:ready', initProductPage);

    function initProductPage() {
        stabilizeProductEntry();
        initGallery();
        initVariantSwitcher();
        initAccordionsPDP();
        initMobileStickyATC();
        initStyleWithScroll();
    }

    function stabilizeProductEntry() {
        var mobileMenu = document.querySelector('.nav__mobile-menu');
        var hamburger = document.querySelector('.nav__hamburger');

        if (mobileMenu) {
            mobileMenu.classList.remove('nav__mobile-menu--open');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
        if (hamburger) {
            hamburger.classList.remove('nav__hamburger--active');
        }
        document.body.style.overflow = '';

        var fromCollection = false;
        if (document.referrer) {
            try {
                var refPath = new URL(document.referrer, window.location.origin).pathname || '';
                fromCollection = refPath === '/collections' || refPath.indexOf('/collections/') === 0;
            } catch (err) {
                fromCollection = false;
            }
        }

        if (!fromCollection) return;

        window.scrollTo(0, 0);
        if (window.spLenis && typeof window.spLenis.scrollTo === 'function') {
            window.spLenis.scrollTo(0, { immediate: true, force: true });
        }
    }

    /* --- Gallery: thumbnail switching + lightbox --- */
    function initGallery() {
        var gallery = document.querySelector('[data-section="product-gallery"]');
        if (!gallery) return;
        if (gallery.dataset.spInit === 'true') return;
        gallery.dataset.spInit = 'true';

        var primaryImg = gallery.querySelector('#product-primary-image');
        var thumbs = gallery.querySelectorAll('.product-gallery__thumb');
        var trigger = gallery.querySelector('[data-lightbox-trigger]');

        function fadeInPrimary(targetSrc) {
            if (!primaryImg) return;
            // Ignore stale callbacks when users click thumbnails quickly
            if (targetSrc && primaryImg.dataset.pendingSrc && primaryImg.dataset.pendingSrc !== targetSrc) return;
            gsap.to(primaryImg, { opacity: 1, duration: 0.22, ease: 'power2.out' });
        }

        // Thumbnail click -> crossfade primary image
        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var newSrc = thumb.getAttribute('data-image-url');
                if (!newSrc || !primaryImg) return;
                if (primaryImg.getAttribute('src') === newSrc) return;

                // Update active state
                thumbs.forEach(function (t) { t.classList.remove('product-gallery__thumb--active'); });
                thumb.classList.add('product-gallery__thumb--active');

                // Crossfade
                gsap.killTweensOf(primaryImg);
                gsap.to(primaryImg, {
                    opacity: 0,
                    duration: 0.14,
                    ease: 'power2.out',
                    onComplete: function () {
                        primaryImg.dataset.pendingSrc = newSrc;
                        primaryImg.src = newSrc;

                        if (typeof primaryImg.decode === 'function') {
                            primaryImg.decode()
                                .then(function () { fadeInPrimary(newSrc); })
                                .catch(function () { fadeInPrimary(newSrc); });
                        } else if (primaryImg.complete) {
                            fadeInPrimary(newSrc);
                        } else {
                            primaryImg.onload = function () { fadeInPrimary(newSrc); };
                            primaryImg.onerror = function () { fadeInPrimary(newSrc); };
                        }
                    }
                });
            });
        });

        // Click primary image -> open lightbox
        if (trigger && typeof window.spLightbox !== 'undefined') {
            trigger.addEventListener('click', function () {
                var jsonEl = document.getElementById('product-images-json');
                if (!jsonEl) return;

                try {
                    var images = JSON.parse(jsonEl.textContent);
                    var activeThumb = gallery.querySelector('.product-gallery__thumb--active');
                    var startIndex = activeThumb ? parseInt(activeThumb.getAttribute('data-image-index'), 10) : 0;
                    window.spLightbox.open(images, startIndex);
                } catch (e) {
                    console.error('Lightbox data parse error:', e);
                }
            });
        }
    }
    window.spRegisterSection('product-gallery', initGallery);

    /* --- Variant Switcher --- */
    function initVariantSwitcher() {
        var panel = document.querySelector('[data-section="product-panel"]');
        if (!panel) return;
        if (panel.dataset.spVariantInit === 'true') return;
        panel.dataset.spVariantInit = 'true';

        var variantBtns = panel.querySelectorAll('.variant-btn');
        var priceEl = panel.querySelector('#product-price');
        var hiddenInput = panel.querySelector('#product-variant-id');
        var atcBtn = panel.querySelector('.btn--atc');

        variantBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (btn.disabled) return;

                // Update active
                variantBtns.forEach(function (b) { b.classList.remove('variant-btn--active'); });
                btn.classList.add('variant-btn--active');

                // Update price
                var price = btn.getAttribute('data-price');
                if (priceEl && price) priceEl.textContent = price;

                // Update hidden input and ATC data attribute
                var variantId = btn.getAttribute('data-variant-id');
                if (hiddenInput) hiddenInput.value = variantId;
                if (atcBtn) atcBtn.setAttribute('data-variant-id', variantId);
            });
        });
    }
    window.spRegisterSection('product-panel', initVariantSwitcher);

    /* --- Accordions on PDP --- */
    function initAccordionsPDP() {
        var panel = document.querySelector('.product-panel__accordions');
        if (!panel) return;
        if (panel.dataset.spAccordionInit === 'true') return;
        panel.dataset.spAccordionInit = 'true';

        if (typeof initAccordions === 'function') {
            initAccordions(panel);
        }
    }

    /* --- Mobile Sticky ATC --- */
    function initMobileStickyATC() {
        if (window.innerWidth > 767) return;

        var priceEl = document.querySelector('#product-price');
        var stickyBar = document.querySelector('.product-panel__sticky-cta');
        if (!priceEl || !stickyBar) return;
        if (stickyBar.dataset.spStickyInit === 'true') return;
        stickyBar.dataset.spStickyInit = 'true';

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    stickyBar.classList.remove('product-panel__sticky-cta--visible');
                } else {
                    stickyBar.classList.add('product-panel__sticky-cta--visible');
                }
            });
        }, { threshold: 0 });

        observer.observe(priceEl);
    }

    /* --- Style With horizontal scroll arrows --- */
    function initStyleWithScroll() {
        var section = document.querySelector('[data-section="product-style-with"]');
        if (!section) return;
        if (section.dataset.spScrollInit === 'true') return;
        section.dataset.spScrollInit = 'true';

        var track = section.querySelector('.style-with__track');
        var prevBtn = section.querySelector('.style-with__arrow--prev');
        var nextBtn = section.querySelector('.style-with__arrow--next');

        if (!track || !prevBtn || !nextBtn) return;

        function getScrollAmount() {
            var firstCard = track.querySelector('.product-card');
            if (!firstCard) return 220;

            var styles = window.getComputedStyle(track);
            var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
            return Math.max(160, Math.round(firstCard.getBoundingClientRect().width + gap));
        }

        function updateArrows() {
            var maxLeft = Math.max(0, track.scrollWidth - track.clientWidth);
            var left = Math.max(0, track.scrollLeft);
            var atStart = left <= 2;
            var atEnd = left >= maxLeft - 2;

            prevBtn.disabled = atStart;
            nextBtn.disabled = atEnd;
            prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
            nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
        }

        prevBtn.addEventListener('click', function () {
            var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            track.scrollBy({ left: -getScrollAmount(), behavior: behavior });
        });

        nextBtn.addEventListener('click', function () {
            var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            track.scrollBy({ left: getScrollAmount(), behavior: behavior });
        });

        track.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }
    window.spRegisterSection('product-style-with', initStyleWithScroll);
})();
