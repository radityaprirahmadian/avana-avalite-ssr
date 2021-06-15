import React from 'react'

import { Button } from '@material-ui/core'
import { WhatsappButton } from 'src/components/Button'
import { LocalMall } from '@material-ui/icons'

import CircularProgress from '@material-ui/core/CircularProgress'

export default function Checkout(props) {
   return (
      <div
         className="sticky footer-checkout pb-2 bg-white w-full"
         style={{ bottom: 30 }}
      >
         <div className="flex">
            <div className="w-full pr-2">
               <WhatsappButton
                  // variant="contained"
                  className="w-full h-full"
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
                  loading={props.statusOrder.isCreateOrderViaWA}
               >
                  {props.lang?.btn__order_via_whatsapp || 'Order via WhatsApp'}
               </WhatsappButton>
            </div>
            <div>
               <Button
                  variant="contained"
                  color="primary"
                  className="w-auto pl-2 h-full"
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
