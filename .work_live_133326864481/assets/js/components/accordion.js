/* ============================================================
   SWARNA PALACE — Accordion Component
   ============================================================ */

/**
 * Initialize accordions within a given scope element.
 * @param {HTMLElement} [scope=document]
 */
function initAccordions(scope) {
    'use strict';

    scope = scope || document;
    var items = scope.querySelectorAll('.accordion');
    if (!items.length) return;

    items.forEach(function (item) {
        var header = item.querySelector('.accordion__header');
        var content = item.querySelector('.accordion__content');
        var icon = item.querySelector('.accordion__icon');

        if (!header || !content) return;

        // Set initial closed state
        gsap.set(content, { height: 0, overflow: 'hidden' });

        header.addEventListener('click', function () {
            var isOpen = item.classList.contains('accordion--open');

            if (isOpen) {
                // Close this accordion
                closeAccordion(item, content, icon);
            } else {
                // Close all other accordions in scope first
                items.forEach(function (otherItem) {
                    if (otherItem !== item && otherItem.classList.contains('accordion--open')) {
                        var otherContent = otherItem.querySelector('.accordion__content');
                        var otherIcon = otherItem.querySelector('.accordion__icon');
                        closeAccordion(otherItem, otherContent, otherIcon);
                    }
                });

                // Open clicked accordion
                openAccordion(item, content, icon);
            }
        });
    });

    function openAccordion(item, content, icon) {
        item.classList.add('accordion--open');

        // GSAP height auto trick
        gsap.set(content, { height: 'auto' });
        var fullHeight = content.offsetHeight;
        gsap.set(content, { height: 0 });

        gsap.to(content, {
            height: fullHeight,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: function () {
                gsap.set(content, { height: 'auto' });
            }
        });

        if (icon) {
            gsap.to(icon, { rotation: 45, duration: 0.3, ease: 'power2.out' });
        }
    }

    function closeAccordion(item, content, icon) {
        item.classList.remove('accordion--open');

        gsap.to(content, {
            height: 0,
            duration: 0.4,
            ease: 'power2.inOut'
        });

        if (icon) {
            gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.out' });
        }
    }
}
