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

/**
 * Hera Labs — Hero URL cleanup
 * Keeps the homepage URL clean when navigating to #hero.
 */
(function () {
  'use strict';

  var HERO_ID = 'hero';
  var HERO_HASH = '#' + HERO_ID;

  function getCleanUrl() {
    return window.location.pathname + window.location.search;
  }

  function replaceHeroHash() {
    if (window.location.hash !== HERO_HASH) return;
    history.replaceState(history.state, '', getCleanUrl());
  }

  function scrollToHero() {
    var hero = document.getElementById(HERO_ID);
    if (!hero) return;
    hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href="' + HERO_HASH + '"]');
    if (!link) return;

    event.preventDefault();
    scrollToHero();
    history.replaceState(history.state, '', getCleanUrl());
  });

  window.addEventListener('hashchange', replaceHeroHash);

  if (window.location.hash === HERO_HASH) {
    replaceHeroHash();
  }
})();
