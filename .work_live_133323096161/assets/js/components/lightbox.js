/* ============================================================
   SWARNA PALACE — Lightbox Component
   ============================================================ */

(function () {
    'use strict';

    var lightbox = null;
    var images = [];
    var currentIndex = 0;

    function createLightbox() {
        if (lightbox) return;

        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML =
            '<div class="lightbox__overlay"></div>' +
            '<div class="lightbox__content">' +
            '<img class="lightbox__image" src="" alt="">' +
            '</div>' +
            '<button class="lightbox__close" aria-label="Close lightbox" type="button">' +
            '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
            '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image" type="button">' +
            '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>' +
            '</button>' +
            '<button class="lightbox__nav lightbox__nav--next" aria-label="Next image" type="button">' +
            '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>' +
            '</button>';

        document.body.appendChild(lightbox);

        // Event listeners
        lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', prevImage);
        lightbox.querySelector('.lightbox__nav--next').addEventListener('click', nextImage);

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('lightbox--open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    function openLightbox(imageArray, startIndex) {
        createLightbox();
        images = imageArray || [];
        currentIndex = startIndex || 0;

        if (images.length === 0) return;

        showImage(currentIndex);
        document.body.style.overflow = 'hidden';

        // GSAP fade in
        gsap.fromTo(lightbox,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                onStart: function () {
                    lightbox.classList.add('lightbox--open');
                }
            }
        );

        gsap.fromTo(lightbox.querySelector('.lightbox__image'),
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
        );
    }

    function closeLightbox() {
        if (!lightbox) return;

        gsap.to(lightbox, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: function () {
                lightbox.classList.remove('lightbox--open');
                document.body.style.overflow = '';
            }
        });
    }

    function showImage(index) {
        if (index < 0 || index >= images.length) return;
        var img = lightbox.querySelector('.lightbox__image');
        img.src = images[index];
        img.alt = 'Image ' + (index + 1) + ' of ' + images.length;

        // Toggle nav visibility
        var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
        var nextBtn = lightbox.querySelector('.lightbox__nav--next');
        prevBtn.style.display = images.length > 1 ? '' : 'none';
        nextBtn.style.display = images.length > 1 ? '' : 'none';
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        var img = lightbox.querySelector('.lightbox__image');
        gsap.to(img, {
            opacity: 0,
            duration: 0.15,
            onComplete: function () {
                showImage(currentIndex);
                gsap.to(img, { opacity: 1, duration: 0.2 });
            }
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        var img = lightbox.querySelector('.lightbox__image');
        gsap.to(img, {
            opacity: 0,
            duration: 0.15,
            onComplete: function () {
                showImage(currentIndex);
                gsap.to(img, { opacity: 1, duration: 0.2 });
            }
        });
    }

    // Expose globally
    window.spLightbox = {
        open: openLightbox,
        close: closeLightbox
    };
})();
