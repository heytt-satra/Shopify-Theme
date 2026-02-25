/* ============================================================
   SWARNA PALACE — About Page Animations
   ============================================================ */

(function () {
    'use strict';

    document.addEventListener('sp:ready', initAboutPage);

    function initAboutPage() {
        initAboutHero();
        initBrandStatement();
        initTimeline();
        initValues();
        initCampaign();
    }

    /* --- About Hero - Line Reveal --- */
    function initAboutHero() {
        var section = document.querySelector('[data-section="about-hero"]');
        if (!section) return;

        var lines = section.querySelectorAll('.about-hero__title-line');
        if (lines.length) {
            gsap.set(lines, { yPercent: 100, opacity: 0 });
            gsap.to(lines, {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2
            });
        }

        var sub = section.querySelector('.about-hero__sub');
        if (sub) {
            gsap.from(sub, { opacity: 0, y: 20, duration: 0.6, delay: 0.8, ease: 'power2.out' });
        }
    }
    window.spRegisterSection('about-hero', initAboutHero);

    /* --- Brand Statement - Pinned progressive reveal --- */
    function initBrandStatement() {
        var section = document.querySelector('[data-section="about-brand-statement"]');
        if (!section) return;

        var lines = section.querySelectorAll('.brand-statement__line');
        if (!lines.length) return;

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=250%',
                pin: true,
                scrub: 1
            }
        });

        lines.forEach(function (line, i) {
            tl.to(line, {
                opacity: 1,
                duration: 1,
                ease: 'none'
            }, i * 0.8);
        });
    }
    window.spRegisterSection('about-brand-statement', initBrandStatement);

    /* --- Timeline - Vertical rail with aggressive scroll animation --- */
    function initTimeline() {
        var section = document.querySelector('[data-section="about-timeline"]');
        if (!section) return;

        var stack = section.querySelector('.timeline__stack');
        var progress = section.querySelector('.timeline__progress');
        var items = section.querySelectorAll('.timeline__item');
        if (!stack || !items.length) return;

        // Floating ambient blobs for extra movement
        var ambients = section.querySelectorAll('.timeline__ambient');
        ambients.forEach(function (ambient, i) {
            gsap.to(ambient, {
                yPercent: i % 2 ? 24 : -24,
                xPercent: i % 2 ? -12 : 12,
                rotation: i % 2 ? -35 : 35,
                duration: 7 + (i * 1.7),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });

        if (progress) {
            gsap.set(progress, { transformOrigin: 'top center', scaleY: 0 });
            gsap.to(progress, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: stack,
                    start: 'top 28%',
                    end: 'bottom 72%',
                    scrub: 0.8
                }
            });
        }

        items.forEach(function (item) {
            var card = item.querySelector('.timeline__card');
            var year = item.querySelector('.timeline__year');
            var dot = item.querySelector('.timeline__dot');
            var desc = item.querySelector('.timeline__desc');
            var img = item.querySelector('.timeline__img');
            var isRight = item.classList.contains('timeline__item--right');
            var direction = isRight ? 1 : -1;

            gsap.set(item, {
                opacity: 0,
                y: 120,
                rotateX: -24,
                scale: 0.86,
                filter: 'blur(12px)',
                transformPerspective: 900
            });

            if (card) {
                gsap.set(card, { xPercent: direction * 12, rotate: direction * 2.5 });
            }
            if (year) {
                gsap.set(year, { yPercent: 45, opacity: 0.2 });
            }
            if (dot) {
                gsap.set(dot, { scale: 0, boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.55)' });
            }
            if (desc) {
                gsap.set(desc, { y: 20, opacity: 0 });
            }
            if (img) {
                gsap.set(img, { scale: 1.22, rotate: direction * 2 });
            }

            var revealTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 86%',
                    end: 'top 26%',
                    scrub: 1.2,
                    invalidateOnRefresh: true
                }
            });

            revealTl
                .to(item, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.1,
                    ease: 'power4.out'
                }, 0)
                .to(card, {
                    xPercent: 0,
                    rotate: 0,
                    duration: 1.3,
                    ease: 'expo.out'
                }, 0)
                .to(dot, {
                    scale: 1,
                    boxShadow: '0 0 0 18px rgba(201, 168, 76, 0)',
                    duration: 1.1,
                    ease: 'elastic.out(1, 0.55)'
                }, 0.1)
                .to(year, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out'
                }, 0.15)
                .to(desc, {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: 'power2.out'
                }, 0.25);

            if (img) {
                revealTl.to(img, {
                    scale: 1,
                    rotate: 0,
                    duration: 1.5,
                    ease: 'power3.out'
                }, 0);
            }

            // Continuous parallax for card + year while scrolling
            if (card) {
                gsap.to(card, {
                    yPercent: -9,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.9
                    }
                });
            }

            if (year) {
                gsap.to(year, {
                    yPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 95%',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            }

            // Active-state pulse while the card is in focus
            if (card && dot) {
                var pulseTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
                pulseTl.to(card, {
                    rotation: direction * 0.7,
                    y: -6,
                    duration: 1.3,
                    ease: 'sine.inOut'
                }, 0).to(dot, {
                    boxShadow: '0 0 0 10px rgba(201, 168, 76, 0.12)',
                    duration: 1.3,
                    ease: 'sine.inOut'
                }, 0);

                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 56%',
                    end: 'bottom 44%',
                    onEnter: function () { pulseTl.play(); },
                    onEnterBack: function () { pulseTl.play(); },
                    onLeave: function () { pulseTl.pause(0); },
                    onLeaveBack: function () { pulseTl.pause(0); }
                });
            }
        });
    }
    window.spRegisterSection('about-timeline', initTimeline);

    /* --- Values — Stagger fade-in --- */
    function initValues() {
        var section = document.querySelector('[data-section="about-values"]');
        if (!section) return;

        var cols = section.querySelectorAll('.values__col');
        if (!cols.length) return;

        gsap.set(cols, { opacity: 0, y: 40 });
        ScrollTrigger.batch(cols, {
            onEnter: function (batch) {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%'
        });
    }
    window.spRegisterSection('about-values', initValues);

    /* --- Campaign — Mouse move parallax --- */
    function initCampaign() {
        var section = document.querySelector('[data-section="about-campaign"]');
        if (!section) return;

        var img = section.querySelector('.campaign__image');
        if (!img) return;

        var xTo = gsap.quickTo(img, 'x', { duration: 0.8, ease: 'power2.out' });
        var yTo = gsap.quickTo(img, 'y', { duration: 0.8, ease: 'power2.out' });

        section.addEventListener('mousemove', function (e) {
            var rect = section.getBoundingClientRect();
            var dx = (e.clientX - rect.left - rect.width / 2) * 0.01;
            var dy = (e.clientY - rect.top - rect.height / 2) * 0.01;
            xTo(-dx * 8);
            yTo(-dy * 8);
        });

        // Entrance animation
        var content = section.querySelector('.campaign__content');
        if (content) {
            gsap.from(content, {
                opacity: 0,
                y: 30,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: section, start: 'top 60%', once: true }
            });
        }
    }
    window.spRegisterSection('about-campaign', initCampaign);
})();
