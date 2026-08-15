import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './locales/id.json';
import en from './locales/en.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: 'id', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
