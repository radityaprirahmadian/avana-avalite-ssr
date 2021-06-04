import React from 'react'

import { Button } from '@material-ui/core'
import { WhatsApp, LocalMall } from '@material-ui/icons'

import CircularProgress from '@material-ui/core/CircularProgress'

export default function Checkout(props) {
   return (
      <div
         className="sticky footer-checkout bg-white py-2 w-full"
         style={{ bottom: 30 }}
      >
         <div className="flex">
            <div className="w-full pr-2">
               <Button
                  variant="contained"
                  color="whatsapp"
                  className="whatsapp w-full"
                  disableElevation
                  startIcon={props.statusOrder.isCreateOrderViaWA || <WhatsApp />}
                  onClick={
                     () => {
                        let isOrderViaWa = true;
                        !props.statusOrder.isCreateOrderViaWA && props.fnCreateOrder(isOrderViaWa);
                     }
                  }
                  disabled={
                     props.data.name === '' ||
                     Object.values(props.data.productsOrdered).length === 0 ||
                     props.status.isCreatingOrder
                  }
               >
                  {props.statusOrder.isCreateOrderViaWA ? (
                     <CircularProgress size={20} />
                  ) : (
                     props.lang?.btn__order_via_whatsapp || 'Order via WhatsApp'
                  )}
               </Button>
            </div>
            <div>
               <Button
                  variant="contained"
                  color="primary"
                  className="w-auto pl-2"
                  disableElevation
                  startIcon={props.statusOrder.isCreateOrder || <LocalMall />}
                  onClick={() => {
                     !props.statusOrder.isCreateOrder && props.fnCreateOrder();
                  }}
                  disabled={
                     props.data.name === '' ||
                     Object.values(props.data.productsOrdered).length === 0 ||
                     props.statusOrder.isCreateOrder
                  }
               >
                  {props.statusOrder.isCreateOrder ? (
                     <CircularProgress size={20} />
                  ) : (
                     props.lang?.btn__buy || 'Buy'
                  )}
               </Button>
            </div>
         </div>
      </div>
   )
}
