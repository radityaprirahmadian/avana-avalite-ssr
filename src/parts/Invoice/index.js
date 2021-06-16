import React from 'react';
import mixpanel from 'mixpanel-browser';

import Header from './Header';
import Spinner from 'src/components/Spinner';
import ErrorWrapper from 'src/components/ErrorsWrapper';

import InvoiceContent from './InvoiceContent';
import StepAction from './StepAction';
import FinishOrder from './InvoiceContent/FinishOrder';
import EditProducts from './InvoiceContent/EditProducts';

import useForm from 'src/helpers/customHooks/useForm';
import useStatus from 'src/helpers/customHooks/useStatus';
import facebookPixel from 'src/helpers/analytics/facebookPixel';

import orders from 'src/constants/api/orders';
import shipping from 'src/constants/api/shipping';

import Context from 'src/parts/Context';

import Localization from 'src/configs/lang/invoice';
import { getCurrentLang, setCurrentLang } from 'src/helpers/localization';
import calculateHourFromNow from 'src/helpers/calculateHourFromNow';

let isSyncTotal = null;
let timeoutRedirect = null;

export default function Invoice({ shopDetails, orderToken }) {
   const [locale, setLocale] = React.useState('en');
   const lang = Localization[locale];
   const [error, setError] = React.useState({});
   const [formInfoData, setFormInfoData, updateFormInfoData] = useForm({
      name: '',
      phoneNumber: '',
      email: '',
      address1: '',
      address2: '',
      country: null,
      state: null,
      city: null,
      postcode: '',
   })
   const [formInfoStatus, setFormInfoStatus, checkFormInfoStatus, updateFormInfoStatus] = useStatus({
      name: 0,
      phoneNumber: 0,
      email: 0,
      address1: 0,
      country: 0,
      state: 0,
      city: 0,
      postcode: 0,
   });
   const [step, setStep] = React.useState({
      current: 1,
      previous: 1,
   });
   const [meta, setMeta] = React.useState({});
   const [orderDetails, setOrderDetails] = React.useState({
      orderNumber: '',
      coupon: {},
      currencyCode: '',
      paymentMethod: '',
      shippingMethod: '',
      paymentUrl: '',
      locationAddress: '',
      isAbleSelfPickup: false,
      isShippingSelfPickup: false
   });
   const [productsOrdered, setProductsOrdered] = React.useState({});
   const [additionalInfoForm, setAdditionalInfoForm] = React.useState({});
   const [pricingCharge, setPricingCharge] = React.useState({
      totalTax: 0,
      totalPrice: 0,
      subTotal: 0,
      discount: 0,
      insuranceRate: 0,
      totalShipping: 0,
      isCalculating: false,
   });

   const [statusState, setStatusState] = React.useState({
      isLoadingPage: true,
      isProcessOrder: false,
      isOrderComplete: false,
      isShowRedirect: false,
      isEditOrder: false,
      isProductsEdited: false,
      isConfirmPrivacyPolicy: false,
   });

   const fnChange = React.useCallback(
      (event) => {
         event.persist && event.persist()
         const checkExistPatternUnvalid = !!event.target?.pattern && !event.target?.validity?.valid
         if (checkExistPatternUnvalid && event.target.value !== '') {
            return;
         }
         setFormInfoData(event)

         setFormInfoStatus(event)
      },
      [setFormInfoData, setFormInfoStatus]
   );

   const fnSyncTotalPayment =  React.useCallback(
      () => {
         if (isSyncTotal) {
            clearTimeout(isSyncTotal);
         }
         const discountActive = true;
         const products = Object.values(productsOrdered);
         const subTotal = products.reduce(
            (acc, { price, quantity }) => acc + price * quantity,
            0
         );
         const totalTax = products.reduce(
            (acc, { price, quantity, tax }) => acc + ((price * quantity) / 100) * tax,
            0
         );
      
         const totalPrice = subTotal + totalTax;
         setPricingCharge((prevState) => ({
            ...prevState,
            isCalculating: true,
         }));
         if (meta.shippable_countries == null) {
            setPricingCharge((prevState) => ({
               ...prevState,
               totalTax: totalTax,
               totalPrice: totalPrice,
               subTotal: subTotal,
               discount: 0,
               isCalculating: false,
            }));
         } else if (orderDetails.shippingMethod === 'shipper' && !orderDetails.isShippingSelfPickup) {
            isSyncTotal = setTimeout(() => {
               shipping.getServices({
                  params: {
                     courier_name: formInfoData.shippingCourierName,
                     city: formInfoData.city,
                     weight: products.reduce(
                        (acc, current) => acc + current.quantity * current.weight,
                        0
                     ),
                     total_product: totalPrice,
                     ...((formInfoData.lat && formInfoData.lng)
                        ? {
                           customer_long: formInfoData.lng,
                           customer_lat: formInfoData.lat
                        }
                        : {}
                     )
                  }
               }).then((res) => {
                  const service = res.data.find(
                     (service) =>
                        service.rate_id === Number(formInfoData.shipperRateId)
                  );
                  const insuranceRate =
                     Number(formInfoData.shipperUseInsurance) === 1
                        ? service.insuranceRate
                        : 0;

                  const discount = Number(formInfoData.country) === 100 &&
                     formInfoData.shippingCourierName === 'JNE' &&
                     subTotal > 50000 &&
                     discountActive
                        ? service.finalRate < 10000
                           ? service.finalRate
                           : 10000
                        : 0;
                  
                  setPricingCharge((prevState) => ({
                     ...prevState,
                     totalTax: totalTax,
                     subTotal: subTotal,
                     insuranceRate: insuranceRate,
                     discount: discount,
                     totalPrice: totalPrice + insuranceRate + service.finalRate - discount,
                     totalShipping: service.finalRate,
                     isCalculating: false,
                  }));
               })
            }, 1500)
         } else {
            isSyncTotal = setTimeout(() => {
               shipping.getRate({
                  params: {
                     country_id: formInfoData.country,
                     state_id: formInfoData.state,
                     city: formInfoData.city,
                     total_quantity: products.reduce(
                       (acc, current) => acc + current.quantity,
                       0
                     ),
                     total_weight: products.reduce(
                        (acc, current) => acc + current.quantity * current.weight,
                        0
                     ),
                     subtotal: subTotal,
                     is_self_pickup: Number(orderDetails.isShippingSelfPickup)
                   },
               }).then((res) => {
                  const discount = formInfoData.country === 100 &&
                     subTotal > 50000 &&
                     discountActive
                        ? res.shipping_rate < 10000
                           ? res.shipping_rate
                           : 10000
                        : 0;

                  setPricingCharge((prevState) => ({
                     ...prevState,
                     totalTax: totalTax,
                     subTotal: subTotal,
                     discount: discount,
                     totalPrice: totalPrice + res.shipping_rate - discount,
                     totalShipping: res.shipping_rate,
                     isCalculating: false,
                  }));
               });
            }, 1500)
         }
      },
      [setPricingCharge, shipping, formInfoData, meta, orderDetails, productsOrdered]
   );

   const fnNextStep = React.useCallback(
      () => {
         if (step.current === 1) {
            fnSyncTotalPayment();
         }
         setStep((prev) => ({
            current: prev.current + 1 <= 4 ? prev.current + 1 : prev.current,
            previous: prev.current
         }));
      },
      [step.current, setStep, fnSyncTotalPayment]
   );

   const fnPrevStep = React.useCallback(
      () => {
         setStep((prev) => ({
            current: prev.current - 1 >= 1 ? prev.current - 1 : prev.current,
            previous: prev.current
         }));
      },
      [setStep]
   );

   const fnGetOrderDetails = React.useCallback(
      () => {
         const orderId = atob(atob(orderToken))
         return orders.details({ orderId });
      },
      [orders]
   );

   const fnGetOrderMeta = React.useCallback(
      () => {
         return orders.meta();
      },
      [orders]
   );

   const fnSelectLocale = React.useCallback((lang) => {
      setLocale(lang);
      setCurrentLang(lang);
   }, [setLocale, setCurrentLang]);

   React.useEffect(
      () => {
         Promise.all([
            fnGetOrderDetails(),
            fnGetOrderMeta(),
         ])
            .then(([order, meta]) => {
               if (order.order_status === 'cancelled') {
                  const checkStatusExpired = (order.order_status === 'cancelled' &&
                     calculateHourFromNow(new Date(order.order_date)) > 24
                  )
                  setError({
                     title: `Order ${checkStatusExpired ? 'Expired' : 'Cancelled'}`,
                     message: `Opps, your order has been ${checkStatusExpired ? 'expired' : 'cancelled'}`,
                     action: {
                        to: `/${shopDetails?.details?.shop_info?.slug}`,
                        label: `Order Again`
                     }
                  })
                  return;
               }
               setMeta(meta);
               setOrderDetails((prevState) => ({
                  ...prevState,
                  orderNumber: order.order_no,
                  currencyCode: order.currency_code
               }));
               const noShippingPass = [
                  'customer_address1',
                  'customer_country',
                  'customer_city',
                  'customer_state',
                  'customer_postcode'
               ];
               const optional = [
                  'customer_address2',
                  'customer_lat',
                  'customer_long'
               ];
               let initStatus = {};
               const additionalInfo = order.checkout_additional_info
               Object.entries(order)
                  .filter(([key]) => key.match(/^customer*_(?!.*_)/))
                  .filter(([key]) => !optional.includes(key))
                  .map(([key, value]) => (
                    initStatus[key] = meta.shippable_countries == null && noShippingPass.includes(key)
                      ? 4 : value
                      ? 3 : 0
                    )
                  );
               let customFieldStatus = {};

               additionalInfo
                  .filter((field) => additionalInfo[
                     additionalInfo.findIndex(adInfo => 
                           field.checkout_custom_field_id === adInfo.checkout_custom_field_id
                        )
                     ]?.is_required
                  )
                  .map((field) => (
                     customFieldStatus[`custom_${field.checkout_custom_field_id}`] = field.answer
                        ? 3 : 0
                     )
                  );

               updateFormInfoData({
                  name: order.customer_name,
                  phoneNumber: order.customer_phone,
                  email: order.customer_email,
                  address1: order.customer_address1,
                  address2: order.customer_address2,
                  country: order.customer_country_id
                     ? Number(order.customer_country_id)
                     : shopDetails.details?.country?.id,
                  state: order.customer_state_id
                     ? Number(order.customer_state_id)
                     : '',
                  city: order.customer_city,
                  postcode: order.customer_postcode,
                  ...order.checkout_additional_info.reduce((accumulator, adInfo) => {
                     return {
                       ...accumulator,
                       [`custom_${adInfo.checkout_custom_field_id}`]: order.order_custom_field?.[
                              order.order_custom_field.findIndex(field => 
                                 field.checkout_custom_field_id === adInfo.checkout_custom_field_id
                              )
                           ]?.answer ?? ''
                     }
                   }, {})
               });

               setAdditionalInfoForm(order.checkout_additional_info);

               updateFormInfoStatus({
                  name: initStatus.customer_name,
                  phoneNumber: initStatus.customer_phone,
                  email: initStatus.customer_email,
                  address1: initStatus.customer_address1,
                  country: 3,
                  state: initStatus.customer_state,
                  city: initStatus.customer_city,
                  postcode: initStatus.customer_postcode,
                  ...customFieldStatus
               });
               
               setProductsOrdered(order?.order_product?.reduce((productsOrdered, product) => {
                     const productKey = product.product_option_value_id ?
                        `${product.product_id}_${product.product_option_value_id}` :
                        product.product_id;
                     return {
                        ...productsOrdered,
                        [productKey]: {
                           product_id: product.product_id,
                           name: product.product_name,
                           image: product.product_image,
                           quantity: product.qty,
                           price: product.price,
                           tax: product.tax_value,
                           weight: product.weight,
                           variation: product.product_option_value
                              ? product.product_option_value
                              : null,
                           variation_option_id: product.product_option_value_id
                              ? product.product_option_value_id
                              : null
                        }
                     }
                  }, {})
               );
               setStatusState((prevState) => ({
                  ...prevState,
                  isLoadingPage: false
               }))
            })
      },
      []
   );

   React.useEffect(
      () => {
         if (statusState.isProductsEdited) {
            fnSyncTotalPayment();
            setStatusState((prevState) => ({
               ...prevState,
               isProductsEdited: false
            }))
         }
      },
      [productsOrdered, statusState.isProductsEdited]
   )

   React.useEffect(() => {
      fnSelectLocale(getCurrentLang());
   }, [fnSelectLocale])

   React.useEffect(
      () => {
         if ((step.previous === 1 && step.current === 2) &&
            (pricingCharge.isCalculating === false && pricingCharge.subTotal > 0)
         ) {
            facebookPixel.addPaymentInfo(Number(pricingCharge.subTotal), orderDetails.currencyCode);
         }
      },
      [step.current, pricingCharge.subTotal, pricingCharge.isCalculating, orderDetails.currencyCode]
   )

   React.useEffect(() => {
      facebookPixel.pageView();
   }, []);

   const fnProcessOrder = React.useCallback(
      () => {
         const shipperPayload = (orderDetails.shippingMethod === 'shipper' ||
            !orderDetails.isShippingSelfPickup ? {
               shipper_courier_name: formInfoData.shippingCourierName,
               shipper_rate_id: Number(formInfoData.shipperRateId),
               shipper_use_insurance: formInfoData.shipperUseInsurance || '0',
            } : {});
         
         const orderCustomField = Object.values(additionalInfoForm)
            .filter(({checkout_custom_field_id}) => !!formInfoData[`custom_${checkout_custom_field_id}`])
            .map(({checkout_custom_field_id}) => ({
               checkout_custom_field_id,
               answer: formInfoData[`custom_${checkout_custom_field_id}`]
            }));

         setStatusState((prevState) => ({
            ...prevState,
            isProcessOrder: true
         }))

         orders
            .update(atob(atob(orderToken)), {
               customer_name: formInfoData.name,
               customer_email: formInfoData.email,
               customer_phone: formInfoData.phoneNumber,
               customer_address1: formInfoData.address1,
               customer_address2: formInfoData.address2,
               customer_country: Number(formInfoData.country),
               customer_state: Number(formInfoData.state),
               customer_city: formInfoData.city,
               customer_postcode: formInfoData.postcode,
               customer_lat: formInfoData.lat || '',
               customer_long: formInfoData.lng || '',
               payment_proof: '',
               order_custom_field: orderCustomField, 
               coupon_code: orderDetails.coupon?.couponCode || '',
               order_no: orderDetails.orderNumber,
               currency_code: orderDetails.currencyCode,
               payment_method: orderDetails.paymentMethod,
               product_ordered: Object.values(productsOrdered),
               shipping_method: orderDetails.shippingMethod,
               ...shipperPayload,
               order_product: Object.values(productsOrdered),
               sub_total: pricingCharge.subTotal,
               order_subtotal: pricingCharge.subTotal,
               total_shipping: pricingCharge.totalShipping - pricingCharge.discount,
               total_price: orderDetails.shippingMethod === 'shipper' ? pricingCharge.totalPrice : 0,
            })
            .then(async (res) => {
               mixpanel.track('Checkout Form', {
                  'Order No': res.order_no,
                  'Order Date': res.order_date,
                  'Order Status': res.order_status,
                  'Customer Name': res.customer_name,
                  'Customer Email': res.customer_email,
                  'Customer Phone': res.customer_phone,
                  'Customer City': res.customer_city,
                  'Customer State': res.customer_state,
                  'Customer Country': res.customer_country,
                  'Payment Method': res.payment_method,
                  'Shipping Method': res.shipping_method,
                  'Order Product Total': res.order_product_total,
                  'Order Product': res.order_product,
                  'Total Weight': res.total_weight,
                  'Subtotal': res.order_subtotal,
                  'Total Tax': res.total_tax,
                  'Total Shipping': res.total_shipping,
                  'Total Price': res.total_price,
                  'Total Coupon': res.total_coupon,
                  'Checkout Platform': res.checkout_platform,
               });
               await setStatusState((prevState) => ({
                  ...prevState,
                  isProcessOrder: false,
                  isOrderComplete: true,
               }))
               await setOrderDetails((prevState) => ({
                  ...prevState,
                  paymentUrl: res.pay_url
               }))
               timeoutRedirect = setTimeout(
                  () => {
                     setStatusState((prevState) => ({
                        ...prevState,
                        isShowRedirect: true,
                     }));
                  },
                  1000
               )

               if (res.payment_method.toLowerCase().indexOf('manual') === -1) {
                  let uagent = navigator.userAgent.toLowerCase();
                  // if (/safari/.test(uagent) || !/chrome/.test(uagent)) {
                  window.location.href = res.pay_url;
                  // } else {
                  //    this.paymentRef.current.click();
                  // }
               }
            })
            .catch(async (error) => {
               let checkErrCoupon = false;
               // if ((typeof error?.message === 'object' && !!error?.message?.coupon_code) || (error?.message?.includes('coupon'))) {
               //    checkErrCoupon = true;
               //    this._removeCoupon({ error: error.message });
               // }
               // await this.setState((prevState) => ({
               //    status: {
               //       ...prevState.status,
               //       isProcessOrder: false,
               //    },
               //    stepper: {
               //       ...prevState.stepper,
               //       currentStep: checkErrCoupon ? 2 : 3,
               //    },
               //    isErrorToast: true,
               //    error
               //    }));
            });
      },
      [formInfoData, orderDetails, pricingCharge]
   )
   
   const CONTEXT = {
      shop: shopDetails.details,
      locale: locale,
      setPricingCharge: setPricingCharge,
   }

   return (
      <div>
         <div
            className={`mx-auto min-h-screen flex flex-col ${step.current === 4 && 'justify-center'}`}
            style={{ minWidth: 300, maxWidth: 375 }}
         >
            <Context.Provider value={CONTEXT}>
            {
               Object.keys(error).length > 0 ? (
                  <ErrorWrapper error={error} />
               ) :
                  statusState.isOrderComplete ? (
                     <div className="flex flex-1 align-center">
                        <FinishOrder
                           lang={lang}
                           statusState={statusState}
                           orderDetails={orderDetails}
                        />
                     </div>
               ) :
                  statusState.isEditOrder ? (
                     <EditProducts
                        lang={lang}
                        productsOrdered={productsOrdered}
                        setStatusState={setStatusState}
                        setProductsOrdered={setProductsOrdered}
                        fnSyncTotalPayment={fnSyncTotalPayment}
                     />
                  ) :
                  (<>
                     <Header
                        lang={lang}
                        currentStep={step.current}
                        data={shopDetails.details.shop_info}
                     />
                        <div className="flex flex-1 flex-col my-4">
                           {statusState.isLoadingPage ?
                              (
                                 <Spinner />
                              ) :
                              (
                                 <InvoiceContent
                                    formInfoData={formInfoData}
                                    orderDetails={orderDetails}
                                    productsOrdered={productsOrdered}
                                    additionalInfoForm={additionalInfoForm}
                                    pricingCharge={pricingCharge}
                                    meta={meta}
                                    formInfoStatus={formInfoStatus}
                                    currentStep={step.current}
                                    updateFormInfoData={updateFormInfoData}
                                    updateFormInfoStatus={updateFormInfoStatus}
                                    fnChange={fnChange}
                                    fnSyncTotalPayment={fnSyncTotalPayment}
                                    fnUpdateOrderDetails={setOrderDetails}
                                 />
                              )
                           }
                        </div>
                     <StepAction
                        lang={lang}
                        formInfoStatus={formInfoStatus}
                        orderDetails={orderDetails}
                        currentStep={step.current}
                        statusState={statusState}
                        productsOrdered={productsOrdered}
                        pricingCharge={pricingCharge}
                        setStatusState={setStatusState}
                        fnProcessOrder={fnProcessOrder}
                        fnNextStep={fnNextStep}
                        fnPrevStep={fnPrevStep}
                     />
                  </>)
            }
            </Context.Provider>
         </div>
      </div>
   )
}