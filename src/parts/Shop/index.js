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

import Localization from 'src/configs/lang/shop';
import { getCurrentLang, setCurrentLang } from 'src/helpers/localization';
import writeLocalization from 'src/helpers/localization'

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

   const [productDetails, setProductDetails] = useState({
      id: null,
      isViewProductDetail: false,
      isViewProductVariant: false,
   })

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
      const { search } = location;
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
            const waRotatorId = search && Number(() => {
               try {
                 return atob(new URLSearchParams(search).get("wa"))
               } catch {
                 return 0
               }
             });

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
            setStatusOrder((prevState) => ({
               ...prevState,
               isCreateOrder: false,
               isCreateOrderViaWA: false,
            }))

            let urlRedirect = `/${router?.query?.shop}/${btoa(btoa(res.order_id))}`
            if (isViaWA) {
               const products = product_ordered
                  .map(
                  (product, idx) =>
                     `${idx + 1}. ${product.name}${
                        product.variation ? ` (${product.variation}) ` : ' '
                     }*x ${product.quantity}*\n`
                  )
                  .join(''); 
               let messages = encodeURIComponent(writeLocalization(
                  lang?.text__whatsapp_order_message || `Hi [0], I'm [1].\n\nI'm interested to order :\n[2].\nOrder link : [3]`,
                  [shopDetails.details.shop_info.shop_name, name, products, `${window.location.origin}${urlRedirect}`]
               ).join(''));
               const waPhoneNumber = await whatsapp.whatsappRotator({
                     phone_number: phoneNumber,
                     ...(waRotatorId ? {whatsapp_info_id: waRotatorId} : {})
                  }).then(({whatsapp}) => {
                     return whatsapp.phone_no
                  }).catch(() => {}) || shopDetails.details.whatsapp_no?.split('+')?.pop();;

               urlRedirect = mobileTabletCheck()
                  ? `whatsapp://send?phone=${waPhoneNumber}&text=${messages}`
                  : `https://web.whatsapp.com/send?phone=${waPhoneNumber}&text=${messages}`;
                  urlRedirect
               window.open(urlRedirect, '_blank');
            } else {
               window.location = urlRedirect;
            }
            // router.push(urlRedirect);
         })
   }, [data]);

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
         {(!productDetails.isViewProductDetail && !productDetails.isViewProductVariant) && (
            <Header data={shopDetails.details.shop_info} lang={lang} />
         )}
         <Context.Provider value={CONTEXT}>
            {(!productDetails.isViewProductDetail && !productDetails.isViewProductVariant) && (
               <CustomerInformation
                  lang={lang}
                  defualtCountry={shopDetails.details.country.iso_code.toLowerCase()}
                  data={data}
                  fnChange={fnChange}
                  status={status}
               />
            )}
            <ProductSelection
               productsOrdered={data.productsOrdered}
               productDetails={productDetails}
               fnChange={fnChange}
               fnSetProductDetails={setProductDetails}
            />
            {(!productDetails.isViewProductDetail && !productDetails.isViewProductVariant) && (
               <div className="text-xs text-center py-2 sticky bottom-0 bg-white z-10">
                  <Checkout
                     lang={lang}
                     data={data}
                     status={status}
                     statusOrder={statusOrder}
                     fnCreateOrder={fnCreateOrder}
                  />
                  <Footer fnSelectLocale={fnSelectLocale} lang={lang} />
               </div>
            )}
         </Context.Provider>
      </div>
   )
}
