/* ============================================================
   SWARNA PALACE — Contact Page JS
   ============================================================ */

(function () {
    'use strict';

    document.addEventListener('sp:ready', initContactPage);

    function initContactPage() {
        initContactHeader();
        initFormSuccess();
        initFormValidation();
        initFAQ();
    }

    /* --- Header Character Reveal --- */
    function initContactHeader() {
        var section = document.querySelector('[data-section="contact-header"]');
        if (!section) return;

        var title = section.querySelector('.contact-header__title');
        if (title) {
            if (title.dataset.animated === 'true') return;

            var textContent = title.textContent.replace(/\s+/g, ' ').trim();
            if (!textContent) return;

            title.dataset.animated = 'true';
            title.textContent = '';
            title.style.overflow = 'hidden';
            var chars = [];

            var words = textContent.split(' ');
            for (var w = 0; w < words.length; w++) {
                var word = words[w];
                var wordSpan = document.createElement('span');
                wordSpan.className = 'contact-header__title-word';

                for (var i = 0; i < word.length; i++) {
                    var charSpan = document.createElement('span');
                    charSpan.className = 'contact-header__title-char';
                    charSpan.textContent = word[i];
                    wordSpan.appendChild(charSpan);
                    chars.push(charSpan);
                }

                title.appendChild(wordSpan);

                if (w < words.length - 1) {
                    var space = document.createElement('span');
                    space.className = 'contact-header__title-space';
                    space.textContent = ' ';
                    title.appendChild(space);
                }
            }

            gsap.set(chars, { yPercent: 100, opacity: 0 });
            gsap.to(chars, {
                yPercent: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02,
                ease: 'power3.out',
                delay: 0.1
            });
        }
    }
    window.spRegisterSection('contact-header', initContactHeader);

    /* --- Form Success SVG Animation --- */
    function initFormSuccess() {
        var success = document.querySelector('.contact-form__success');
        if (!success) return;

        var icon = success.querySelector('.contact-form__success-icon');
        var checkPath = success.querySelector('.contact-form__check-path');
        var text = success.querySelector('.contact-form__success-text');

        if (icon && checkPath) {
            var tl = gsap.timeline({ delay: 0.3 });

            tl.to(icon, { opacity: 1, duration: 0.3 });

            var pathLength = checkPath.getTotalLength ? checkPath.getTotalLength() : 60;
            gsap.set(checkPath, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });

            tl.to(checkPath, {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: 'power2.out'
            });

            if (text) {
                tl.from(text, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });
            }
        }
    }

    /* --- Form Validation (Error Shake) --- */
    function initFormValidation() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            var inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            var hasError = false;

            inputs.forEach(function (input) {
                input.classList.remove('is-invalid');

                if (!input.value.trim()) {
                    hasError = true;
                    input.classList.add('is-invalid');

                    // GSAP shake animation
                    gsap.fromTo(input, { x: 0 }, {
                        x: 6,
                        duration: 0.06,
                        yoyo: true,
                        repeat: 5,
                        ease: 'power2.inOut',
                        onComplete: function () {
                            gsap.set(input, { x: 0 });
                        }
                    });
                }
            });

            if (hasError) {
                e.preventDefault();
            }
        });

        // Remove error state on input
        form.querySelectorAll('input, textarea, select').forEach(function (input) {
            input.addEventListener('input', function () {
                input.classList.remove('is-invalid');
            });
        });
    }

    /* --- FAQ Accordions --- */
    function initFAQ() {
        var section = document.querySelector('[data-section="contact-faq"]');
        if (!section) return;

        var items = section.querySelectorAll('.faq-item');
        if (!items.length) return;

        items.forEach(function (item) {
            var question = item.querySelector('.faq-item__question');
            var answer = item.querySelector('.faq-item__answer');
            var icon = item.querySelector('.faq-item__icon');

            if (!question || !answer) return;

            // Initialize closed
            gsap.set(answer, { height: 0, overflow: 'hidden' });

            question.addEventListener('click', function () {
                var isOpen = item.classList.contains('faq-item--open');

                if (isOpen) {
                    // Close
                    item.classList.remove('faq-item--open');
                    gsap.to(answer, { height: 0, duration: 0.4, ease: 'power2.inOut' });
                    if (icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
                } else {
                    // Close all others
                    items.forEach(function (other) {
                        if (other !== item && other.classList.contains('faq-item--open')) {
                            other.classList.remove('faq-item--open');
                            var otherAnswer = other.querySelector('.faq-item__answer');
                            var otherIcon = other.querySelector('.faq-item__icon');
                            gsap.to(otherAnswer, { height: 0, duration: 0.4, ease: 'power2.inOut' });
                            if (otherIcon) gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
                        }
                    });

                    // Open this one
                    item.classList.add('faq-item--open');

                    gsap.set(answer, { height: 'auto' });
                    var fullHeight = answer.offsetHeight;
                    gsap.set(answer, { height: 0 });
                    gsap.to(answer, {
                        height: fullHeight,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: function () {
                            gsap.set(answer, { height: 'auto' });
                        }
                    });
                    if (icon) gsap.to(icon, { rotation: 45, duration: 0.3 });
                }
            });
        });
    }
    window.spRegisterSection('contact-faq', initFAQ);
})();
