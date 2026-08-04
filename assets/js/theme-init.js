/**
 * Hera Labs — Theme System
 * Phase 10: Dark / Light Theme
 *
 * Inline this script in <head> before stylesheets to prevent flash of incorrect theme.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hera-labs-theme';
  var stored = localStorage.getItem(STORAGE_KEY);
  var theme;

  if (stored === 'light' || stored === 'dark') {
    theme = stored;
  } else {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  document.documentElement.setAttribute('data-theme', theme);
})();
