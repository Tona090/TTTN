import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viTranslation from './locales/vi.json';
import enTranslation from './locales/en.json';

const resources = {
  en: {
    translation: enTranslation
  },
  vi: {
    translation: viTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "vi", // default language
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
