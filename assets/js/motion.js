/**
 * Hera Labs — Motion System
 * Phase 02B: Cinematic Motion Language
 */

(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FINE_POINTER = window.matchMedia('(pointer: fine)');

  var prefersReducedMotion = REDUCED_MOTION.matches;
  var parallaxEnabled = false;
  var parallaxFrame = null;

  /* --------------------------------------------------------------------------
     Reduced Motion
     -------------------------------------------------------------------------- */

  function handleReducedMotionChange(event) {
    prefersReducedMotion = event.matches;

    if (prefersReducedMotion) {
      stopParallax();
      document.documentElement.classList.remove('motion-pending');
      document.documentElement.classList.add('motion-ready');
      revealAllImmediately();
    }
  }

  function revealAllImmediately() {
    var reveals = document.querySelectorAll('.motion-reveal');
    for (var i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('is-revealed');
    }
  }

  if (REDUCED_MOTION.addEventListener) {
    REDUCED_MOTION.addEventListener('change', handleReducedMotionChange);
  } else if (REDUCED_MOTION.addListener) {
    REDUCED_MOTION.addListener(handleReducedMotionChange);
  }

  /* --------------------------------------------------------------------------
     Page Load Sequence
     -------------------------------------------------------------------------- */

  function initPageLoad() {
    var root = document.documentElement;

    if (prefersReducedMotion) {
      root.classList.remove('motion-pending');
      root.classList.add('motion-ready');
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('motion-pending');
        root.classList.add('motion-ready');
        initParallaxAfterLoad();
      });
    });
  }

  /* --------------------------------------------------------------------------
     Scroll Reveal
     -------------------------------------------------------------------------- */

  function initScrollReveal() {
    var elements = document.querySelectorAll('.motion-reveal');

    if (!elements.length) return;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      revealAllImmediately();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );

    for (var i = 0; i < elements.length; i++) {
      observer.observe(elements[i]);
    }
  }

  /* --------------------------------------------------------------------------
     Hero Card Parallax
     -------------------------------------------------------------------------- */

  function isTouchDevice() {
    return !FINE_POINTER.matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
  }

  function initParallaxAfterLoad() {
    if (prefersReducedMotion || isTouchDevice()) return;

    var showcase = document.querySelector('.hero__showcase');
    var cards = document.querySelectorAll('.hero__cards-item');

    if (!showcase || !cards.length) return;

    var cardStates = [];
    var maxOffset = 6;
    var lerpFactor = 0.06;
    var pointer = { x: 0, y: 0 };
    var active = false;

    for (var i = 0; i < cards.length; i++) {
      cardStates.push({
        el: cards[i],
        depth: 0.35 + i * 0.22,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
      });

      cards[i].addEventListener('animationend', function (event) {
        event.currentTarget.classList.add('is-parallax-ready');
      }, { once: true });

      /* Fallback if animation already completed */
      setTimeout(function (card) {
        card.classList.add('is-parallax-ready');
      }, 1800, cards[i]);
    }

    function onPointerMove(event) {
      var rect = showcase.getBoundingClientRect();
      var relX = (event.clientX - rect.left) / rect.width - 0.5;
      var relY = (event.clientY - rect.top) / rect.height - 0.5;

      pointer.x = Math.max(-0.5, Math.min(0.5, relX));
      pointer.y = Math.max(-0.5, Math.min(0.5, relY));
    }

    function onPointerEnter() {
      active = true;
      startParallaxLoop();
    }

    function onPointerLeave() {
      active = false;
      pointer.x = 0;
      pointer.y = 0;

      for (var j = 0; j < cardStates.length; j++) {
        cardStates[j].targetX = 0;
        cardStates[j].targetY = 0;
      }

      startParallaxLoop();
    }

    function updateParallax() {
      var stillMoving = false;

      for (var k = 0; k < cardStates.length; k++) {
        var state = cardStates[k];

        if (active) {
          state.targetX = pointer.x * maxOffset * state.depth * 2;
          state.targetY = pointer.y * maxOffset * state.depth * 2;
        }

        state.currentX += (state.targetX - state.currentX) * lerpFactor;
        state.currentY += (state.targetY - state.currentY) * lerpFactor;

        if (Math.abs(state.targetX - state.currentX) > 0.01 ||
            Math.abs(state.targetY - state.currentY) > 0.01) {
          stillMoving = true;
        }

        if (state.el.classList.contains('is-parallax-ready')) {
          state.el.style.transform =
            'translate3d(' +
            state.currentX.toFixed(2) + 'px, ' +
            state.currentY.toFixed(2) + 'px, 0)';
        }
      }

      if (stillMoving || active) {
        parallaxFrame = requestAnimationFrame(updateParallax);
      } else {
        parallaxFrame = null;
      }
    }

    function startParallaxLoop() {
      if (parallaxFrame === null) {
        parallaxFrame = requestAnimationFrame(updateParallax);
      }
    }

    parallaxEnabled = true;
    showcase.addEventListener('mousemove', onPointerMove, { passive: true });
    showcase.addEventListener('mouseenter', onPointerEnter, { passive: true });
    showcase.addEventListener('mouseleave', onPointerLeave, { passive: true });
  }

  function stopParallax() {
    if (!parallaxEnabled) return;

    var cards = document.querySelectorAll('.hero__cards-item');
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.transform = '';
      cards[i].classList.remove('is-parallax-ready');
    }

    if (parallaxFrame !== null) {
      cancelAnimationFrame(parallaxFrame);
      parallaxFrame = null;
    }

    parallaxEnabled = false;
  }

  /* --------------------------------------------------------------------------
     Init
     -------------------------------------------------------------------------- */

  function init() {
    initScrollReveal();
    initPageLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
