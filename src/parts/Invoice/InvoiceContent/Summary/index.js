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
   fnUpdateOrderDetails
}) {
   const MAINCONTEXT = React.useContext(MainContext);
   const lang = Localization[MAINCONTEXT.locale];

   return (
      <div
         className="flex flex-col"
      >
         <div className="text-base font-semibold">
            {`Order #${orderDetails.orderNumber}`}
         </div>
         <SummaryProducts
            orderDetails={orderDetails}
            productsOrdered={productsOrdered}
         />
         <Coupon
            formInfoData={formInfoData}
            productsOrdered={productsOrdered}
            orderDetails={orderDetails}
            fnUpdateOrderDetails={fnUpdateOrderDetails}
         />
         <SummaryDetails
            lang={lang}
            orderDetails={orderDetails}
            pricingCharge={pricingCharge}
         />
      </div>
   )
}