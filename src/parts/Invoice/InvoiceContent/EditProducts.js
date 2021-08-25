import React, { useState, useCallback, useEffect } from 'react';

import Button from 'src/components/Button';
import ProductSelection from 'src/parts/Shop/ProductSelection';
import { ArrowBack } from '@material-ui/icons';
import mixpanel from 'mixpanel-browser';

export default function EditProducts(props) {
  const [productsCart, setProductsCart] = useState(props.productsOrdered)
  const [productsBefore, _] = useState(props.productsOrdered)

  const [productDetails, setProductDetails] = useState({
    id: null,
    isViewProductDetail: false,
    isViewProductVariant: false,
 })
  
  const fnChangeProducts = useCallback(
    (e) => {
      e.persist && e.persist();

      setProductsCart(() => ({
        ...e.target.value
      }));
    },
    [setProductsCart]
  );

  const fnCloseEditOrder = useCallback(
    () => {
      const { shopDetails, formInfoData, additionalInfoForm, orderDetails } = props;
      mixpanel.track('Cancel Edit Order', {
        'Order ID': orderDetails.orderId,
        'Order No': orderDetails.orderNo,
        'Shop': shopDetails.shop_info.shop_name,
        'Shop ID': shopDetails.id,
        'Shop Category': shopDetails.shop_category.category_name,
        'Order Date': orderDetails.orderDate,
        'Order Status': orderDetails.orderStatus,
        'Order Status ID': orderDetails.orderStatusId,
        'Currency Code': orderDetails.currencyCode,
        'Customer Name': formInfoData.name,
        'Customer Email': formInfoData.email,
        'Customer Phone': formInfoData.phoneNumber,
        'Customer City': formInfoData.city,
        'Customer State': orderDetails.selectedState?.name,
        'Customer Country': orderDetails.selectedCountry?.name,
        'Customer Postcode': formInfoData.postcode,
        'Customer Longitude': formInfoData.lng,
        'Customer Latitude': formInfoData.lat,
        'Additional Info': additionalInfoForm,
        'Checkout Platform': 'avalite',
        Products: Object.values(props.productsOrdered)
          .map((product) => ({
            'Product Name': `${product.name} ${
              product.variation ? ` (${product.variation}) ` : ''
            }`,
            'Product Quantity': product.quantity,
          })),
        ...(orderDetails?.whatsappInfoData ? {
          'WhatsApp Info ID': orderDetails?.whatsappInfoData?.whatsapp_info_id,
          'WhatsApp CS Name': orderDetails?.whatsappInfoData?.customer_service_name,
          'WhatsApp CS Number': orderDetails?.whatsappInfoData?.phone_no,
        } : {})
      });
      props.setStatusState((prevState) => ({
        ...prevState,
        isProductsEdited: true,
        isEditOrder: false,
      }))
    },
    [props]
  );

  const fnConfirmEditProducts = useCallback(
    () => {
      mixpanel.track('Submit Edit Order', {
        'Order ID': orderDetails.orderId,
        'Order No': orderDetails.orderNo,
        'Shop': shopDetails.shop_info.shop_name,
        'Shop ID': shopDetails.id,
        'Shop Category': shopDetails.shop_category.category_name,
        'Order Date': orderDetails.orderDate,
        'Order Status': orderDetails.orderStatus,
        'Order Status ID': orderDetails.orderStatusId,
        'Currency Code': orderDetails.currencyCode,
        'Customer Name': formInfoData.name,
        'Customer Email': formInfoData.email,
        'Customer Phone': formInfoData.phoneNumber,
        'Customer City': formInfoData.city,
        'Customer State': orderDetails.selectedState?.name,
        'Customer Country': orderDetails.selectedCountry?.name,
        'Customer Postcode': formInfoData.postcode,
        'Customer Longitude': formInfoData.lng,
        'Customer Latitude': formInfoData.lat,
        'Additional Info': additionalInfoForm,
        'Checkout Platform': 'avalite',
        'Updated Products': Object.values(productsCart)
          .map((product) => ({
            'Product Name': `${product.name} ${
              product.variation ? ` (${product.variation}) ` : ''
            }`,
            'Product Quantity': product.quantity,
          })),
        'Former Products': Object.values(productsBefore)
          .map((product) => ({
            'Product Name': `${product.name} ${
              product.variation ? ` (${product.variation}) ` : ''
            }`,
            'Product Quantity': product.quantity,
          })),
        ...(orderDetails?.whatsappInfoData ? {
          'WhatsApp Info ID': orderDetails?.whatsappInfoData?.whatsapp_info_id,
          'WhatsApp CS Name': orderDetails?.whatsappInfoData?.customer_service_name,
          'WhatsApp CS Number': orderDetails?.whatsappInfoData?.phone_no,
        } : {})
      });
      props.setProductsOrdered(productsCart);
      props.fnSyncTotalPayment();
      fnCloseEditOrder();
    },
    [fnCloseEditOrder, props.setProductsOrdered, props.fnSyncTotalPayment, productsCart]
  );

  useEffect(() => {
    const { shopDetails, formInfoData, additionalInfoForm, orderDetails } = props;
    mixpanel.track('Edit Order', {
      'Order ID': orderDetails.orderId,
      'Order No': orderDetails.orderNo,
      'Shop': shopDetails.shop_info.shop_name,
      'Shop ID': shopDetails.id,
      'Shop Category': shopDetails.shop_category.category_name,
      'Order Date': orderDetails.orderDate,
      'Order Status': orderDetails.orderStatus,
      'Order Status ID': orderDetails.orderStatusId,
      'Currency Code': orderDetails.currencyCode,
      'Customer Name': formInfoData.name,
      'Customer Email': formInfoData.email,
      'Customer Phone': formInfoData.phoneNumber,
      'Customer City': formInfoData.city,
      'Customer State': orderDetails.selectedState?.name,
      'Customer Country': orderDetails.selectedCountry?.name,
      'Customer Postcode': formInfoData.postcode,
      'Customer Longitude': formInfoData.lng,
      'Customer Latitude': formInfoData.lat,
      'Additional Info': additionalInfoForm,
      'Checkout Platform': 'avalite',
      Products: Object.values(props.productsOrdered)
        .map((product) => ({
          'Product Name': `${product.name} ${
            product.variation ? ` (${product.variation}) ` : ''
          }`,
          'Product Quantity': product.quantity,
        })),
      ...(orderDetails?.whatsappInfoData ? {
        'WhatsApp Info ID': orderDetails?.whatsappInfoData?.whatsapp_info_id,
        'WhatsApp CS Name': orderDetails?.whatsappInfoData?.customer_service_name,
        'WhatsApp CS Number': orderDetails?.whatsappInfoData?.phone_no,
      } : {})
    });
  }, [])

  return (
    <section className="flex flex-1 flex-col">
      {(!productDetails.isViewProductDetail && !productDetails.isViewProductVariant) && (
        <div
          onClick={fnCloseEditOrder}
          className="sticky flex cursor-pointer items-center top-0 my-2"
        >
          <ArrowBack
            className="mr-2"
          />
          <h5 className="font-semibold">
            {props.lang?.text__back || 'Back'}
          </h5>
        </div>
      )}
      <ProductSelection
        productsOrdered={productsCart}
        productDetails={productDetails}
        fnChange={fnChangeProducts}
        fnSetProductDetails={setProductDetails}
      />
      {(!productDetails.isViewProductDetail && !productDetails.isViewProductVariant) && (
        <div
          className="sticky bg-white bottom-0 py-2"
        >
          <Button
            onClick={fnConfirmEditProducts}
            variant="contained"
            color="primary"
            className="whatsapp w-full"
            disabled={!Object.keys(productsCart).length}
          >
            {props.lang?.btn__confirm || 'Confirm'}
          </Button>
        </div>
      )}
    </section>
  )
}