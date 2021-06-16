import React from 'react';

import FormInformation from './FormInformation';
import Summary from './Summary';
import Payment from './Payment';

export default function InvoiceContent({
  formInfoData,
  formInfoStatus,
  productsOrdered,
  orderDetails,
  pricingCharge,
  additionalInfoForm,
  meta,
  currentStep,
  updateFormInfoData,
  updateFormInfoStatus,
  fnChange,
  fnUpdateOrderDetails,
  fnSyncTotalPayment
}) {
  const [COUNTRIES, setCountries] = React.useState({
    data: [],
    selected: null,
    status: 'loading',
    errors: [],
  });

  const [STATES, setStates] = React.useState({
      data: [],
      selected: {},
      status: 'idle',
      errors: [],
  });

  const [CITIES, setCities] = React.useState({
    data: [],
    selected: null,
    status: 'idle',
    errors: [],
  });

  const [COURIER, setCourier] = React.useState({
    data: [],
    selected: null,
    status: 'idle',
    errors: [],
  });

  const [SERVICES, setService] = React.useState({
    data: [],
    selected: null,
    status: 'idle',
    errors: [],
  });

  const [SELFPICKUP, setSelfPickup] = React.useState({
    data: {},
    status: 'idle',
    errors: [],
  });

  if (currentStep === 1) {
    return (
      <>
        <FormInformation
          COUNTRIES={COUNTRIES}
          STATES={STATES}
          CITIES={CITIES}
          COURIER={COURIER}
          SERVICES={SERVICES}
          SELFPICKUP={SELFPICKUP}
          formInfoData={formInfoData}
          formInfoStatus={formInfoStatus}
          orderDetails={orderDetails}
          productsOrdered={productsOrdered}
          additionalInfoForm={additionalInfoForm}
          meta={meta}
          updateFormInfoData={updateFormInfoData}
          updateFormInfoStatus={updateFormInfoStatus}
          setCountries={setCountries}
          setStates={setStates}
          setCities={setCities}
          setCourier={setCourier}
          setService={setService}
          setSelfPickup={setSelfPickup}
          fnChange={fnChange}
          fnSyncTotalPayment={fnSyncTotalPayment}
          fnUpdateOrderDetails={fnUpdateOrderDetails}
        />
      </>
    )
  } else if (currentStep === 2) {
    return (
      <>
        <Summary
          formInfoData={formInfoData}
          orderDetails={orderDetails}
          pricingCharge={pricingCharge}
          productsOrdered={productsOrdered}
          fnUpdateOrderDetails={fnUpdateOrderDetails}
        />
      </>
    )
  } else if (currentStep === 3) {
    return (
      <>
        <Payment
          paymentList={meta.payment_method}
          orderDetails={orderDetails}
          fnUpdateOrderDetails={fnUpdateOrderDetails}
        />
      </>
    )
  }

  return null
}