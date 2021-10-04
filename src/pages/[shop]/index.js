import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import shops from 'src/constants/api/shops'

import ErrorBoundary from 'src/parts/ErrorBoundary'
import Spinner from 'src/components/Spinner'

import Unauthenticated from 'src/parts/Unauthenticated'
import FacebookPixel from 'src/helpers/analytics/facebookPixel'

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
            <FacebookPixel.init
               pixelid={props?.data?.details?.shop_info?.facebook_pixel_id}
            />
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
   const isYellowpillowShop = shop === 'yellowpillow'
   try {
      if (!isYellowpillowShop) {
         const shopToken = await shops.oAuth(shop)

         const shopDetails = await shops.details({
            id: shopToken.shop_id,
            token: shopToken.oauth_access_token,
         })
      }

      return {
         props: {
            data: {
               details: isYellowpillowShop ? {
                  "id":44086,
                  "fanpage_id":"",
                  "shop_registration":{
                     "ip_address":"172.30.0.246",
                     "created_at":"2019-10-03 06:31:32",
                     "created_country_id":100
                  },
                  "shop_info":{
                     "shop_name":"Yellowpillow",
                     "slug":"yellowpillow",
                     "domain":"yellowpillow.avana.asia",
                     "domain_type":"slug",
                     "description":"We love color, we do love all",
                     "phone_no":"+6285263735253",
                     "shop_postcode":"40115",
                     "city":"BANDUNG",
                     "latitude":null,
                     "longitude":null,
                     "status":1,
                     "product_permalink_destination":"webstore",
                     "comment":1,
                     "webstore_style":"orange",
                     "webstore_template":"fashion",
                     "profile_picture":"https:\/\/s3.ap-southeast-1.amazonaws.com\/avana.cf\/\/common\/thumbnail\/images",
                     "webstore_logo":"https:\/\/s3.ap-southeast-1.amazonaws.com\/avana.cf\/44086\/images\/thumbnail\/d8e8f8c680604df5a581",
                     "webstore_favicon":"https:\/\/s3.ap-southeast-1.amazonaws.com\/avana.cf\/44086\/images\/thumbnail\/319886631295e33f4244",
                     "whatsapp_logo":"https:\/\/s3.ap-southeast-1.amazonaws.com\/avana.cf\/44086\/images\/thumbnail\/8823d5df9a4212850b15",
                     "invoice_logo":"https:\/\/s3.ap-southeast-1.amazonaws.com\/avana.cf\/44086\/images\/eaa3475a8c4773ce1c8c",
                     "shop_email":"masterzera111@gmail.com",
                     "shipping_disabled":0,
                     "use_sameday_delivery":false,
                     "facebook_pixel_id":"2792764334096422",
                     "is_enabled_privacy_policy":1,
                     "avapay_balance":0,
                     "avapay_balance_on_hold":0
                  },
                  "shop_category":{
                     "category_id":2,
                     "category_name":"Books"
                  },
                  "currency":{
                     "id":9,
                     "title":"Indonesian Rupiah",
                     "code":"IDR",
                     "symbol":"Rp",
                     "locale":null
                  },
                  "country":{
                     "id":100,
                     "name":"Indonesia",
                     "iso_code":"ID"
                  },
                  "state":{
                     "id":254,
                     "name":"Jawa Barat",
                     "abbrv":"JB"
                  },
                  "seo":{
                     "title":"Yellowpillow Shop",
                     "description":"We provide everything that you need",
                     "keywords":"shop,bag,casual"
                  },
                  "subscription":{
                     "active":{
                        "plan_id":2,
                        "plan_code":"business_plan",
                        "plan_name":"Business Plan",
                        "remark":"",
                        "start_date":"2021-09-06 10:40:58",
                        "end_date":"2021-10-06 10:40:58",
                        "is_freemium":false,
                        "is_active":true
                     },
                     "next":[
                        
                     ]
                  },
                  "shop_features_enabled":[
                     {
                        "id":3,
                        "name":"bank_info",
                        "status":1
                     }
                  ],
                  "notification_emails":false,
                  "shop_payments":{
                     "manual_payment":{
                        "enabled":1
                     },
                     "credit_card":{
                        "enabled":1
                     },
                     "paypal":{
                        "enabled":0,
                        "paypal_email":"",
                        "paypal_blocked":0
                     },
                     "avapay":{
                        "enabled":1
                     }
                  },
                  "webstore_url":"https:\/\/yellowpillow.sandbox.avana.asia"
               } : shopDetails,
               token: isYellowpillowShop ? {
                  "shop_id":44086,
                  "oauth_access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM4Yzg3ZWYyMzEyM2M4YTkzNDAxNTdmMThlZjY0NDFiNWFiYjc5ZjgwYTFjMDYyMzRhZmI3ZWIwMTgxYmZlNWQ1OGRhZWRhN2VjYzFkM2IyIn0.eyJhdWQiOiIxIiwianRpIjoiYzhjODdlZjIzMTIzYzhhOTM0MDE1N2YxOGVmNjQ0MWI1YWJiNzlmODBhMWMwNjIzNGFmYjdlYjAxODFiZmU1ZDU4ZGFlZGE3ZWNjMWQzYjIiLCJpYXQiOjE2MjM3MzgzMTYsIm5iZiI6MTYyMzczODMxNiwiZXhwIjoxNjU1Mjc0MzE2LCJzdWIiOiIxMDczNTIiLCJzY29wZXMiOlsiYXZhbGl0ZSJdfQ.DZ85QoRrKelUFp5DuOsdej7CibQ1JWHuGFRTyQBXRI3iegC8qEJR3jnLnclqAx0NS8g6h2yHC9Oh6AjZjruKSYL73Jo3Nnc5KUR0GY_Swipx5k9aajmwBnRajNLLPTRHcWQguxxtUcH7oeDsscjdrrXI3NQ5JnEJ9MnoNS6lzICCTX-LHpOIRpHrd2Ix4r6e8BJ8qmpBsYQZxCnUrvIq7UHEw6ykHyDn_1sfpIY5htT6zPczCNNIfsVpeVmr16osvq-pPk2w2LngpWLg3hd4xtq3Hq60cSCLmA7BBo0f4hwXGGnW4OAgoxZxoMOurfqiH9U4X-JkbSJ1f_PJK_49frHRzz2aq1K1pEgGEfF2saxi-jNnLhDNr83Fhx6iRt8QymfbUXkka6TqxaeeEwTkmMPsUZ_TcMPxQ2E4v588LjOP6JzFNKo3RnBGgTvdPNgFCwtGU0QOgTRa2pzSsGDnmwgmFwnRXagU0GaKuDuWxw6xOC-Ve5hCNo7bIlh0umLUDtow7tdRrpMtNlzHTb1oKXnviaidPeZTQXkPb_SWG2LB1gfVldlqMbJDM3IMufX8cjNrnOGMuCAE5YNrNB1-T3dpM3wTJ5SpBYKuMjnlV2-_-zsPHXesvuA3wxbhO43TfXDId4IK13AskpoLbPu-CAO6AG92pi2mHOFyXCBrHwQ"
               } : shopToken,
               waId: wa ? wa : null,
            },
         },
      }
   } catch (error) {
      const errors = error?.response?.status === 503 ? {} : (error?.response?.data || {})
      return { props: errors }
   }
}

export default Home
