import React, { useCallback } from 'react'

import { Button, Badge } from '@material-ui/core'
import { BadgeDiscount, BadgeProductCount } from 'src/components/Badge'
import NumberRange from 'src/components/form/NumberRange'
import Image from 'src/components/Container/Image'
import VariantMiniCart from './VariantMiniCart'

import formatThousand from 'src/helpers/formatThousand'
import maximumOrderQuantity from 'src/helpers/maxOrderQuantity'

export default function Row({
   onClick,
   lang,
   item,
   whitelistFeatures,
   selectedMeta,
   productsOrdered,
   fnSelectProduct,
   fnChangeRangeProduct,
   fnToggleSelectProduct,
   fnToggleSelectVariant,
}) {
   const {quantity: countProduct, isVariant} = selectedMeta || {}
   // const productImage = (item.main_image?.includes('/thumbnail/')
   //    ? item.main_image
   //    : item.main_image?.replace('/images', '/images/thumbnail')
   // );
   const productImage =  item.main_image
 
   const handleOnEventChild = React.useCallback(
      (e, onClickEvent) => {
         e.stopPropagation();
         onClickEvent(e)
      },
      []
   );
   const handleCancelProduct = useCallback(
      (id) => {
         fnChangeRangeProduct({
            target: {
               type: 'no_persist',
               name: id,
               value: 0,
            }
         })
      },
      [fnChangeRangeProduct],
   );
      
   return (
      <div className="flex py-4 border-b border-gray-200" >
         <div className="w-auto cursor-pointer" onClick={onClick}>
            <div className="relative">
               {
                  !whitelistFeatures?.['catalog_wacommerce'] ? (
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
                  ) : (
                     null
                  )
               }
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
                        <Image
                           src={productImage}
                           alt={item.name}
                           style={{
                              width: '80px',
                              height: '80px'
                           }}
                        />
                     </div>
                  </BadgeDiscount>
               ) : (
                  <div
                     className="object-cover rounded overflow-hidden"
                     style={{ width: 80, height: 80 }}
                  >
                     <Image
                        src={productImage}
                        alt={item.name}
                        style={{
                           width: '80px',
                           height: '80px'
                        }}
                     />
                  </div>
               )}
            </div>
         </div>
         <div
            className="flex flex-1 items-center relative"
         >
            <div
               className="absolute z-10 w-full h-full cursor-pointer"
               onClick={() => fnToggleSelectProduct(item)}
            />
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
            <div className="w-auto z-20">
               {(!whitelistFeatures?.['catalog_wacommerce'] && (item.quantity === 0 || item.quantityVariants === 0)) ? (
                  <div className="text-sm text-red-500 font-bold">
                     {lang?.text__out_of_stock || 'Out of stock'}
                  </div>
               ) : (item.variation && isVariant) ? (
                  // <Button
                  //    type="button"
                  //    className="is-radiusless is-shadowless"
                  //    variant="contained"
                  //    color="primary"
                  //    onClick={(e) => handleOnEventChild(e, () => fnToggleSelectVariant(item))}
                  //    disableElevation
                  //    disabled={item.quantity === 0 || item.quantityVariants === 0}
                  // >
                  //    {(lang?.btn__edit || 'Edit')}
                  // </Button>
                  <VariantMiniCart
                     lang={lang}
                     productData={item}
                     productsOrdered={productsOrdered}
                     fnToggleSelectVariant={fnToggleSelectVariant}
                     fnChangeRangeProduct={fnChangeRangeProduct}
                     selectedMeta={selectedMeta}
                  />
               ) : item.variation ? (
                  <Button
                     type="button"
                     className="is-radiusless is-shadowless"
                     variant="contained"
                     color="primary"
                     onClick={(e) => handleOnEventChild(e, () => fnToggleSelectVariant(item))}
                     disableElevation
                     disabled={!whitelistFeatures?.['catalog_wacommerce']
                        && (item.quantity === 0 || item.quantityVariants === 0)
                     }
                  >
                     {whitelistFeatures?.['catalog_wacommerce'] && !whitelistFeatures?.['wa_commerce_order_button_707'] 
                    ? (lang?.btn__choose || 'Choose') 
                    : whitelistFeatures?.['wa_commerce_order_button_707'] ? (lang?.btn__addToCart || 'Add to cart')
                    : (lang?.btn__buy || 'Buy')
                  }
                  </Button>
               ) : (
                  productsOrdered?.[item.id] && whitelistFeatures?.['catalog_wacommerce'] ? (
                     <Button
                        type="button"
                        className="is-radiusless is-shadowless"
                        variant="outlined"
                        color="secondary"
                        onClick={(e) => handleOnEventChild(e,() => handleCancelProduct(item.id))}
                        disableElevation
                     >
                        {(lang?.btn__cancel || 'Cancel')}
                     </Button>
                  ) : productsOrdered?.[item.id] ? (
                     <NumberRange
                        name={item.id}
                        min="0"
                        max={maximumOrderQuantity(item.quantity, item.max_purchase_on_transaction)}
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
                        disabled={!whitelistFeatures?.['catalog_wacommerce'] && item.quantity === 0}
                     >
                        {whitelistFeatures?.['catalog_wacommerce'] && !whitelistFeatures?.['wa_commerce_order_button_707'] 
                           ? (lang?.btn__choose || 'Choose') 
                           : whitelistFeatures?.['wa_commerce_order_button_707'] ? (lang?.btn__addToCart || 'Add to cart')
                           : (lang?.btn__buy || 'Buy')
                        }
                     </Button>
                  )
               )}
            </div>
         </div>
      </div>
   )
}
