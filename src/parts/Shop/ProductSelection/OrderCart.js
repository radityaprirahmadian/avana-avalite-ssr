import React, { useCallback, useState } from "react";
import Button from "src/components/Button";
import { Close } from '@material-ui/icons';
import Modal from "src/components/Modal";
import OrderItem from "./OrderItem";

import useChildEvent from "src/helpers/useChildEvent";

export default function VariantMiniCart({
  lang,
  productsOrdered,
  CheckoutComponent,
  fnChangeRangeProduct,
  whitelistFeatures,
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
                        lang={lang}
                        whitelistFeatures={whitelistFeatures}
                        item={productsOrdered[key]}
                        keyItem={key}
                        fnChangeRangeProduct={fnChangeRangeProduct}
                      />
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
          variant="outlined"
          color="secondary"
          onClick={handleToggleVariantCart}
          disableElevation
        >
          <img
            src="images/shopping-cart.png"
            className="w-6"
          />
        </Button>
      )}
    </Modal>
  )
}