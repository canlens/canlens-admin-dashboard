import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from xss
    }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  if (lng === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
});

// Initialize body class on load
const currentLang = i18n.language || window.localStorage.i18nextLng;
if (currentLang?.startsWith('ar')) {
  document.body.classList.add('rtl');
  document.documentElement.dir = 'rtl';
}

export default i18n;
