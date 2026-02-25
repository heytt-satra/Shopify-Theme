/* ============================================================
   SWARNA PALACE — Lenis Smooth Scroll Setup
   ============================================================ */

(function () {
    'use strict';

    function initLenis() {
        if (typeof Lenis === 'undefined') return;

        var lenis = new Lenis({
            duration: 1.2,
            easing: function (t) {
                return Math.min(1, 1.001 - Math.pow(2, -10 * t));
            },
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true
        });

        // Sync Lenis to GSAP ticker
        gsap.ticker.add(function (time) {
            lenis.raf(time * 1000);
        });

        // Disable GSAP lag smoothing for Lenis compatibility
        gsap.ticker.lagSmoothing(0);

        // Expose globally for other modules
        window.spLenis = lenis;
    }

    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLenis);
    } else {
        initLenis();
    }
})();
