import React from 'react'

import { Button, Badge } from '@material-ui/core'
import Modal from 'src/components/Modal'
import NumberRange from 'src/components/form/NumberRange'

import formatThousand from 'src/helpers/formatThousand'
import Context from 'src/parts/Shop/Context'

export default function Row({
   lang,
   item,
   productsOrdered,
   fnSelectProduct,
   fnChangeRangeProduct,
   fnToggleSelectVariant,
}) {
   // const fnToggleSelectVariant = React.useCallback((event) => {}, [])
   const productVariantSelected =
      Object.values(productsOrdered).filter(
         (product) => product.product_id === item.id
      ).length > 0

   return (
      <div className="flex flex-wrap items-center -mx-4 mb-4">
         <div className="w-auto px-4">
            <div className="relative">
               {item.sale_enabled && item.sale_percentage ? (
                  <Badge
                     badgeContent={`${Math.round(
                        item.sale_percentage
                     )}%`}
                     color="error"
                     style={{ zIndex: 0 }}
                  >
                     <div
                        className="object-cover rounded overflow-hidden"
                        style={{ width: 76, height: 76 }}
                     >
                        <img src={item.main_image} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                  </Badge>
               ) : (
                  <div
                     className="object-cover rounded overflow-hidden"
                     style={{ width: 76, height: 76 }}
                  >
                     <img src={item.main_image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
               )}
            </div>
         </div>
         <div className="flex-1">
            <h3
               className="text-sm leading-4 truncate"
               style={{ width: 160 }}
            >
               {item.name}
            </h3>
            {item.quantity === 0 && (
               <h6 className="text-sm text-red-600 mb-2 leading-3">
                  {lang?.text__out_of_stock || 'Out of stock'}
               </h6>
            )}

            {item?.sale_enabled && (
               <h6 className="text-xs leading-2">
                  <strike>
                     {`${item?.currency?.code ?? ''} ${formatThousand(
                        item?.price
                     )}`}
                  </strike>
               </h6>
            )}
            <h6 className="text-sm font-semibold">
               {`${item?.currency?.code ?? ''} ${formatThousand(
                  !item.sale_enabled
                     ? item?.price
                     : item?.sale_price ?? 0
               )}`}
            </h6>
         </div>
         <div className="w-auto px-4">
            {item.variation ? (
               <Button
                  type="button"
                  className="is-radiusless is-shadowless w-20"
                  variant="contained"
                  color={productVariantSelected ?
                     'default' :
                     'primary'
                  }
                  onClick={() => { fnToggleSelectVariant(item) }}
                  disableElevation
                  disabled={item.quantity === 0}
               >
                  {productVariantSelected ?
                     (lang?.btn__edit || 'Edit') :
                     (lang?.btn__buy || 'Buy')
                  }
               </Button>
            ) : (
               productsOrdered?.[item.id] ? (
                  <NumberRange
                     name={item.id}
                     min="0"
                     max={item.quantity}
                     value={productsOrdered?.[item.id]?.quantity}
                     fnChange={fnChangeRangeProduct}
                  />
               ) :  (
               <Button
                  type="button"
                  className="is-radiusless is-shadowless w-20"
                  variant="contained"
                  color="primary"
                  onClick={() => fnSelectProduct(item)}
                  disableElevation
                  disabled={item.quantity === 0}
               >
                  {lang?.btn__buy || 'Buy'}
               </Button>
               )
            )}
         </div>
      </div>
   )
}
