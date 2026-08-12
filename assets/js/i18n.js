/**
 * Hera Labs — Internationalization (i18n)
 * Phase 05: Multilingual Foundation
 *
 * Adding a new language: create assets/i18n/{code}.json and add the code to SUPPORTED_LANGUAGES.
 * Future routing: ROUTE_PREFIXES maps language codes to URL prefixes (/en, /tr).
 */

/** @type {readonly string[]} */
const SUPPORTED_LANGUAGES = ['en', 'tr'];

/** @type {string} */
const DEFAULT_LANGUAGE = 'en';

/** @type {string} */
const FALLBACK_LANGUAGE = 'en';

/** @type {string} */
const STORAGE_KEY = 'hera-labs-language';

/** @type {string} */
const I18N_BASE_PATH = 'assets/i18n';

/**
 * Future URL routing prefixes.
 * Not active yet — reserved for /en and /tr path-based routing.
 * @type {Readonly<Record<string, string>>}
 */
const ROUTE_PREFIXES = Object.freeze({
  en: '/en',
  tr: '/tr'
});

/** @type {Map<string, object>} */
const translationCache = new Map();

/** @type {string} */
let currentLanguage = DEFAULT_LANGUAGE;

/**
 * Resolve a dot-notated key against a nested translation object.
 * @param {object} translations
 * @param {string} key
 * @returns {string|undefined}
 */
function resolveKey(translations, key) {
  return key.split('.').reduce(function (value, segment) {
    if (value === null || value === undefined) return undefined;
    return value[segment];
  }, translations);
}

/**
 * Fetch and cache a language file.
 * @param {string} language
 * @returns {Promise<object>}
 */
async function loadLanguageFile(language) {
  if (translationCache.has(language)) {
    return translationCache.get(language);
  }

  const response = await fetch(I18N_BASE_PATH + '/' + language + '.json');

  if (!response.ok) {
    throw new Error('Failed to load translation file: ' + language);
  }

  const data = await response.json();
  translationCache.set(language, data);
  return data;
}

/**
 * Preload all supported languages into memory for instant switching.
 * @returns {Promise<void>}
 */
async function preloadLanguages() {
  await Promise.all(SUPPORTED_LANGUAGES.map(function (lang) {
    return loadLanguageFile(lang);
  }));
}

/**
 * Translate a key for the given language with English fallback.
 * @param {string} key
 * @param {string} [language]
 * @returns {string}
 */
function translate(key, language) {
  const lang = language || currentLanguage;
  const translations = translationCache.get(lang);
  const fallback = translationCache.get(FALLBACK_LANGUAGE);

  let value = translations ? resolveKey(translations, key) : undefined;

  if (value === undefined && lang !== FALLBACK_LANGUAGE && fallback) {
    value = resolveKey(fallback, key);

    if (value !== undefined) {
      console.warn(
        '[i18n] Missing key "' + key + '" in "' + lang + '". Falling back to English.'
      );
    }
  }

  if (value === undefined) {
    console.warn('[i18n] Missing key "' + key + '" in all languages.');
    return '';
  }

  if (typeof value !== 'string') {
    console.warn('[i18n] Key "' + key + '" does not resolve to a string.');
    return '';
  }

  return value;
}

/**
 * Apply translated text to all marked DOM nodes.
 * @param {string} language
 */
function applyTranslations(language) {
  document.querySelectorAll('[data-i18n]').forEach(function (element) {
    element.textContent = translate(element.getAttribute('data-i18n'), language);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(function (element) {
    element.setAttribute('aria-label', translate(element.getAttribute('data-i18n-aria'), language));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(function (element) {
    element.setAttribute('aria-label', translate(element.getAttribute('data-i18n-aria-label'), language));
  });

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', translate('meta.description', language));
  }

  document.title = translate('meta.title', language);
  document.documentElement.lang = language;
}

/**
 * Sync language switcher UI state.
 * @param {string} language
 */
function updateLanguageSwitcher(language) {
  document.querySelectorAll('.lang-switch__code').forEach(function (element) {
    element.textContent = language.toUpperCase();
  });

  document.querySelectorAll('.lang-switch__toggle').forEach(function (button) {
    const targetKey = language === 'en' ? 'language.switchToTurkish' : 'language.switchToEnglish';
    button.setAttribute('aria-label', translate(targetKey, language));
  });
}

/**
 * Persist and apply a language change.
 * @param {string} language
 */
function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn('[i18n] Unsupported language "' + language + '".');
    return;
  }

  if (!translationCache.has(language)) {
    console.warn('[i18n] Language "' + language + '" is not loaded yet.');
    return;
  }

  currentLanguage = language;
  localStorage.setItem(STORAGE_KEY, language);
  applyTranslations(language);
  updateLanguageSwitcher(language);
}

/**
 * Read stored language preference or return default.
 * @returns {string}
 */
function getStoredLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Resolve language from a future path prefix (e.g. /tr/...).
 * @param {string} [pathname]
 * @returns {string|null}
 */
function getLanguageFromPath(pathname) {
  const path = pathname || window.location.pathname;

  for (const [lang, prefix] of Object.entries(ROUTE_PREFIXES)) {
    if (path === prefix || path.startsWith(prefix + '/')) {
      return lang;
    }
  }

  return null;
}

/**
 * Bind language switcher controls.
 */
function bindLanguageSwitcher() {
  document.querySelectorAll('.lang-switch__toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      const nextLanguage = currentLanguage === 'en' ? 'tr' : 'en';
      setLanguage(nextLanguage);
    });
  });
}

/**
 * Initialize the i18n system.
 * @returns {Promise<void>}
 */
async function initI18n() {
  try {
    await preloadLanguages();

    const pathLanguage = getLanguageFromPath();
    const initialLanguage = pathLanguage || getStoredLanguage();

    currentLanguage = SUPPORTED_LANGUAGES.includes(initialLanguage)
      ? initialLanguage
      : DEFAULT_LANGUAGE;

    applyTranslations(currentLanguage);
    updateLanguageSwitcher(currentLanguage);
    bindLanguageSwitcher();
  } catch (error) {
    console.error('[i18n] Initialization failed:', error);

    if (translationCache.has(FALLBACK_LANGUAGE)) {
      currentLanguage = FALLBACK_LANGUAGE;
      applyTranslations(FALLBACK_LANGUAGE);
    }
  }
}

export {
  initI18n,
  translate,
  setLanguage,
  getLanguageFromPath,
  ROUTE_PREFIXES,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
};

initI18n();
