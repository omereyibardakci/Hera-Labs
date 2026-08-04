/**
 * Hera Labs — Application Scripts
 * Phase 01: Header scroll behavior
 */

(function () {
  'use strict';

  var header = document.getElementById('header');
  if (!header) return;

  var scrollThreshold = 20;
  var ticking = false;

  function updateHeaderState() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeaderState();
})();
