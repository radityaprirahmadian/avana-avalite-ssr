import localStorage from './localStorage';

export default function writeLocalization(string = '', collections = []) {
  const text = string.split(/\[(.*?)\]/gi);
  return text.map((e) => {
    if (!isNaN(+e)) {
      return collections?.[e] ?? '';
    }
    return e;
  });
};

export const getCurrentLang = () => {
  try {
    const lang = localStorage.get('lang');
    return lang?.toLowerCase() ?? navigator.language.split("-")[0];
  } catch(e) {
    return 'en'
  }
};

export const setCurrentLang = (lang) => {
  localStorage.set('lang', lang);
};