import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import shops from 'src/constants/api/shops'

import ErrorBoundary from 'src/parts/ErrorBoundary'
import Spinner from 'src/components/Spinner'

import Unauthenticated from 'src/parts/Unauthenticated'
import FacebookPixel from 'src/helpers/analytics/facebookPixel'
import loadScript from 'src/helpers/loadScript'

import { setAuthorization, setBaseUrl } from 'src/configs/axios/protected'

const Shop = dynamic(
   () => import('src/parts/Shop'),
   {
      ssr: false,
      loading: () => (
         <div className="flex align-center justify-center flex-1">
            <Spinner
               className="m-0 flex-none"
               size={1}
            />
         </div>
      )
   }
)

function Home(props) {
   
   if (props.errors) return null
   const isShopFound = !!(props?.data?.token && props?.data?.details)

   const title = props?.data?.details?.seo?.title || 'WhatsApp Commerce'

   const description = props?.data?.details?.seo?.description
      || 'Our commerce platform helps automate your business so that you can make money with ease'

   const keywords = props?.data?.details?.seo?.keywords || ''

   const favicon = props?.data?.details?.shop_info?.webstore_favicon?.replace?.(
      '/thumbnail',
      '') || '/images/favicon.ico'

   const imageLogo = props?.data?.details?.shop_info?.whatsapp_logo
      || props?.data?.details?.shop_info?.webstore_logo || ''
   let imagePreview = imageLogo?.replace?.('/thumbnail', '') || '/images/avana_logo.png'
   if (imagePreview?.indexOf('%3A') > -1)
      imagePreview = `https:` + imagePreview?.split('%3A')[1]

   const url = process.env.NEXT_APP_HOST && props?.data?.details?.shop_info?.slug
      ? `${process.env.NEXT_APP_HOST}/${props?.data?.details?.shop_info?.slug}`
      : ''

   setBaseUrl(props?.data?.token?.shop_id)
   setAuthorization(props?.data?.token?.oauth_access_token)

   React.useEffect(() => {
      if (process.env.NEXT_PUBLIC_API_HOST.includes('avana.asia')) {
         FacebookPixel.init({pixelid: props?.data?.details?.shop_info?.facebook_pixel_id})
      }
   }, [])

   return (
      <>
         <Head>
            {/* <!-- Primary Meta Tags --> */}
            <title>{title}</title>
            <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="shortcut icon" href={favicon} />

            {/* <!-- Open Graph / Facebook --> */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:site_name" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imagePreview} />
            <meta property="og:image:secure_url" content={imagePreview} />
            <meta property="og:image:width" content="200" />
            <meta property="og:image:height" content="200" />

            {/* <!-- Twitter --> */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={imagePreview} />
            {/* <FacebookPixel.init
               pixelid={props?.data?.details?.shop_info?.facebook_pixel_id}
            /> */}
         </Head>

         <main
            className="mx-auto min-h-screen flex flex-col"
            style={{ minWidth: 300, maxWidth: 375}}
         >
            {isShopFound ? (
               <ErrorBoundary>
                  <Shop shopDetails={props.data} />
               </ErrorBoundary>
            ) : (
               <Unauthenticated message={props.message} />
            )}
         </main>
      </>
   )
}

export async function getServerSideProps(context) {
   const { shop } = context.params
   const { wa } = context.query
   context.res?.setHeader(
      'Cache-Control',
      'max-age=10, no-cache, no-store, must-revalidate'
   )

   try {
      const shopToken = await shops.oAuth(shop)

      const shopDetails = await shops.details({
         id: shopToken.shop_id,
         token: shopToken.oauth_access_token,
      })

      return {
         props: {
            data: {
               details: shopDetails,
               token: shopToken,
               waId: wa ? wa : null,
            },
         },
      }
   } catch (error) {
      const errors = error?.status === 503 ? {} : (error?.data || error)
      return { props: errors }
   }
}

export default Home
