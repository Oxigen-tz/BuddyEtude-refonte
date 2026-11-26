import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Français : toujours chargé (langue par défaut). Anglais : chargé seulement s'il est affiché.
import fr from './locales/fr';

const loadEnglish = () => import('./locales/en').then((m) => {
  if (!i18n.hasResourceBundle('en', 'translation')) i18n.addResourceBundle('en', 'translation', m.default.translation);
});


// Langue au démarrage : le français par défaut, pour tout le monde (robots compris).
// L'anglais seulement si :
//  - l'adresse contient ?lang=en (version anglaise indexable : https://buddyetude.com/?lang=en) ;
//  - ou l'utilisateur l'a choisi avec le bouton de langue (mémorisé sous be_lang).
// Plus de détection par la langue du navigateur : Googlebot annonce un navigateur en anglais
// et indexait la version anglaise de l'accueil. L'ancienne clé « i18nextLng » est ignorée :
// le détecteur l'écrivait tout seul, sans choix de l'utilisateur.
const LANG_KEY = 'be_lang';
const readLang = (v) => (v === 'fr' || v === 'en' ? v : null);
const initialLanguage = (() => {
  if (typeof window === 'undefined') return 'fr';
  const fromUrl = readLang(new URLSearchParams(window.location.search).get('lang'));
  if (fromUrl) return fromUrl;
  try { return readLang(localStorage.getItem(LANG_KEY)) || 'fr'; } catch { return 'fr'; }
})();

i18n
  .use(initReactI18next)
  .init({
    resources: { fr },
    // Démarrage en français ; si l'anglais est demandé, il est chargé puis appliqué avant le
    // premier affichage (i18nReady, attendu par main.jsx)
    lng: 'fr',
    partialBundledLanguages: true,
    supportedLngs: ['fr', 'en'],
    nonExplicitSupportedLngs: true,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

// Choix explicite de l'utilisateur (boutons de langue, Paramètres) : appliqué et mémorisé.
export const chooseLanguage = async (lng) => {
  try { localStorage.setItem(LANG_KEY, lng); } catch { /* stockage indisponible */ }
  if (lng === 'en') await loadEnglish();
  return i18n.changeLanguage(lng);
};

// Prêt à afficher : immédiat en français, après chargement des textes en anglais sinon
export const i18nReady = initialLanguage === 'en'
  ? loadEnglish().then(() => i18n.changeLanguage('en')).catch(() => {})
  : Promise.resolve();

// Garde l'attribut <html lang> aligné sur la langue affichée (lecteurs d'écran, correcteur, SEO)
const syncHtmlLang = (lng) => {
  if (typeof document !== 'undefined' && lng) document.documentElement.lang = lng.split('-')[0];
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;