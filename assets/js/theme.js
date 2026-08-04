/**
 * Hera Labs — Theme System
 * Phase 10: Dark / Light Theme
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'hera-labs-theme';
  var TRANSITION_MS = 250;
  var root = document.documentElement;
  var toggleButton = document.querySelector('.theme-toggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  var THEME_COLORS = {
    dark: '#090909',
    light: '#F4F4F2'
  };

  /**
   * Resolve system color scheme preference.
   * @returns {'dark'|'light'}
   */
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  /**
   * Read persisted theme preference.
   * @returns {'dark'|'light'|null}
   */
  function getStoredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  }

  /**
   * Apply theme attribute and meta theme-color.
   * @param {'dark'|'light'} theme
   * @param {boolean} animate
   */
  function applyTheme(theme, animate) {
    root.setAttribute('data-theme', theme);

    if (metaTheme) {
      metaTheme.setAttribute('content', THEME_COLORS[theme]);
    }

    if (animate) {
      root.classList.add('theme-transition');
      window.setTimeout(function () {
        root.classList.remove('theme-transition');
      }, TRANSITION_MS);
    }
  }

  /**
   * Set and optionally persist theme preference.
   * @param {'dark'|'light'} theme
   */
  function setTheme(theme) {
    applyTheme(theme, true);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * Toggle between dark and light themes.
   */
  function toggleTheme() {
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Initialize theme toggle interaction.
   */
  function initThemeToggle() {
    if (!toggleButton) return;
    toggleButton.addEventListener('click', toggleTheme);
  }

  /**
   * Sync with system preference only when user has not chosen manually.
   */
  function bindSystemPreferenceListener() {
    var media = window.matchMedia('(prefers-color-scheme: light)');

    function onChange() {
      if (getStoredTheme()) return;
      applyTheme(getSystemTheme(), false);
    }

    if (media.addEventListener) {
      media.addEventListener('change', onChange);
    } else if (media.addListener) {
      media.addListener(onChange);
    }
  }

  /**
   * Initialize theme system after DOM is ready.
   */
  function initTheme() {
    var theme = getStoredTheme() || getSystemTheme();
    applyTheme(theme, false);
    initThemeToggle();
    bindSystemPreferenceListener();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
