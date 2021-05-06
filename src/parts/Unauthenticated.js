import React from 'react';

import Localization from 'src/configs/lang/errors';
import { getCurrentLang } from 'src/helpers/localization';

import ErrorsWrapper from 'src/components/ErrorsWrapper';

export default function Unauthenticated(props) {   
   const [message, setMessage] = React.useState('...');

   React.useEffect(() => {
      const lang = Localization[getCurrentLang()]
      switch (props?.message?.toLowerCase()) {
         case 'shop not found':
            setMessage(lang?.text__shop_not_found || 'Shop Not Found')
            break;
         case 'certain shop':
            setMessage(lang?.text__certain_shop || 'Certain Shop')
            break;
         case 'unauthenticated.':
            setMessage(lang?.text__certain_shop || 'Certain Shop')
            break;
         default:
            setMessage('-');
            break;
      }
   }, []);

   return (
      <div
         className="m-auto min-h-screen flex items-center justify-center text-center"
         style={{ minWidth: 300, maxWidth: 375}}
      >
         {/* <div className="w-2/4">Shop not found</div> */}
         <ErrorsWrapper error={{
            title: message !== '-' ? 'Opps!' : '',
            message: message
         }} />
      </div>
   )
}
