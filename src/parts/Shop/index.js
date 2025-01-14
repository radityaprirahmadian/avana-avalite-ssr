import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import mixpanel from 'mixpanel-browser';

import STORAGE from 'src/helpers/localStorage'
import mobileTabletCheck from 'src/helpers/mobileTabletCheck';
import { initiateCheckout as fbInitiateCheckout, pageView as fbPageView} from 'src/helpers/analytics/facebookPixel';

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
import shops from 'src/constants/api/shops';

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

   const [loadingData, setLoadingData] = useState({
      whitelist: false,
   });

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
   
   const [whitelistFeatures, setWhitelistFeature] = useState({});

   const lang = Localization[locale];

   const fnChange = React.useCallback(
      (event) => {
         event.persist && event.persist()
         setData(event)

         setStatus(event)
      },
      [setData, setStatus]
   )

   const handleRedirectAnalyticsOrder = useCallback(
      async ({
         product_ordered,
         order_id,
         isViaWA,
         waRotatorId,
      }) => {
         const { name, phoneNumber } = data;
         const catalogWhitelist = whitelistFeatures?.['catalog_wacommerce'];
         let urlRedirect = `/${router?.query?.shop}/${btoa(btoa(order_id))}`;
         if (isViaWA) {
            const products = product_ordered
               .map(
                  (product, idx) =>
                     `${idx + 1}. ${product.name}${
                        product.variation ? ` (${product.variation}) ` : ' '
                     }${catalogWhitelist
                        ? "\n"
                        : `*x ${product.quantity}*\n`
                     }`
               )
               .join('');
            let messages = encodeURIComponent(writeLocalization(
               lang?.text__whatsapp_order_message || `Hi [0], I'm [1].\n\nI'm interested to order[2].[3]`,
               [
                  shopDetails.details.shop_info.shop_name,
                  name,
                  products.length
                     ? `:\n${products}`
                     : "",
                  catalogWhitelist
                     ? ""
                     : `\n${lang?.text__whatsapp_order_link || "Order link: "} ${window.location.origin}${urlRedirect}`
               ]
            ).join(''));
            const waPhoneNumber = await whatsapp.whatsappRotator({
                  phone_number: phoneNumber,
                  ...(waRotatorId ? {whatsapp_info_id: waRotatorId} : {})
               }).then(({whatsapp}) => {
                  return whatsapp.phone_no
               }).catch(() => {return shopDetails.details.whatsapp_no?.split('+')?.pop()});

            urlRedirect = mobileTabletCheck()
               ? `whatsapp://send?phone=${waPhoneNumber}&text=${messages}`
               : `https://web.whatsapp.com/send?phone=${waPhoneNumber}&text=${messages}`;
            setRedirectUrl(urlRedirect);
            fnAnalyticsOrderCreated(order_id).finally(() => {
               if (refRedirect.current) {
                  refRedirect.current.click();
               } else {
                  window.open(urlRedirect, '_blank');
               }
            })
         } else {
            fnAnalyticsOrderCreated(order_id).finally(() => {
               window.location = urlRedirect;
            })
         }
         setStatusOrder((prevState) => ({
            ...prevState,
            // isCreateOrder: false,
            isCreateOrderViaWA: false,
         }))
      }
   );

   const fnCreateOrder= React.useCallback((isViaWA) => {
      const { name, phoneNumber, productsOrdered } = data;
      const { details: waNumberDetails, mixpanelWhatsappInfo } = waRotatorData;
      const waRotatorId = waNumberDetails.whatsapp_info_id;
      const catalogWhitelist = whitelistFeatures?.['catalog_wacommerce'];
      let product_ordered = Object.values(productsOrdered);

      setStatusOrder((prevState) => ({
         ...prevState,
         isCreateOrder: !isViaWA,
         isCreateOrderViaWA: isViaWA,
      }))

      fbInitiateCheckout();
      if (catalogWhitelist) {
         handleRedirectAnalyticsOrder({
            product_ordered,
            isViaWA,
            order_id: null,
            waRotatorId: waRotatorId,
         })
      } else
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
         product_ordered: product_ordered,
         whatsapp_info_id: waRotatorId,
      })
         .then(async (res) => {
            const { details: shop } = shopDetails;
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

            handleRedirectAnalyticsOrder({
               product_ordered: product_ordered,
               order_id: res.order_id,
               isViaWA: isViaWA,
               waRotatorId: waRotatorId,
            })
            // router.push(urlRedirect);
         }).catch(() => {
            setStatusOrder((prevState) => ({
               ...prevState,
               // isCreateOrder: false,
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

   const fnWhitelistFeatures = () => {
      setLoadingData((prevState) => ({
         ...prevState,
         whitelist: true
      }))
      shops.whitelist()
         .then((data) => {
            setWhitelistFeature((data || [])?.reduce((a, b) => {
               a[b["code"]] = b;
               return a;
             }, {})
            );
         })
         .finally(() => {
            setLoadingData((prevState) => ({
               ...prevState,
               whitelist: false
            }))
         })
   }

   const fnSelectLocale = React.useCallback((selectedLang) => {
      setLocale(selectedLang);
      setCurrentLang(selectedLang);
   }, [setLocale, setCurrentLang]);

   React.useEffect(() => {
      STORAGE.set('token', shopDetails.token)
      STORAGE.set('details', shopDetails.details)
      const locale = getCurrentLang(shopDetails.details.country.iso_code.toLowerCase());
      fnSelectLocale(locale);
   }, [fnSelectLocale])

   React.useEffect(() => {
      fnWhitelistFeatures();
      fbPageView();
      fnTrackVisit();
   }, []);

   // BUILD CONTEXT FOR EASY PASSING METHOD OR STATE
   const CONTEXT = {
      data,
      locale,
      whitelistFeatures,
      isLoadingData: Object.values(loadingData).every(item => item),
   }

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
                  whitelistFeatures={whitelistFeatures}
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
               CheckoutComponent={
                  <Checkout
                     lang={lang}
                     data={data}
                     status={status}
                     statusOrder={statusOrder}
                     fnCreateOrder={fnCreateOrder}
                  />
               }
               fnChange={fnChange}
               fnSetProductDetails={setProductDetails}
            />
            {(!productDetails.isViewProductDetail && !productDetails.isViewProductVariant) && (
               <div className="text-xs text-center py-2 sticky bottom-0 bg-white z-20">
                  <Checkout
                     lang={lang}
                     data={data}
                     status={status}
                     statusOrder={statusOrder}
                     fnCreateOrder={fnCreateOrder}
                  />
                  <Footer
                     fnSelectLocale={fnSelectLocale}
                     lang={lang}
                     loading={loadingData}
                     whitelistFeature={whitelistFeatures}
                  />
               </div>
            )}
            <a
               ref={refRedirect}
               href={redirectUrl || '#'}
               rel="nofollow noopener noreferrer"
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
