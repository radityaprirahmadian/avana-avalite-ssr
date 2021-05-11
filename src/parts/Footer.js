import React from 'react'

import { setCurrentLang } from 'src/helpers/localization';

export default function Footer(props) {

   // const setLang = React.useCallback((lang) => {
   //    props.fnSelectLocale(lang);
   // }, [setCurrentLang]);
   
   const locales = {
      en: {name: 'English', code: 'en'},
      id: {name: 'Bahasa', code: 'id'},
      my: {name: 'Malaysia', code: 'my'}
   }

   return (
      <footer className="text-xs text-center py-2 px-4 sticky bottom-0 bg-white">
         <span>Powered By</span>
         <img
            className="inline-block h-4 w-16 object-contain mx-1"
            src={`/images/logo.png`}
            alt="AVANA logo"
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
         {/* <span
            className="inline-block cursor-pointer underline mx-1"
            onClick={() => {}}
         >
            Bahasa
         </span>
         <span
            className="inline-block cursor-pointer underline mx-1"
            onClick={() => {}}
         >
            Malaysia
         </span> */}
      </footer>
   )
}
