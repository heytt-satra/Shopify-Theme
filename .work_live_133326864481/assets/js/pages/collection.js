/* ============================================================
   SWARNA PALACE — Collection Page JS
   ============================================================ */

(function () {
    'use strict';

    document.addEventListener('sp:ready', initCollectionPage);

    function initCollectionPage() {
        initCollectionHeader();
        initFilterBar();
        initProductGridEntrance();
        initLoadMore();
    }

    /* --- Collection Header Animation --- */
    function initCollectionHeader() {
        var section = document.querySelector('[data-section="collection-header"]');
        if (!section) return;

        var inner = section.querySelector('.mask-inner');
        if (inner) {
            gsap.set(inner, { yPercent: 100 });
            gsap.to(inner, {
                yPercent: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.1
            });
        }

        // Image parallax
        var img = section.querySelector('.collection-header__image');
        if (img) {
            gsap.to(img, {
                yPercent: 20,
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
    window.spRegisterSection('collection-header', initCollectionHeader);

    /* --- Filter Bar with GSAP Flip --- */
    function initFilterBar() {
        var filterBar = document.querySelector('[data-section="collection-filter-bar"]');
        if (!filterBar) return;

        var chips = filterBar.querySelectorAll('.filter-chip');
        var grid = document.getElementById('collection-products');
        if (!grid) return;

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var filter = chip.getAttribute('data-filter');

                // Update active chip
                chips.forEach(function (c) { c.classList.remove('filter-chip--active'); });
                chip.classList.add('filter-chip--active');

                // Get product cards
                var cards = grid.querySelectorAll('.product-card');

                // Capture state for Flip
                var state = typeof Flip !== 'undefined' ? Flip.getState(cards) : null;

                // Apply filter
                cards.forEach(function (card) {
                    if (filter === 'all') {
                        card.classList.remove('product-card--filtered');
                        card.style.display = '';
                    } else {
                        var category = card.getAttribute('data-category');
                        if (category === filter) {
                            card.classList.remove('product-card--filtered');
                            card.style.display = '';
                        } else {
                            card.classList.add('product-card--filtered');
                        }
                    }
                });

                // Animate with Flip
                if (state && typeof Flip !== 'undefined') {
                    Flip.from(state, {
                        duration: 0.6,
                        ease: 'power2.inOut',
                        stagger: 0.03,
                        onEnter: function (elements) {
                            return gsap.fromTo(elements, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 });
                        },
                        onLeave: function (elements) {
                            return gsap.to(elements, { opacity: 0.3, scale: 0.96, duration: 0.4 });
                        }
                    });
                }
            });
        });
    }
    window.spRegisterSection('collection-filter-bar', initFilterBar);

    /* --- Product Grid Entrance --- */
    function initProductGridEntrance() {
        var grid = document.getElementById('collection-products');
        if (!grid) return;

        var cards = grid.querySelectorAll('.product-card');
        if (!cards.length) return;

        gsap.set(cards, { opacity: 0, yPercent: 20 });
        ScrollTrigger.batch(cards, {
            onEnter: function (batch) {
                gsap.to(batch, {
                    opacity: 1,
                    yPercent: 0,
                    duration: 0.6,
                    stagger: 0.06,
                    ease: 'power2.out'
                });
            },
            start: 'top 85%'
        });
    }
    window.spRegisterSection('collection-product-grid', initProductGridEntrance);

    /* --- Load More --- */
    function initLoadMore() {
        var btn = document.getElementById('load-more-btn');
        if (!btn) return;

        var grid = document.getElementById('collection-products');
        var paginationData = document.querySelector('.collection-grid__pagination-data');

        // Hide button if no more pages
        if (!paginationData) {
            btn.closest('.load-more').style.display = 'none';
            return;
        }

        var nextUrl = paginationData ? paginationData.getAttribute('data-next-url') : null;

        btn.addEventListener('click', function () {
            if (!nextUrl || btn.classList.contains('load-more__btn--loading')) return;

            btn.classList.add('load-more__btn--loading');

            fetch(nextUrl)
                .then(function (r) { return r.text(); })
                .then(function (html) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    var newCards = doc.querySelectorAll('#collection-products .product-card');
                    var newPagination = doc.querySelector('.collection-grid__pagination-data');

                    // Append new cards
                    newCards.forEach(function (card) {
                        grid.appendChild(card);
                    });

                    // Stagger reveal new cards
                    gsap.from(newCards, {
                        opacity: 0,
                        yPercent: 20,
                        duration: 0.6,
                        stagger: 0.06,
                        ease: 'power2.out'
                    });

                    // Update next URL
                    if (newPagination) {
                        nextUrl = newPagination.getAttribute('data-next-url');
                        if (paginationData) paginationData.setAttribute('data-next-url', nextUrl);
                    } else {
                        nextUrl = null;
                        btn.classList.add('load-more__btn--hidden');
                    }

                    btn.classList.remove('load-more__btn--loading');
                })
                .catch(function (err) {
                    console.error('Load more error:', err);
                    btn.classList.remove('load-more__btn--loading');
                });
        });
    }
})();
