import React, { useState } from 'react';
import { useRouter } from 'next/router';
import mixpanel from 'mixpanel-browser';

import STORAGE from 'src/helpers/localStorage'
import mobileTabletCheck from 'src/helpers/mobileTabletCheck';
import facebookPixel from 'src/helpers/analytics/facebookPixel';

import Header from './Header'

import CustomerInformation from './CustomerInformation'
import ProductSelection from './ProductSelection'
import Checkout from './Checkout'

import useForm from 'src/helpers/customHooks/useForm'
import useStatus from 'src/helpers/customHooks/useStatus'

import Footer from 'src/parts/Footer'

import Context from '../Context'
import orders from 'src/constants/api/orders';
import whatsapp from 'src/constants/api/whatsapp';
import { route } from 'next/dist/next-server/server/router';

import Localization from 'src/configs/lang/shop';
import { getCurrentLang, setCurrentLang } from 'src/helpers/localization';

export default function Shop({ shopDetails }) {
   const router = useRouter()

   const [data, setData, updateData] = useForm({
      name: '',
      phoneNumber: '',
      productsOrdered: {},
   })

   const [status, setStatus, checkStatus] = useStatus({
      name: 0,
      phoneNumber: 0,
      productsOrdered: 0,
   })

   const [statusOrder, setStatusOrder] = useState({
      isCreateOrder: false,
      isCreateOrderViaWA: false
   })

   const [locale, setLocale] = React.useState('en');

   const lang = Localization[locale];

   const fnChange = React.useCallback(
      (event) => {
         event.persist && event.persist()
         setData(event)

         setStatus(event)
      },
      [setData, setStatus]
   )

   function onSubmit(e) {
      e.preventDefault()

   }
   const fnCreateOrder= React.useCallback((isViaWA) => {
      const { name, phoneNumber, productsOrdered } = data;
      let product_ordered = Object.values(productsOrdered);

      setStatusOrder((prevState) => ({
         ...prevState,
         isCreateOrder: !isViaWA,
         isCreateOrderViaWA: isViaWA,
      }))

      facebookPixel.initiateCheckout();

      orders.create({
         checkout_platform: 'avalite',
         customer_address1: '',
         customer_address2: '',
         customer_city: '',
         customer_country: '',
         customer_email: '',
         customer_name: name,
         customer_phone: phoneNumber,
         customer_postcode: '',
         customer_state: '',
         order_status_id: 0,
         payment_method: '',
         payment_proof: '',
         product_ordered: product_ordered
      })
         .then(async (res) => {
            mixpanel.track('Order Form', {
               Products: product_ordered.map((product) => ({
                  'Product Name': `${product.name} ${
                     product.variation ? ` (${product.variation}) ` : ''
                  }`,
                  'Product Quantity': product.quantity,
               })),
               'Checkout Platform': isViaWA ? 'Whatsapp' : 'Buy Now',
               'Cart Size (Quantity)': product_ordered.reduce(
                  (acc, current) => acc + Number(current.quantity),
                  0
               ),
               'Cart Volume': product_ordered.reduce(
                  (acc, current) => acc + Number(current.price),
                  0
               ),
               Shop: shopDetails.details.shop_info.shop_name,
            });
            mixpanel.people.set({
               $name: name,
               $phone: phoneNumber,
            });

            let urlRedirect = `/${router?.query?.shop}/${btoa(btoa(res.order_id))}`
            if (isViaWA) {
               let messages = 'Hello shop';
               const waPhoneNumber = await whatsapp.whatsappRotator({
                     phone_number: phoneNumber
                  })
                     .then(({whatsapp}) => {
                        return whatsapp.phone_no
                     });

               urlRedirect = mobileTabletCheck()
                  ? `whatsapp://send?phone=${waPhoneNumber}&text=${messages}`
                  : `https://web.whatsapp.com/send?phone=${waPhoneNumber}&text=${messages}`;
                  urlRedirect
            }
            
            window.location = urlRedirect;
            // router.push(urlRedirect);
         })
   }, [data]);

   const fnInitDefaultPhoneNumber = React.useCallback(() => {
      const lang = window?.navigator?.language.split('-')[0] || 'my'
      const countryCode = { id: '+62', my: '+60', sg: '+65' }
      setData({
         target: {
            name: 'phoneNumber',
            value: countryCode[lang],
         },
      })
   }, [])

   const fnSelectLocale = React.useCallback((lang) => {
      setLocale(lang);
      setCurrentLang(lang);
   }, [setLocale, setCurrentLang]);

   React.useEffect(() => {
      STORAGE.set('token', shopDetails.token)
      STORAGE.set('details', shopDetails.details)
      fnSelectLocale(getCurrentLang());
      // fnInitDefaultPhoneNumber()
   }, [fnSelectLocale])

   React.useEffect(() => {
      facebookPixel.pageView();
   }, []);

   // React.useEffect(() => {
   //    console.log(router)

   //    clearTimeout(timeOutSearch)
   //    timeOutSearch = setTimeout(() => {
   //       router.push(`${router.asPath}${search}`)
   //    }, 300)
   // }, [])

   // BUILD CONTEXT FOR EASY PASSING METHOD OR STATE
   const CONTEXT = {
      data,
      locale,
      // fnSelectProduct: fnSelectProduct,
   }

   // console.log(data)

   return (
      <div
         className="mx-auto min-h-screen flex flex-col"
         style={{ minWidth: 300, maxWidth: 375}}
      >
         <Header data={shopDetails.details.shop_info} />
         <Context.Provider value={CONTEXT}>
            <CustomerInformation
               lang={lang}
               defualtCountry={shopDetails.details.country.iso_code.toLowerCase()}
               data={data}
               fnChange={fnChange}
               status={status}
            />
            <ProductSelection
               productsOrdered={data.productsOrdered}
               fnChange={fnChange}
            />
            <Checkout
               lang={lang}
               data={data}
               status={status}
               statusOrder={statusOrder}
               fnCreateOrder={fnCreateOrder}
            />
         </Context.Provider>
         <Footer fnSelectLocale={fnSelectLocale} />
      </div>
   )
}
