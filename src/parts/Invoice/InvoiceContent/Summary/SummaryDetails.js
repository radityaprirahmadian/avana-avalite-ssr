import React,{useEffect} from 'react';
import formatCurrency from 'src/helpers/formatCurrency';

const PriceSummary = (props) => (
   <div
      className={`flex items-center mb-2 text-right`}
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

export default function SummaryDetails({lang, orderDetails, pricingCharge,setTotalPrice}) {
   const calculateWrapper = React.useCallback(
      (cb) => {
         return pricingCharge.isCalculating
            ? `${lang?.text__calculating || 'Calculating'} ...`
            : formatCurrency(cb, orderDetails.currencyCode);
      },
      [orderDetails, pricingCharge]
   );
    
   const total = pricingCharge.totalPrice + pricingCharge.totalTaxShipping - (orderDetails.coupon?.total_discount || 0)
  useEffect(() => {
   setTotalPrice(total)
 }, [orderDetails.coupon?.total_discount , pricingCharge.totalTaxShipping , pricingCharge.totalPrice]);
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
               {calculateWrapper(pricingCharge.totalTax + pricingCharge.totalTaxShipping)}
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
         <h6 className="text-base text-primary-orange">
            <PriceSummary>
               <PriceTitle>
                  {lang?.text__total || 'Total'}
               </PriceTitle>
               <PriceAmmount>
                  {calculateWrapper(pricingCharge.totalPrice + pricingCharge.totalTaxShipping - (orderDetails.coupon?.total_discount || 0))}
               </PriceAmmount>
            </PriceSummary>
         </h6>
      </div>
   )
}