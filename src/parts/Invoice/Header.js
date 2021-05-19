import React from 'react'

import PrivacyPolicy from 'src/parts/PrivacyPolicy'
import Image from 'src/components/Container/Image'

import images from 'src/constants/images'
import writeLocalization from 'src/helpers/localization'


export default function Header({ lang, data, currentStep }) {
   let imagePreview = data?.whatsapp_logo
   if (imagePreview.indexOf('%3A') > -1)
      //should be fixed on api level, but yeah we fixed it anyway on frontend
      imagePreview = `https:` + imagePreview.split('%3A')[1]

   return (
      <header className="pt-6">
         <div className="mx-auto w-20 h-20 rounded-full overflow-hidden">
            <Image src={imagePreview} alt={data?.shop_name} placeholder={images.profilePlaceholder} />
         </div>
         <h1 className="text-center mt-3">
            {/* {headerMessage ?? 'Selamat datang di'} <strong>{data?.shop_name ?? 'Shop Name'}</strong> */}
            {currentStep === 1
               ? lang?.text__complete_information || 'Please Complete Your Information'
               : currentStep === 3
                  ? lang?.text__choose_payment  || 'Choose Your Payment Method'
                  : writeLocalization(
                     lang?.text__thank_purchasing || 'Thanks for Purchasing in <bold>[0]!</bold>',
                     [data?.shop_name]
                  )
            }
         </h1>
         {!!(data?.is_enabled_privacy_policy) && (
            <PrivacyPolicy longtext shopInfo={data} />
         )}
      </header>
   )
}
