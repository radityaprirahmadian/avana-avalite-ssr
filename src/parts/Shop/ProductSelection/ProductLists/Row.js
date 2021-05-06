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
      <Context.Consumer>
         {(state) => {
            // const selected =
            //    Object.keys(state?.data?.productsOrdered).filter(
            //       (d) => d.indexOf(item.id) > -1
            //    ).length > 0

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
                                 <img src={item.main_image} alt={item.name} />
                              </div>
                           </Badge>
                        ) : (
                           <div
                              className="object-cover rounded overflow-hidden"
                              style={{ width: 76, height: 76 }}
                           >
                              <img src={item.main_image} alt={item.name} />
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
                        // <Modal
                        //    content={(toggleModal) => (
                        //       <div className="fixed inset-0 bg-white">
                        //          <div className="p-4">
                        //             <div
                        //                className="relative mb-4 flex items-center text-lg"
                        //                onClick={toggleModal}
                        //             >
                        //                <ArrowBack
                        //                   className="mr-2"
                        //                   style={{ cursor: 'pointer' }}
                        //                />
                        //                <span className="truncate">
                        //                   {item.name}
                        //                </span>
                        //             </div>
                        //             <span className="text-sm py-1 px-2 rounded bg-gray-400 mb-4">
                        //                {item.variation.name}
                        //             </span>
                        //             <div className="p-4">
                        //                {item?.variation?.options?.map(
                        //                   (option, index) => {
                        //                      return (
                        //                         <div className="flex -mx-4 py-2 items-center">
                        //                            <div className="flex-none">
                        //                               <Checkbox
                        //                                  id={String(option.id)}
                        //                                  name={String(
                        //                                     option.id
                        //                                  )}
                        //                                  color="primary"
                        //                                  //   checked={variation.checked}
                        //                                  //   disabled={variation.quantity === 0}
                        //                               />
                        //                            </div>
                        //                            <div className="w-full px-4">
                        //                               {option.name}
                        //                            </div>
                        //                            <div className="flex-none px-4">
                        //                               <span className="">
                        //                                  {`${
                        //                                     item?.currency
                        //                                        ?.code ?? ''
                        //                                  } ${formatThousand(
                        //                                     option?.price
                        //                                  )}`}
                        //                               </span>
                        //                            </div>
                        //                         </div>
                        //                      )
                        //                   }
                        //                )}
                        //             </div>
                        //          </div>
                        //       </div>
                        //    )}
                        // >
                        //    {(toggleModal) => (
                        //       <Button
                        //          type="button"
                        //          className="is-radiusless is-shadowless"
                        //          variant="contained"
                        //          color={
                        //             'primary'
                        //             //   order.product_ordered.filter(
                        //             //      (order) => order.product_id === product.id
                        //             //   ).length === 0
                        //             //      ? 'primary'
                        //             //      : 'default'
                        //          }
                        //          onClick={toggleModal}
                        //          disableElevation
                        //          disabled={item.quantity === 0}
                        //       >
                        //          Buy
                        //          {/* {order.product_ordered.filter(
                        //             (order) => order.product_id === product.id
                        //          ).length !== 0
                        //             ? intl.formatMessage({
                        //                id: 'components.Products.Product.button__Edit',
                        //             })
                        //             : intl.formatMessage({
                        //                id: 'components.Products.Product.button__Buy',
                        //             })} */}
                        //       </Button>
                        //    )}
                        // </Modal>
                        <Button
                           type="button"
                           className="is-radiusless is-shadowless"
                           variant="contained"
                           color={
                              productVariantSelected ? 'default' : 'primary'
                           }
                           onClick={() => {
                              fnToggleSelectVariant(item)
                           }}
                           disableElevation
                           disabled={item.quantity === 0}
                        >
                           {productVariantSelected
                              ? lang?.btn__edit || 'Edit'
                              : lang?.btn__buy || 'Buy'}
                        </Button>
                     ) : productsOrdered?.[item.id] ? (
                        <NumberRange
                           name={item.id}
                           min="0"
                           max={item.quantity}
                           value={productsOrdered?.[item.id]?.quantity}
                           fnChange={fnChangeRangeProduct}
                        />
                     ) : (
                        <Button
                           type="button"
                           className="is-radiusless is-shadowless"
                           variant="contained"
                           color="primary"
                           onClick={() => fnSelectProduct(item)}
                           disableElevation
                           disabled={item.quantity === 0}
                        >
                           {lang?.btn__buy || 'Buy'}
                        </Button>
                     )}
                  </div>
               </div>
            )
         }}
      </Context.Consumer>
   )
}
