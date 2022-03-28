import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@material-ui/core";
import { Close } from '@material-ui/icons';
import Modal from "src/components/Modal";

import useChildEvent from "src/helpers/useChildEvent";
import VariantItem from "./VariantItem";

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
          return product.product_id === productData.id}
      ) || [],
    [productsOrdered, selectedId, selectedMeta]
  );
  const optionData = useMemo(
    () => {
      return productData.variation.options
        .reduce(
          (reducer, item) => {
            reducer[item.id] = item
            return reducer;
          },
          {}
        );
    },
    [productData]
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
                      <VariantItem
                        item={item}
                        optionData={optionData}
                        fnChangeRangeProduct={fnChangeRangeProduct}
                      />
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