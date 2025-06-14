
// Core localization exports and utilities
export * from './languages';
export * from './categories';
export * from './common';
export * from './navigation';
export * from './profile';
export * from './home';
export * from './search';
export * from './jobs';

// Language codes
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn', 'ml'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Get all translations for a language
export const getTranslationsForLanguage = (lang: SupportedLanguage) => {
  const translations = require(`./${lang}`);
  return translations.default || translations;
};
