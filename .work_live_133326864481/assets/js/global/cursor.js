/* ============================================================
   SWARNA PALACE — Custom Cursor
   ============================================================ */

function initCursor() {
    'use strict';

    // Bail on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    if ('ontouchstart' in window) return;

    var cursor = document.getElementById('sp-cursor');
    var ring = document.getElementById('sp-cursor-ring');
    if (!cursor || !ring) return;

    // Style cursor dot
    cursor.style.cssText = 'position:fixed;top:0;left:0;width:8px;height:8px;background:var(--accent-gold);border-radius:50%;pointer-events:none;z-index:9998;opacity:0;transform:translate(-50%,-50%);';

    // Style cursor ring
    ring.style.cssText = 'position:fixed;top:0;left:0;width:28px;height:28px;border:1px solid var(--ui-silver);border-radius:50%;pointer-events:none;z-index:9997;opacity:0;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;transition:width var(--dur-fast) var(--ease-primary),height var(--dur-fast) var(--ease-primary),border-color var(--dur-fast),background var(--dur-fast);';

    var ringLabel = ring.querySelector('.sp-cursor-ring__label');
    if (ringLabel) {
        ringLabel.style.cssText = 'font-family:var(--font-sans);font-size:0.55rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-primary);opacity:0;transition:opacity var(--dur-fast);pointer-events:none;';
    }

    // GSAP quickTo for smooth following
    var xCursor = gsap.quickTo(cursor, 'left', { duration: 0.08, ease: 'power3' });
    var yCursor = gsap.quickTo(cursor, 'top', { duration: 0.08, ease: 'power3' });
    var xRing = gsap.quickTo(ring, 'left', { duration: 0.15, ease: 'power3' });
    var yRing = gsap.quickTo(ring, 'top', { duration: 0.15, ease: 'power3' });

    // Show on first move
    var shown = false;

    document.addEventListener('mousemove', function (e) {
        if (!shown) {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
            gsap.to(ring, { opacity: 0.6, duration: 0.3 });
            shown = true;
        }
        xCursor(e.clientX);
        yCursor(e.clientY);
        xRing(e.clientX);
        yRing(e.clientY);
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', function () {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
        gsap.to(ring, { opacity: 0, duration: 0.2 });
        shown = false;
    });

    // --- Hover states ---

    // Links and buttons: expand ring slightly
    function onInteractiveEnter() {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'var(--accent-gold)';
        ring.style.background = 'transparent';
        gsap.to(cursor, { scale: 0.5, duration: 0.2 });
    }

    function onInteractiveLeave() {
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'var(--ui-silver)';
        ring.style.background = 'transparent';
        if (ringLabel) ringLabel.style.opacity = '0';
        gsap.to(cursor, { scale: 1, duration: 0.2 });
    }

    // Product cards: large ring with VIEW label
    function onProductEnter() {
        ring.style.width = '80px';
        ring.style.height = '80px';
        ring.style.borderColor = 'var(--accent-gold)';
        ring.style.background = 'rgba(201,168,76,0.08)';
        if (ringLabel) {
            ringLabel.textContent = 'VIEW';
            ringLabel.style.opacity = '1';
        }
        gsap.to(cursor, { opacity: 0, duration: 0.15 });
    }

    function onProductLeave() {
        onInteractiveLeave();
        gsap.to(cursor, { opacity: 1, duration: 0.15 });
    }

    // Delegate hover events
    function setupHoverListeners() {
        // Interactive elements
        document.querySelectorAll('a, button').forEach(function (el) {
            // Skip product cards — they have their own handler
            if (el.closest('.product-card')) return;
            el.addEventListener('mouseenter', onInteractiveEnter);
            el.addEventListener('mouseleave', onInteractiveLeave);
        });

        // Product cards
        document.querySelectorAll('.product-card').forEach(function (el) {
            el.addEventListener('mouseenter', onProductEnter);
            el.addEventListener('mouseleave', onProductLeave);
        });

        // Magnetic buttons
        document.querySelectorAll('.btn--magnetic').forEach(function (btn) {
            var rect, centerX, centerY;

            btn.addEventListener('mouseenter', function () {
                rect = btn.getBoundingClientRect();
                centerX = rect.left + rect.width / 2;
                centerY = rect.top + rect.height / 2;
            });

            btn.addEventListener('mousemove', function (e) {
                if (!rect) return;
                var dx = e.clientX - centerX;
                var dy = e.clientY - centerY;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 80) {
                    gsap.to(btn, {
                        x: dx * 0.2,
                        y: dy * 0.2,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            btn.addEventListener('mouseleave', function () {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.4)'
                });
                rect = null;
            });
        });
    }

    // Initial setup
    setupHoverListeners();

    // Re-setup after section loads in Theme Editor
    document.addEventListener('shopify:section:load', function () {
        setupHoverListeners();
    });
}
