import localStorage from './localStorage';

export default function writeLocalization(string = '', collections = []) {
  const text = string.split(/\[(.*?)\]/gi);
  return text.map((e) => {
    if (!isNaN(e) && e !== ' ') {
      return collections?.[e] ?? '';
    }
    return e;
  });
};

export const getCurrentLang = (shopOriginLang) => {
  const defaultLang = shopOriginLang === "id" ? shopOriginLang : "en";
  try {
    const lang = localStorage.get('lang');

    return lang?.toLowerCase()
      ? lang?.toLowerCase()
      : shopOriginLang === "id"
        ? shopOriginLang
        : navigator.language.split("-")[0];
  } catch(e) {
    return defaultLang
  }
};

export const setCurrentLang = (lang) => {
  console.log('setting', lang)
  localStorage.set('lang', lang);
  document.querySelector('html').setAttribute('lang', lang);
};