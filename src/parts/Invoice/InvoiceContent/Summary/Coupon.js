import React from 'react';

import TextField from 'src/components/form/TextField';
import Button from 'src/components/Button';

import coupons from 'src/constants/api/coupons'

import MainContext from 'src/parts/Context';

export default function Coupon(props) {
  const { lang } = props; 
  const MAINCONTEXT = React.useContext(MainContext);

  const [COUPON, setCoupon] = React.useState({
    input: '',
    status: 'init',
    errors: [],
  })

  const fnChangeCoupon = React.useCallback((e) => {
    e.persist && e.persist();

    setCoupon((prevState) => ({
      ...prevState,
      input: e.target.value
    }))
  }, [setCoupon]);

  const fnApplyCoupon = React.useCallback(() => {
    const couponCode = COUPON.input || props.orderDetails?.coupon?.couponCode;
    MAINCONTEXT.setPricingCharge((prevState) => ({
      ...prevState,
      isCalculating: true      
    }));
    setCoupon((prevState) => ({
      ...prevState,
      input: couponCode,
      status: 'loading'
    }));

    coupons.calculate({
      phone_number: props.formInfoData.phoneNumber,
      email: props.formInfoData.email,
      coupon_code: couponCode,
      products: Object.values(props.productsOrdered).map((val) => {
          return {
            product_id: val.product_id,
            quantity: val.qty ?? val.quantity,
            ...((val.product_option_value_id || val.variation_option_id)
                && {variation_option_id: val.product_option_value_id ?? val.variation_option_id})
          }
        })
    }).then((res) => {
      MAINCONTEXT.setPricingCharge((prevState) => ({
        ...prevState,
        isCalculating: false      
      }));
      setCoupon((prevState) => ({
        ...prevState,
        status: 'ok'
      }));
      props.fnUpdateOrderDetails((prevState) => ({
        ...prevState,
        coupon: {
          ...res,
          couponCode: couponCode
        },
      }));
    }).catch((err) => {
      const errMessage = typeof err?.message === 'object'
        ? err?.message?.coupon_code?.[0]
        : err?.message;
      MAINCONTEXT.setPricingCharge((prevState) => ({
        ...prevState,
        isCalculating: false      
      }));
      props.fnUpdateOrderDetails((prevState) => ({
        ...prevState,
        coupon: {},
      }));
      setCoupon((prevState) => ({
        ...prevState,
        input: '',
        status: 'error',
        errors: errMessage
      }));
    })
  }, [props.formInfoData.email, props.formInfoData.phoneNumber, COUPON.input, props.productsOrdered, props.fnUpdateOrderDetails]);

  const fnRemoveCoupon = React.useCallback(() => {
    MAINCONTEXT.setPricingCharge((prevState) => ({
      ...prevState,
      isCalculating: true      
    }));
    setCoupon((prevState) => ({
      ...prevState,
      input: '',
      status: 'init'
    }));
    props.fnUpdateOrderDetails((prevState) => ({
      ...prevState,
      coupon: {},
    }));
    MAINCONTEXT.setPricingCharge((prevState) => ({
      ...prevState,
      isCalculating: false      
    }));
  }, [props.fnUpdateOrderDetails])

  React.useEffect(() => {
    if (props.orderDetails?.coupon?.couponCode &&
      props.orderDetails?.coupon?.couponCode !== COUPON.input
    ) {
      fnApplyCoupon();
    }
  }, [props.orderDetails.coupon])

  return (
    <section className="flex w-100 mb-6">
      <div style={{flex: '3'}}>
        <TextField
          id="coupon"
          name="coupon_code"
          label={lang?.label__coupon || 'Coupon'}
          disabled={COUPON.status === 'loading'}
          error={COUPON.status === 'error'}
          value={COUPON.input}
          onChange={fnChangeCoupon}
          labelError={COUPON.errors}
        />
      </div>
      <div className="flex-1 mt-10">
        <Button
          name="coupon_button"
          disableElevation
          onClick={COUPON.status === 'init' ? fnApplyCoupon : fnRemoveCoupon}
          color="primary"
          disabled={COUPON.status === 'loading' || !COUPON.input}
          loading={COUPON.status === 'loading'}
        >
          {
            COUPON.status === 'ok'
              ? lang?.btn__remove || 'Remove'
              : lang?.btn__apply || 'Apply'
          }
        </Button>
      </div>
    </section>
  )
}