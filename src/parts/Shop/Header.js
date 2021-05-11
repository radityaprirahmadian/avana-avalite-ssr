import React from 'react'
import Image from 'src/components/Container/Image'
import images from 'src/constants/images'

export default function Header({ data }) {
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
            Selamat datang di <strong>{data?.shop_name ?? 'Shop Name'}</strong>
         </h1>
      </header>
   )
}
