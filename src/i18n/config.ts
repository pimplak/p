import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pl from './locales/pl.json';

// Get stored language or default to Polish
const getStoredLanguage = (): string => {
  try {
    const stored = localStorage.getItem('p-language');
    return stored || 'pl';
  } catch {
    return 'pl';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pl: { translation: pl },
      en: { translation: en },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
