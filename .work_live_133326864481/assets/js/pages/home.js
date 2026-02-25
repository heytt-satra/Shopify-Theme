/* ============================================================
   SWARNA PALACE — Homepage Animations
   ============================================================ */

(function () {
    'use strict';

    // Wait for sp:ready before initializing scroll-driven animations
    document.addEventListener('sp:ready', initHomeAnimations);

    function initHomeAnimations() {
        initHeroAnimation();
        initEditorialBreak();
        initManifesto();
        initSocialProof();
        initGenZGrid();
        initProductSpots();
        initFinalCTA();
    }

    /* --- Hero --- */
    function initHeroAnimation() {
        var section = document.querySelector('[data-section="home-hero"]');
        if (!section) return;

        var title = section.querySelector('.hero__title');
        var sub = section.querySelector('.hero__sub');
        var cta = section.querySelector('.btn');
        var imageWrap = section.querySelector('.hero__image-wrap');

        // Animate hero title
        if (title) {
            var titleLines = title.querySelectorAll('.hero__title-line');
            var wordSpans = [];

            if (titleLines.length > 0) {
                // Animate existing hero__title-line spans (block-based heading)
                titleLines.forEach(function (line) {
                    line.style.display = 'block';
                    wordSpans.push(line);
                });
            } else {
                // Fallback: Manual word reveal (no SplitText)
                var textContent = title.textContent.trim();
                title.textContent = '';
                title.style.overflow = 'hidden';
                var words = textContent.split(/\s+/);
                words.forEach(function (word, i) {
                    var span = document.createElement('span');
                    span.style.display = 'inline-block';
                    span.textContent = word;
                    title.appendChild(span);
                    if (i < words.length - 1) {
                        title.appendChild(document.createTextNode(' '));
                    }
                    wordSpans.push(span);
                });
            }

            gsap.set(wordSpans, { yPercent: 110, opacity: 0 });
            gsap.to(wordSpans, {
                yPercent: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.9,
                ease: 'power3.out',
                delay: 0.1
            });
        }

        // Fade in subtext and CTA
        if (sub) {
            gsap.from(sub, { opacity: 0, y: 20, duration: 0.6, delay: 0.6, ease: 'power2.out' });
        }
        if (cta) {
            gsap.from(cta, { opacity: 0, y: 20, duration: 0.6, delay: 0.8, ease: 'power2.out' });
        }

        // Parallax on hero image
        if (imageWrap) {
            var img = imageWrap.querySelector('.hero__image');
            if (img) {
                gsap.to(img, {
                    yPercent: 15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            }
        }
    }
    window.spRegisterSection('home-hero', initHeroAnimation);

    /* --- Editorial Break --- */
    function initEditorialBreak() {
        var section = document.querySelector('[data-section="home-editorial-break"]');
        if (!section) return;

        var lines = section.querySelectorAll('.line--mask__inner');
        if (lines.length) {
            gsap.set(lines, { yPercent: 100 });
            ScrollTrigger.create({
                trigger: section,
                start: 'top 75%',
                onEnter: function () {
                    gsap.to(lines, {
                        yPercent: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        }

        // Mouse move parallax on image
        var img = section.querySelector('.editorial-break__image');
        if (img) {
            var xTo = gsap.quickTo(img, 'x', { duration: 0.6, ease: 'power2.out' });
            var yTo = gsap.quickTo(img, 'y', { duration: 0.6, ease: 'power2.out' });

            section.addEventListener('mousemove', function (e) {
                var rect = section.getBoundingClientRect();
                var dx = (e.clientX - rect.left - rect.width / 2) * 0.01;
                var dy = (e.clientY - rect.top - rect.height / 2) * 0.01;
                xTo(-dx * 10);
                yTo(-dy * 10);
            });
        }
    }
    window.spRegisterSection('home-editorial-break', initEditorialBreak);

    /* --- Manifesto – Pinned scroll reveal --- */
    function initManifesto() {
        var section = document.querySelector('[data-section="home-manifesto"]');
        if (!section) return;

        var lines = section.querySelectorAll('.manifesto__line');
        if (!lines.length) return;

        gsap.set(lines, { opacity: 0, yPercent: 20 });

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1
            }
        });

        lines.forEach(function (line, i) {
            tl.to(line, {
                opacity: 1,
                yPercent: 0,
                duration: 1,
                ease: 'power2.out'
            }, i * 0.5);
        });
    }
    window.spRegisterSection('home-manifesto', initManifesto);

    /* --- Social Proof – Auto-rotating quotes --- */
    function initSocialProof() {
        var section = document.querySelector('[data-section="home-social-proof"]');
        if (!section) return;

        var quotes = section.querySelectorAll('.social-proof__quote');
        var dots = section.querySelectorAll('.social-proof__dot');
        if (quotes.length < 2) return;

        var currentIndex = 0;
        var interval = null;

        function showQuote(index) {
            quotes.forEach(function (q) { q.classList.remove('social-proof__quote--active'); });
            dots.forEach(function (d) { d.classList.remove('social-proof__dot--active'); });

            quotes[index].classList.add('social-proof__quote--active');
            if (dots[index]) dots[index].classList.add('social-proof__dot--active');
            currentIndex = index;
        }

        function nextQuote() {
            var next = (currentIndex + 1) % quotes.length;
            showQuote(next);
        }

        // Dot click handlers
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showQuote(i);
                clearInterval(interval);
                interval = setInterval(nextQuote, 4000);
            });
        });

        // Start autoplay
        interval = setInterval(nextQuote, 4000);
    }
    window.spRegisterSection('home-social-proof', initSocialProof);

    /* --- Gen Z Grid – Stagger reveal --- */
    function initGenZGrid() {
        var section = document.querySelector('[data-section="home-gen-z-grid"]');
        if (!section) return;

        var tiles = section.querySelectorAll('.gen-z-grid__tile');
        if (!tiles.length) return;

        gsap.set(tiles, { opacity: 0, y: 40 });
        ScrollTrigger.batch(tiles, {
            onEnter: function (batch) {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%'
        });
    }
    window.spRegisterSection('home-gen-z-grid', initGenZGrid);

    /* --- Product Spots – Stagger reveal --- */
    function initProductSpots() {
        var section = document.querySelector('[data-section="home-product-spots"]');
        if (!section) return;

        var cards = section.querySelectorAll('.product-card');
        if (!cards.length) return;

        gsap.set(cards, { opacity: 0, y: 30 });
        ScrollTrigger.batch(cards, {
            onEnter: function (batch) {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%'
        });
    }
    window.spRegisterSection('home-product-spots', initProductSpots);

    /* --- Final CTA — Entrance --- */
    function initFinalCTA() {
        var section = document.querySelector('[data-section="home-final-cta"]');
        if (!section) return;

        var title = section.querySelector('.final-cta__title');
        var btn = section.querySelector('.btn');

        if (title) {
            gsap.from(title, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: section, start: 'top 70%', once: true }
            });
        }

        if (btn) {
            gsap.from(btn, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: 0.2,
                ease: 'power2.out',
                scrollTrigger: { trigger: section, start: 'top 70%', once: true }
            });
        }
    }
    window.spRegisterSection('home-final-cta', initFinalCTA);
})();
