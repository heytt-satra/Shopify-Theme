/* ============================================================
   SWARNA PALACE — Loader Animation
   ============================================================ */

function initLoader() {
    'use strict';

    var loader = document.getElementById('sp-loader');
    if (!loader) {
        window.spDispatchReady();
        return;
    }

    // If already loaded this session, skip the animation
    if (sessionStorage.getItem('sp_loaded')) {
        loader.remove();
        window.spDispatchReady();
        return;
    }

    // Make loader visible
    loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;background:var(--bg-darker);';

    var logoPath = loader.querySelector('.sp-loader__logo-path');
    var textEl = loader.querySelector('.sp-loader__text');
    var panelLeft = loader.querySelector('.sp-loader__panel--left');
    var panelRight = loader.querySelector('.sp-loader__panel--right');

    // Style panels
    if (panelLeft) {
        panelLeft.style.cssText = 'position:absolute;top:0;left:0;width:50%;height:100%;background:var(--bg-darker);transform-origin:left center;z-index:2;';
    }
    if (panelRight) {
        panelRight.style.cssText = 'position:absolute;top:0;right:0;width:50%;height:100%;background:var(--bg-darker);transform-origin:right center;z-index:2;';
    }

    // Content styles
    var content = loader.querySelector('.sp-loader__content');
    if (content) {
        content.style.cssText = 'position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:1.5rem;';
    }

    // Text styles
    if (textEl) {
        textEl.style.cssText = 'font-family:var(--font-serif);font-size:clamp(1.5rem,3vw,2.5rem);letter-spacing:0.3em;color:var(--text-primary);text-transform:uppercase;';
    }

    var tl = gsap.timeline({
        onComplete: function () {
            loader.remove();
            sessionStorage.setItem('sp_loaded', 'true');
            window.spDispatchReady();
        }
    });

    // Phase 1: SVG stroke draw
    if (logoPath) {
        var pathLength = logoPath.getTotalLength ? logoPath.getTotalLength() : 400;
        gsap.set(logoPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });

        tl.to(logoPath, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    }

    // Phase 2: Manual letter-by-letter reveal (no SplitText)
    if (textEl) {
        var textContent = textEl.textContent;
        textEl.textContent = '';
        var chars = [];
        for (var i = 0; i < textContent.length; i++) {
            var span = document.createElement('span');
            span.style.display = 'inline-block';
            span.textContent = textContent[i] === ' ' ? '\u00A0' : textContent[i];
            textEl.appendChild(span);
            chars.push(span);
        }
        gsap.set(chars, { opacity: 0, yPercent: 40 });

        tl.to(chars, {
            opacity: 1,
            yPercent: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: 'power3.out'
        }, '-=0.2');
    }

    // Phase 3: Hold
    tl.to({}, { duration: 0.4 });

    // Phase 4: Split panels open to reveal page
    if (panelLeft && panelRight) {
        tl.to(panelLeft, {
            scaleX: 0,
            duration: 0.7,
            ease: 'power2.inOut'
        }, '+=0.1');
        tl.to(panelRight, {
            scaleX: 0,
            duration: 0.7,
            ease: 'power2.inOut'
        }, '<');
        // Fade out center content simultaneously
        if (content) {
            tl.to(content, {
                opacity: 0,
                scale: 0.9,
                duration: 0.4,
                ease: 'power2.in'
            }, '<');
        }
    }
}
