import React, { useMemo } from 'react'

import { Button } from '@material-ui/core'
import { WhatsappButton } from 'src/components/Button'
import { LocalMall } from '@material-ui/icons'

import MainContext from 'src/parts/Context';

import CircularProgress from '@material-ui/core/CircularProgress'

export default function Checkout(props) {
   const MAINCONTEXT = React.useContext(MainContext);
   const whitelistFeatures = MAINCONTEXT?.whitelistFeatures;
   const isLoadingData = MAINCONTEXT?.isLoadingData;
   const totalPrice = useMemo(
      () => {
         return Object.values(props.data.productsOrdered)
            .reduce(
               (acc, product) => {
               return acc + (Number(product.price) * product.quantity)
               },
               0
            );
      },
      [Object.values(props.data.productsOrdered)]
   );

   return (
      <div
         className="sticky footer-checkout pb-2 bg-white w-full"
         style={{ bottom: 30 }}
      >
         <div className="flex flex-col">
            {
               isLoadingData ? (
                  <div
                     className="flex items-center mb-2"
                  >
                     <div className="flex-1">
                        <div className="loading rounded h-8">
                           <div className="invisible">loading</div>
                        </div>
                     </div>
                  </div>
               ) : !whitelistFeatures?.['catalog_wacommerce'] ? (
                  <div
                     className="mb-2"
                  >
                     <Button
                        variant="contained"
                        color="primary"
                        className="w-full pl-2 h-full"
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
                           `${props.lang?.btn__checkout_now || 'Checkout Now'}${totalPrice ? ` (${totalPrice})` : ''}`
                        )}
                     </Button>
                  </div>
               ) : (
                  null
               )
            }
            <div>
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
                     props.data.name === ''
                     || (!whitelistFeatures?.['catalog_wacommerce'] && Object.values(props.data.productsOrdered).length === 0)
                     || props.status.isCreatingOrder
                  }
                  loading={props.statusOrder.isCreateOrderViaWA}
               >
                  {whitelistFeatures?.['white_label_wa_commerce'] ? props.lang?.btn__order_now : props.lang?.btn__order_via_whatsapp || 'Order via WhatsApp'}
               </WhatsappButton>
            </div>
            
         </div>
      </div>
   )
}
