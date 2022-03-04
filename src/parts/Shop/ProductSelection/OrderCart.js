import React, { useCallback, useEffect, useContext, useState } from "react";
import { Button } from "@material-ui/core";
import { Close } from '@material-ui/icons';
import Modal from "src/components/Modal";
import Image from "src/components/Container/Image";
import NumberRange from "src/components/form/NumberRange";
import OrderItem from "./OrderItem";

import useChildEvent from "src/helpers/useChildEvent";
import formatThousand from 'src/helpers/formatThousand';

export default function VariantMiniCart({
  lang,
  productsOrdered,
  selectedMetaList,
  CheckoutComponent,
  fnToggleSelectProduct,
  fnToggleSelectVariant,
  fnChangeRangeProduct,
}) {
  const [isDisplay, setIsDisplay] = useState(false);
  const toggleCart = useCallback(
    (event) => {
      useChildEvent(event, () => setIsDisplay(!isDisplay));
    },
    [isDisplay]
  );
  const handleToggleVariantCart = useCallback(
    (event) => {
      useChildEvent(event, toggleCart)
    },
    []
  );

  return (
    <Modal
      in={isDisplay}
      toggleModal={toggleCart}
      content={() => (
        <div
          className="fixed m-auto bottom-0 right-0 left-0"
          style={{
            minWidth: '300px',
            maxWidth: '375px',
          }}
        >
          <div
            className="relative w-full h-full flex justify-center flex-col"
          >
            <div
              className="relative"
            >
              <section
                className="pt-2 relative w-full bg-white rounded-t"
                style={{
                  minHeight: "200px"
                }}
              >
                <div
                  className="text-right px-4"
                >
                  <Close
                    fontSize="small"
                    className="cursor-pointer"
                    onClick={() => toggleCart()}
                  />
                </div>
                <div
                  className="overflow-auto"
                  style={{
                    maxHeight: "50vh",
                    minHeight: "200px"
                  }}
                >
                  {
                    Object.keys(productsOrdered || {}).map((key) => (
                      <OrderItem
                        item={productsOrdered[key]}
                        keyItem={key}
                        fnChangeRangeProduct={fnChangeRangeProduct}
                      />
                      // <div className="flex flex-col py-4 border-b border-gray-200 px-2">
                      //   <div className="flex">
                      //     {console.log(key)}
                      //     <div className="w-auto cursor-pointer">
                      //       <div className="relative">
                      //         <div
                      //           className="object-cover rounded overflow-hidden"
                      //           style={{ width: 80, height: 80 }}
                      //         >
                      //           <Image
                      //             src={productsOrdered[key]?.image}
                      //             alt={productsOrdered[key]?.name}
                      //             style={{
                      //               width: '80px',
                      //               height: '80px'
                      //             }}
                      //           />
                      //         </div>
                      //       </div>
                      //     </div>
                      //     <div
                      //         className="flex flex-1 items-center relative"
                      //     >
                      //         {/* <div
                      //           className="absolute z-10 w-full h-full cursor-pointer"
                      //         /> */}
                      //         <div className="flex-1 mx-4">
                      //           <div
                      //               className="text-sm leading-4 font-bold mb-2"
                      //           >
                      //               {productsOrdered[key].name}
                      //           </div>
                      //           {productsOrdered[key].meta?.originPrice && (
                      //             <div className="flex items-center mb-1">
                      //               <div className="text-sm leading-2 text-neutral-5 mr-2">
                      //                 <strike>
                      //                     {`${productsOrdered[key].meta?.currency_code ?? ''} ${formatThousand(
                      //                       productsOrdered[key].meta?.originPrice
                      //                     )}`}
                      //                 </strike>
                      //               </div>
                      //               <div
                      //                 className="p-1 text-white bg-red-500 rounded"
                      //                 style={{
                      //                   // background: '#e74c3c',
                      //                   // borderRadius: '0.5rem',
                      //                 }}
                      //               >
                      //                 {`${Math.round(productsOrdered[key].meta?.salePercentage)}%`}
                      //               </div>
                      //             </div>
                      //           )}
                      //           <div className="text-sm font-semibold text-primary-orange mb-2">
                      //               {`${productsOrdered[key].meta?.currency_code ?? ''} ${formatThousand(
                      //                 productsOrdered[key]?.price
                      //               )}`}
                      //           </div>
                      //           <div className="flex">
                      //             {
                      //               productsOrdered[key].meta?.variation_options?.map((options) => (
                      //                 <div className="border rounded-lg p-1 mr-1">
                      //                   {options}
                      //                 </div>
                      //               ))
                      //             }
                      //           </div>
                      //         </div>
                      //     </div>
                      //   </div>
                      //   {console.log(productsOrdered[key]?.quantity)}
                      //   {`aw: ${productsOrdered[key]?.quantity}`}
                      //   <div className="self-end">
                      //     <NumberRange
                      //       name={`${key}`}
                      //       min="0"
                      //       max={productsOrdered[key].meta?.maxQuantity}
                      //       value={productsOrdered[key]?.quantity}
                      //       fnChange={fnChangeRangeProduct}
                      //     />
                      //   </div>
                      // </div>
                    ))
                  }
                </div>
                <section className="flex px-2">
                  {CheckoutComponent}
                </section>
              </section>
              
            </div>
          </div>
        </div>
      )}
    >
      {() => (
        <Button
          type="button"
          className="is-radiusless is-shadowless"
          variant="contained"
          color="primary"
          onClick={handleToggleVariantCart}
          disableElevation
        >
          Cart
        </Button>
      )}
    </Modal>
  )
}