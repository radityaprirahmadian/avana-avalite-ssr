import React from 'react'

import PrivacyPolicy from 'src/parts/PrivacyPolicy'
import Image from 'src/components/Container/Image'
import images from 'src/constants/images'

import Localization from 'src/configs/lang/shop';
import { getCurrentLang } from 'src/helpers/localization';

export default function Header({ data }) {
   const lang = Localization[getCurrentLang()]
   let imagePreview = data?.whatsapp_logo?.replace?.(
      '/thumbnail',
      '') || data?.webstore_logo
   if (imagePreview.indexOf('%3A') > -1)
      //should be fixed on api level, but yeah we fixed it anyway on frontend
      imagePreview = `https:` + imagePreview.split('%3A')[1]

   return (
      <header className="pt-6 font-montserrat">
         <div
            className="mx-auto w-20 h-20 rounded-full overflow-hidden"
         >
            <Image
               src={imagePreview}
               alt={data?.shop_name}
               placeholder={images.profilePlaceholder}
               style={{
                  width: '80px',
                  height: '80px'
               }}
            />
         </div>
         <h1 className="text-center mt-3">
            <strong>{lang?.text__greeting || 'Welcome to'} {data?.shop_name ?? 'Shop Name'}</strong>
         </h1>
         {!!(data?.is_enabled_privacy_policy) && (
            <PrivacyPolicy longtext shopInfo={data} />
         )}
      </header>
   )
}
