import React from 'react'

import { setCurrentLang } from 'src/helpers/localization';

export default function Footer(props) {
   const { lang } = props;
   // const setLang = React.useCallback((lang) => {
   //    props.fnSelectLocale(lang);
   // }, [setCurrentLang]);
   
   const locales = {
      en: {name: 'English', code: 'en'},
      id: {name: 'Bahasa', code: 'id'},
      my: {name: 'Melayu', code: 'my'}
   }

   return (
      <footer className="text-xs text-center py-1 px-4 sticky bottom-0 bg-white">
         <span>{lang?.text__powered_by || 'Powered By'}</span>
         <img
            className="inline-block h-4 w-16 object-contain mx-1"
            src={`/images/logo.png`}
            alt="AVANA logo"
            style={{
               width: '64px',
               height: '16px'
            }}
         />
         {Object.values(locales).map((lang) => (
            <span
               className="inline-block cursor-pointer underline mx-1"
               onClick={() => { props.fnSelectLocale(lang.code) }}
               key={lang.code}
            >
               {lang.name}
            </span>
         ))}
      </footer>
   )
}
