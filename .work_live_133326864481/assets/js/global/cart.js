/* ============================================================
   SWARNA PALACE — Cart AJAX Module
   ============================================================ */

(function () {
    'use strict';

    /**
     * Add item to cart via AJAX
     * @param {string|number} variantId
     * @param {number} [quantity=1]
     */
    window.addToCart = function (variantId, quantity) {
        quantity = quantity || 1;

        return fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: [{ id: parseInt(variantId, 10), quantity: quantity }]
            })
        })
            .then(function (response) {
                if (!response.ok) throw new Error('Add to cart failed');
                return response.json();
            })
            .then(function (data) {
                updateCartCount();
                triggerCartFeedback();
                return data;
            })
            .catch(function (err) {
                console.error('Cart error:', err);
                // Show error state on the button that triggered the action
                var activeBtn = document.querySelector('.btn--atc:focus, .product-card__quick-add:focus');
                if (activeBtn) {
                    activeBtn.classList.add('btn--error');
                    activeBtn.textContent = 'ERROR';
                    setTimeout(function () {
                        activeBtn.classList.remove('btn--error');
                        activeBtn.textContent = 'ADD TO CART';
                    }, 2000);
                }
            });
    };

    /**
     * Update the cart count badge in the nav
     */
    function updateCartCount() {
        fetch('/cart.js', {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (r) { return r.json(); })
            .then(function (cart) {
                var countEls = document.querySelectorAll('.nav__cart-count');
                countEls.forEach(function (el) {
                    el.textContent = cart.item_count;
                });
            })
            .catch(function (err) {
                console.error('Cart count update failed:', err);
            });
    }

    /**
     * Visual feedback on the cart icon after adding
     */
    function triggerCartFeedback() {
        var cartIcon = document.querySelector('.nav__cart-icon');
        if (!cartIcon || typeof gsap === 'undefined') return;

        gsap.fromTo(cartIcon,
            { scale: 1 },
            {
                scale: 1.25,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            }
        );
    }

    /**
     * Wire up quick-add buttons on product cards
     */
    function wireQuickAdd() {
        document.addEventListener('click', function (e) {
            var quickBtn = e.target.closest('.product-card__quick-add');
            if (!quickBtn) return;

            e.preventDefault();
            var variantId = quickBtn.getAttribute('data-variant-id');
            if (!variantId) return;

            // Disable and show loading state
            quickBtn.disabled = true;
            var originalText = quickBtn.textContent;
            quickBtn.textContent = 'ADDING...';

            window.addToCart(variantId).then(function () {
                quickBtn.textContent = 'ADDED ✓';
                setTimeout(function () {
                    quickBtn.textContent = originalText;
                    quickBtn.disabled = false;
                }, 1500);
            }).catch(function () {
                quickBtn.textContent = originalText;
                quickBtn.disabled = false;
            });
        });
    }

    /**
     * Wire up main ATC button on PDP
     */
    function wireATC() {
        document.addEventListener('click', function (e) {
            var atcBtn = e.target.closest('.btn--atc');
            if (!atcBtn) return;

            e.preventDefault();
            var variantId = atcBtn.getAttribute('data-variant-id');
            if (!variantId) {
                // Try to find from a hidden input or active variant button
                var form = atcBtn.closest('form');
                if (form) {
                    var hiddenInput = form.querySelector('input[name="id"]');
                    if (hiddenInput) variantId = hiddenInput.value;
                }
                if (!variantId) {
                    var activeVariant = document.querySelector('.variant-btn--active');
                    if (activeVariant) variantId = activeVariant.getAttribute('data-variant-id');
                }
            }

            if (!variantId) return;

            atcBtn.disabled = true;
            var originalText = atcBtn.textContent;
            atcBtn.textContent = 'ADDING...';

            window.addToCart(variantId).then(function () {
                atcBtn.textContent = 'ADDED ✓';
                setTimeout(function () {
                    atcBtn.textContent = originalText;
                    atcBtn.disabled = false;
                }, 2000);
            }).catch(function () {
                atcBtn.textContent = originalText;
                atcBtn.disabled = false;
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            wireQuickAdd();
            wireATC();
        });
    } else {
        wireQuickAdd();
        wireATC();
    }
})();
