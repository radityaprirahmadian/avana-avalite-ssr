import React from 'react'

import { Button, Badge } from '@material-ui/core'
import { BadgeDiscount, BadgeProductCount } from 'src/components/Badge'
import NumberRange from 'src/components/form/NumberRange'
import Image from 'src/components/Container/Image'

import formatThousand from 'src/helpers/formatThousand'

export default function Row({
   onClick,
   lang,
   item,
   selectedMeta,
   productsOrdered,
   fnSelectProduct,
   fnChangeRangeProduct,
   fnToggleSelectProduct,
   fnToggleSelectVariant,
}) {
   // const fnToggleSelectVariant = React.useCallback((event) => {}, [])
   // const isVariant =
   //    Object.values(productsOrdered).filter(
   //       (product) => product.product_id === item.id && !!product.variation_option_id
   //    ).length > 0
   const {quantity: countProduct, isVariant} = selectedMeta || {}

   const handleOnEventChild = React.useCallback(
      (e, onClickEvent) => {
         e.stopPropagation();
         onClickEvent(e)
      },
      []
   )

   return (
      <div className="flex py-4 border-b border-gray-200" >
         <div className="w-auto cursor-pointer" onClick={onClick}>
            <div className="relative">
               <div
                  className="absolute"
                  style={{ width: 80, height: 80 }}
               >
                  <BadgeProductCount
                     content={countProduct}
                     styleBadge={{
                        right: countProduct > 99
                           ? '20px'
                           : countProduct > 9
                           ? '18px'
                           : '16px'
                     }}
                  >
                     <div
                        className="object-cover rounded overflow-hidden"
                        style={{ width: 80, height: 80 }}
                     />
                  </BadgeProductCount>
               </div >
               {item.sale_enabled && item.sale_percentage ? (
                  <BadgeDiscount
                     content={`${Math.round(
                        item.sale_percentage
                     )}%`}
                  >
                     <div
                        className="object-cover rounded overflow-hidden"
                        style={{ width: 80, height: 80 }}
                     >
                        <Image src={item.main_image} alt={item.name} />
                     </div>
                  </BadgeDiscount>
               ) : (
                  <div
                     className="object-cover rounded overflow-hidden"
                     style={{ width: 80, height: 80 }}
                  >
                     <Image src={item.main_image} alt={item.name} />
                  </div>
               )}
            </div>
         </div>
         <div className="flex flex-1 items-center cursor-pointer" onClick={() => fnToggleSelectProduct(item)}>
            <div className="flex-1 mx-4">
               <div
                  className="text-sm leading-4 font-bold mb-2"
               >
                  {item.name}
               </div>
               

               {item?.sale_enabled && (
                  <div className="text-sm leading-2 mb-2 text-neutral-5">
                     <strike>
                        {`${item?.currency?.code ?? ''} ${formatThousand(
                           item?.price
                        )}`}
                     </strike>
                  </div>
               )}
               <div className="text-sm font-semibold text-primary-orange">
                  {`${item?.currency?.code ?? ''} ${formatThousand(
                     !item.sale_enabled
                        ? item?.price
                        : item?.sale_price ?? 0
                  )}`}
               </div>
            </div>
            <div className="w-auto">
               {(item.quantity === 0 || item.quantityVariants === 0) ? (
                  <div className="text-sm text-red-5 font-bold">
                     {lang?.text__out_of_stock || 'Out of stock'}
                  </div>
               ) : item.variation ? (
                  <Button
                     type="button"
                     className="is-radiusless is-shadowless"
                     variant="contained"
                     color={isVariant ?
                        'default' :
                        'primary'
                     }
                     onClick={(e) => handleOnEventChild(e, () => fnToggleSelectVariant(item))}
                     disableElevation
                     disabled={item.quantity === 0 || item.quantityVariants === 0}
                  >
                     {isVariant ?
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
                     className="is-radiusless is-shadowless"
                     variant="contained"
                     color="primary"
                     onClick={(e) => handleOnEventChild(e,() => fnSelectProduct(item))}
                     disableElevation
                     disabled={item.quantity === 0}
                  >
                     {lang?.btn__buy || 'Buy'}
                  </Button>
                  )
               )}
            </div>
         </div>
      </div>
   )
}