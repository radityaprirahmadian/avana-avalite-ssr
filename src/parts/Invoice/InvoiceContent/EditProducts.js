import React from 'react';

import Button from 'src/components/Button';
import ProductSelection from 'src/parts/Shop/ProductSelection';
import { ArrowBack } from '@material-ui/icons';
import mixpanel from 'mixpanel-browser';

export default function EditProducts(props) {
  const [productsCart, setProductsCart] = React.useState({}) 
  
  const fnChangeProducts = React.useCallback(
    (e) => {
      e.persist && e.persist();

      setProductsCart(() => ({
        ...e.target.value
      }));
    },
    [setProductsCart]
  );

  const fnCloseEditOrder = React.useCallback(
    () => {
      mixpanel.track('Cancel Edit Order');
      props.setStatusState((prevState) => ({
        ...prevState,
        isProductsEdited: true,
        isEditOrder: false,
      }))
    },
    [props.setStatusState]
  );

  const fnConfirmEditProducts = React.useCallback(
    () => {
      mixpanel.track('Submit Edit Order', {
        Products: Object.values(productsCart)
          .map((product) => ({
            'Product Name': `${product.name} ${
              product.variation ? ` (${product.variation}) ` : ''
            }`,
            'Product Quantity': product.quantity,
          })),
      });
      props.setProductsOrdered(productsCart);
      props.fnSyncTotalPayment();
      fnCloseEditOrder();
    },
    [fnCloseEditOrder, props.setProductsOrdered, props.fnSyncTotalPayment, productsCart]
  );

  React.useEffect(() => {
    mixpanel.track('Edit Order', {
      Products: Object.values(props.productsOrdered)
        .map((product) => ({
          'Product Name': `${product.name} ${
            product.variation ? ` (${product.variation}) ` : ''
          }`,
          'Product Quantity': product.quantity,
        })),
    });
  }, [])

  React.useEffect(
    () => {
      setProductsCart(() => ({
        ...props.productsOrdered
      }));
    },
    [setProductsCart, props.productsOrdered],
  )

  return (
    <section>
      <div
        onClick={fnCloseEditOrder}
        className="sticky flex cursor-pointer items-center top-0 my-2"
      >
        <ArrowBack
          className="mr-2"
        />
        <h5 className="font-semibold">
          {props.lang?.text__back || 'Back'}
        </h5>
      </div>
      <ProductSelection
        productsOrdered={productsCart}
        fnChange={fnChangeProducts}
      />
      <div
        className="sticky bg-white bottom-0 py-2"
      >
        <Button
          onClick={fnConfirmEditProducts}
          variant="contained"
          color="primary"
          className="whatsapp w-full"
        >
          {props.lang?.btn__confirm || 'Confirm'}
        </Button>
      </div>
    </section>
  )
}