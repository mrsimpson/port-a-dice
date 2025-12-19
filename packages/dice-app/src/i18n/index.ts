import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import de from './locales/de.json';

export type MessageSchema = typeof en;

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'de'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Get the browser's preferred language
 * Returns the language code (e.g., 'en', 'de') or null if not supported
 */
const getBrowserLanguage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') return null;

  // Get the browser's language preference
  const browserLang = navigator.language || navigator.languages?.[0];
  if (!browserLang) return null;

  // Extract the language code (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Check if the language is supported
  if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
    return langCode as SupportedLanguage;
  }

  return null;
};

/**
 * Determine the locale to use:
 * 1. Check localStorage for saved preference
 * 2. Check browser language preference
 * 3. Fall back to English
 */
const getInitialLocale = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    // Check if user has a saved preference
    const storedLocale = window.localStorage.getItem('locale');
    if (storedLocale && SUPPORTED_LANGUAGES.includes(storedLocale as SupportedLanguage)) {
      return storedLocale as SupportedLanguage;
    }

    // Try to detect browser language
    const browserLang = getBrowserLanguage();
    if (browserLang) {
      return browserLang;
    }
  }

  // Fall back to English
  return 'en';
};

const i18n = createI18n<{ message: MessageSchema }, 'en' | 'de'>({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
});

export default i18n;
