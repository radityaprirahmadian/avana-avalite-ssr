import React, { useState, useRef } from 'react';
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
   const refRedirect = useRef()
   const [redirectUrl, setRedirectUrl] = useState('');

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

   const [waRotatorData, setWaRotatorData] = useState({
      details: {},
      mixpanelWhatsappInfo: {}
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
            const { details: shop } = shopDetails;
            const { details: waNumberDetails, mixpanelWhatsappInfo } = waRotatorData;
            const waRotatorId = waNumberDetails.whatsapp_info_id;
            mixpanel.track('Order Form', {
               'Order ID': res.order_id,
               'Order No': res.order_no,
               'Shop': shop.shop_info.shop_name,
               'Shop ID': shop.id,
               'Shop Category': shop?.shop_category?.category_name || '-',
               'Order Date': res.order_date,
               'Order Status': res.order_status,
               'Order Status ID': res.order_status_id,
               'Currency Code': res.currency_code,
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
               ...mixpanelWhatsappInfo
            });
            mixpanel.people.set({
               $name: name,
               $phone: phoneNumber,
            });

            let urlRedirect = `/${router?.query?.shop}/${btoa(btoa(res.order_id))}`;
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
               setRedirectUrl(urlRedirect);
               fnAnalyticsOrderCreated(res.order_id).finally(() => {
                  if (refRedirect.current) {
                     refRedirect.current.click();
                  } else {
                     window.open(urlRedirect, '_blank');
                  }
               })
            } else {
               fnAnalyticsOrderCreated(res.order_id).finally(() => {
                  window.location = urlRedirect;
               })
            }
            // router.push(urlRedirect);
         }).catch(() => {
            setStatusOrder((prevState) => ({
               ...prevState,
               isCreateOrder: false,
               isCreateOrderViaWA: false,
            }))
         })
   }, [data]);

   const fnTrackVisit = React.useCallback(async () => {
      const { waId, details: shop } = shopDetails;
      const waRotatorId = waId ? Number((() => {
         try {
           return atob(waId)
         } catch {
           return undefined
         }
       })()) : undefined;
      let mixpanelWhatsappInfo = {};
      if (waRotatorId) {
         const whatsappData = await whatsapp.whatsappNumberList()
            .then((data) => {
               return data?.find((wa) => wa.whatsapp_info_id === waRotatorId)
            });
         mixpanelWhatsappInfo = {
            'WhatsApp Info ID': whatsappData?.whatsapp_info_id,
            'WhatsApp CS Name': whatsappData?.customer_service_name,
            'WhatsApp CS Number': whatsappData?.phone_no,
         }
         setWaRotatorData((prev) => ({
            ...prev,
            details: whatsappData,
            mixpanelWhatsappInfo,
         }))
      }
      mixpanel.track('Visit', {
         'Shop': shop.shop_info.shop_name,
         'Shop ID': shop.id,
         'Shop Category': shop?.shop_category?.category_name || '-',
         ...(mixpanelWhatsappInfo)
      });
      fnAnalyticsPageView(waRotatorId);
   }, []);

   const fnAnalyticsPageView = (id) => {
      const { details: waNumberDetails } = waRotatorData;
      const rotatorId = (id || waNumberDetails?.whatsapp_info_id || undefined);
      whatsapp.analytics({
         'type': 'page_views',
         'whatsapp_info_id': rotatorId,
         'meta_data': {
            user_agent: navigator.userAgent,
         }
      })
   }

   const fnAnalyticsOrderCreated = (order_id) => {
      const { details: waNumberDetails } = waRotatorData;
      const rotatorId = (waNumberDetails?.whatsapp_info_id || undefined);
  
      return whatsapp.analytics({
        'type': 'created_order',
        'whatsapp_info_id': rotatorId,
        'meta_data': {
          order_id: order_id,
          user_agent: navigator.userAgent,
        }
      });
    }

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
      fnTrackVisit();
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
            <a
               ref={refRedirect}
               href={redirectUrl}
               rel="noopener noreferrer"
               className="hidden"
               style={{ display: 'none' }}
               target={mobileTabletCheck() ? '_self' : '_blank'}
            >
               redirect link
            </a>
         </Context.Provider>
      </div>
   )
}
