import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'es', // Default language
    fallbackLng: 'es', // Fallback language
    debug: true, // Enable debug mode in development
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;