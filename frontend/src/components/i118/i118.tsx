import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';

   // Import translation files
   import enTranslation from '../../locales/en/translation.json';
   import uaTranslation from '../../locales/ua/translation.json';

   i18n
     .use(LanguageDetector) // Detects user language
     .use(initReactI18next) // Passes i18n instance to react-i18next
     .init({
       resources: {
         en: {
           translation: enTranslation,
         },
         ua: {
           translation: uaTranslation,
         },
       },
       fallbackLng: 'en', // Default language if detection fails
       interpolation: {
         escapeValue: false, // React already escapes values
       },
     });

   export default i18n;