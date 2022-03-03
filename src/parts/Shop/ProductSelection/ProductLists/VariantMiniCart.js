import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@material-ui/core";
import { Close } from '@material-ui/icons';
import Modal from "src/components/Modal";
import Image from 'src/components/Container/Image';
import NumberRange from 'src/components/form/NumberRange';

import useChildEvent from "src/helpers/useChildEvent";
import formatThousand from 'src/helpers/formatThousand';

export default function VariantMiniCart({
  lang,
  productData,
  selectedId,
  productsOrdered,
  selectedMeta,
  fnToggleSelectVariant,
  fnChangeRangeProduct,
}) {
  const [isDisplay, setIsDisplay] = useState(false);
  const variantOrdered = useMemo(
    () => Object?.values(productsOrdered)
      ?.filter(
        (product) =>{
          console.log(product)
          return product.product_id === productData.id}
      ) || [],
    [productsOrdered, selectedId, selectedMeta]
  );

  const toggleCart = useCallback(
    (event) => {
      useChildEvent(event, () => setIsDisplay(!isDisplay));
    },
    [isDisplay, useChildEvent]
  );
  const handleToggleVariantCart = useCallback(
    (event) => {
      useChildEvent(event, toggleCart)
    },
    [toggleCart]
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
                    variantOrdered.map((item) => (
                      <div className="flex flex-col py-4 border-b border-gray-200 px-4">
                        <div className="flex">
                          <div className="w-auto cursor-pointer">
                            <div className="relative">
                              <div
                                className="object-cover rounded overflow-hidden"
                                style={{ width: 80, height: 80 }}
                              >
                                <Image
                                  src={item?.image}
                                  alt={item?.name}
                                  style={{
                                    width: '80px',
                                    height: '80px'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                              className="flex flex-1 items-center relative"
                          >
                              {/* <div
                                className="absolute z-10 w-full h-full cursor-pointer"
                              /> */}
                              <div className="flex-1 mx-4">
                                <div
                                    className="text-sm leading-4 font-bold mb-2"
                                >
                                    {item.name}
                                </div>
                                {item.meta?.originPrice && (
                                  <div className="flex items-center mb-1">
                                    <div className="text-sm leading-2 text-neutral-5 mr-2">
                                      <strike>
                                          {`${item.meta?.currency_code ?? ''} ${formatThousand(
                                            item.meta?.originPrice
                                          )}`}
                                      </strike>
                                    </div>
                                    <div
                                      className="p-1 text-white bg-red-500 rounded"
                                      style={{
                                        // background: '#e74c3c',
                                        // borderRadius: '0.5rem',
                                      }}
                                    >
                                      {`${Math.round(item.meta?.salePercentage)}%`}
                                    </div>
                                  </div>
                                )}
                                <div className="text-sm font-semibold text-primary-orange mb-2">
                                    {`${item.meta?.currency_code ?? ''} ${formatThousand(
                                      item?.price
                                    )}`}
                                </div>
                                <div className="flex">
                                  {
                                    item.meta?.variation_options.map((options) => (
                                      <div className="border rounded-lg p-1 mr-1">
                                        {options}
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                          </div>
                        </div>
                        <div className="self-end">
                          <NumberRange
                            name={`${item.product_id}_${item.variation_option_id}`}
                            min="0"
                            max={item.meta?.maxQuantity}
                            value={item?.quantity}
                            fnChange={fnChangeRangeProduct}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className="py-4 px-4 w-100">
                  <Button
                    type="button"
                    className="w-full pl-2 h-full is-radiusless is-shadowless"
                    variant="contained"
                    color="primary"
                    onClick={() => fnToggleSelectVariant(productData)}
                    disableElevation
                    disabled={productData?.quantity === 0 || productData?.quantityVariants === 0}
                  >
                      {(lang?.btn__add_more_variants || 'Add more variants')}
                  </Button>
                </div>
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
          {(lang?.btn__view || 'View')}
        </Button>
      )}
    </Modal>
  )
}