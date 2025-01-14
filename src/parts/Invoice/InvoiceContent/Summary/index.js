import React from 'react';

import SummaryProducts from './SummaryProducts';
import SummaryDetails from './SummaryDetails';
import Coupon from './Coupon';

import MainContext from 'src/parts/Context';
import Localization from 'src/configs/lang/invoice/summary';

export default function Summary({
   orderDetails,
   pricingCharge,
   productsOrdered,
   formInfoData,
   fnUpdateOrderDetails,
   setTotalPrice
}) {
   const MAINCONTEXT = React.useContext(MainContext);
   const lang = Localization[MAINCONTEXT.locale];

   return (
      <div
         className="flex flex-col"
      >
         <div className="text-base font-semibold">
            {`${lang?.text__order || 'Order'} \#${orderDetails.orderNumber}`}
         </div>
         <SummaryProducts
            orderDetails={orderDetails}
            productsOrdered={productsOrdered}
         />
         <Coupon
            lang={lang}
            formInfoData={formInfoData}
            productsOrdered={productsOrdered}
            orderDetails={orderDetails}
            fnUpdateOrderDetails={fnUpdateOrderDetails}
         />
         <SummaryDetails
            lang={lang}
            orderDetails={orderDetails}
            pricingCharge={pricingCharge}
            setTotalPrice={setTotalPrice}
         />
      </div>
   )
}