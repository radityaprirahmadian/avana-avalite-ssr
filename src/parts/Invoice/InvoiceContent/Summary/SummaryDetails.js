import React from 'react';
import formatCurrency from 'src/helpers/formatCurrency';

const PriceSummary = (props) => (
   <div
      className="flex items-center mb-2 text-right"
      style={{ fontSize: props.totalPrice ? '1rem' : '0.9rem' }}
   >
      {props.children}
   </div>
)
const PriceTitle = (props) => (
   <span className="flex-1 font-bold">
      {props.children}
   </span>
)
const PriceAmmount = (props) => (
   <span style={{ minWidth: '150px'}}>
      {props.children}
   </span>
)

export default function SummaryDetails({lang, orderDetails, pricingCharge}) {
   const calculateWrapper = React.useCallback(
      (cb) => {
         return pricingCharge.isCalculating
            ? `${lang?.text__calculating || 'Calculating'} ...`
            : formatCurrency(cb, orderDetails.currencyCode);
      },
      [orderDetails, pricingCharge]
   );
   return (
      <div>
         <PriceSummary>
            <PriceTitle>
               {lang?.text__subtotal || 'Subtotal'}
            </PriceTitle>
            <PriceAmmount>
               {calculateWrapper(pricingCharge.subTotal)}
            </PriceAmmount>
         </PriceSummary>
         <PriceSummary>
            <PriceTitle>
               {lang?.text__shipping || 'Shipping'}
            </PriceTitle>
            <PriceAmmount>
               {calculateWrapper(pricingCharge.totalShipping)}
            </PriceAmmount>
         </PriceSummary>
         <PriceSummary>
            <PriceTitle>
               {lang?.text__shipping_insurance || 'Shipping Insurance'}
            </PriceTitle>
            <PriceAmmount>
               {calculateWrapper(pricingCharge.insuranceRate)}
            </PriceAmmount>
         </PriceSummary>
         <PriceSummary>
            <PriceTitle>
               {lang?.text__tax || 'Tax'}
            </PriceTitle>
            <PriceAmmount>
               {calculateWrapper(pricingCharge.totalTax)}
            </PriceAmmount>
         </PriceSummary>
         <PriceSummary>
            <PriceTitle>
               {lang?.text__discount || 'Discount'}
            </PriceTitle>
            <PriceAmmount>
               {calculateWrapper(pricingCharge.discount + (orderDetails.coupon?.total_discount || 0))}
            </PriceAmmount>
         </PriceSummary>
         <hr className="my-4" />
         <PriceSummary totalPrice>
            <PriceTitle>
               {lang?.text__total || 'Total'}
            </PriceTitle>
            <PriceAmmount>
               {calculateWrapper(pricingCharge.totalPrice - (orderDetails.coupon?.total_discount || 0))}
            </PriceAmmount>
         </PriceSummary>
      </div>
   )
}