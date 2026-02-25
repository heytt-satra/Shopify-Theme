/* ============================================================
   SWARNA PALACE — init.js
   Register GSAP plugins, init global modules, dispatch sp:ready
   ============================================================ */

(function () {
  'use strict';

  // Register all GSAP plugins once
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // SplitText removed — using manual span wrapping instead
    if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
  }

  // Track section animation initializers
  window.spSectionInits = {};

  /**
   * Register a section animation initializer
   * @param {string} sectionName — matches data-section attribute value
   * @param {Function} initFn — function to call to initialize animations
   */
  window.spRegisterSection = function (sectionName, initFn) {
    window.spSectionInits[sectionName] = initFn;
  };

  /**
   * Re-initialize a section's animations (for Theme Editor compatibility)
   * @param {string} sectionId
   */
  function reinitSectionAnimation(sectionId) {
    var sectionEl = document.querySelector('[data-section-id="' + sectionId + '"]') ||
      document.getElementById('shopify-section-' + sectionId);

    if (!sectionEl) return;

    // Kill existing ScrollTriggers for this section
    ScrollTrigger.getAll().forEach(function (st) {
      if (sectionEl.contains(st.trigger)) {
        st.kill();
      }
    });

    // Find data-section value and re-init
    var innerSection = sectionEl.querySelector('[data-section]');
    if (innerSection) {
      var name = innerSection.getAttribute('data-section');
      if (window.spSectionInits[name]) {
        window.spSectionInits[name]();
      }
    }
  }

  // Handle Theme Editor section load event
  document.addEventListener('shopify:section:load', function (e) {
    var id = e.detail.sectionId;
    reinitSectionAnimation(id);
  });

  // Dispatch sp:ready after loader completes (loader.js calls this)
  window.spDispatchReady = function () {
    // Refresh ScrollTrigger calculations after loader
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    document.dispatchEvent(new CustomEvent('sp:ready'));
  };

  // Nav scroll state
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrollThreshold = 50;

    function checkScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // Ensure category links always open specific category routes.
  function initCategoryLinks() {
    var categoryMap = {
      earrings: '/collections/all/earrings',
      rings: '/collections/all/rings',
      bracelets: '/collections/all/bracelets',
      pendant: '/collections/all/pendant',
      necklaces: '/collections/all/necklaces'
    };

    var categoryLinks = document.querySelectorAll(
      '.nav__submenu-link, .nav__mobile-sublink, .featured-collections__category-link'
    );

    categoryLinks.forEach(function (link) {
      var key = (link.textContent || '').trim().toLowerCase();
      if (categoryMap[key]) {
        link.setAttribute('href', categoryMap[key]);
      }
    });
  }

  // Mobile nav toggle
  function initMobileNav() {
    var hamburger = document.querySelector('.nav__hamburger');
    var mobileMenu = document.querySelector('.nav__mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function closeMobileMenu() {
      mobileMenu.classList.remove('nav__mobile-menu--open');
      hamburger.classList.remove('nav__hamburger--active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      mobileMenu.querySelectorAll('details[open]').forEach(function (detailsEl) {
        detailsEl.removeAttribute('open');
      });
    }

    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('nav__mobile-menu--open');
      hamburger.classList.toggle('nav__hamburger--active', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (!isOpen) {
        mobileMenu.querySelectorAll('details[open]').forEach(function (detailsEl) {
          detailsEl.removeAttribute('open');
        });
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });
  }

  // DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    initCategoryLinks();
    initNavScroll();
    initMobileNav();

    // Loader and cursor are initialized from their own files
    if (typeof initLoader === 'function') {
      initLoader();
    } else {
      // If no loader script, dispatch ready immediately
      window.spDispatchReady();
    }

    if (typeof initCursor === 'function') {
      initCursor();
    }
  });
})();
