import React from 'react';

import Button from 'src/components/Button';

import PrivacyPolicy from 'src/parts/PrivacyPolicy'

export default function StepAction({
  lang,
  shopInfo,
  formInfoStatus,
  orderDetails,
  currentStep,
  statusState,
  pricingCharge,
  productsOrdered,
  setStatusState,
  fnProcessOrder,
  fnNextStep,
  fnPrevStep,
  fnChangePrivacyPolicy
}) {

  const fnEditOrder =  React.useCallback(
    () => {
      setStatusState((prevState) => ({
        ...prevState,
        isEditOrder: true
      }));
    },
    [setStatusState]
  );

  return (
    <>
      {(currentStep === 1 && (!statusState?.isLoadingPage && !!shopInfo?.is_enabled_privacy_policy)) && (
        <PrivacyPolicy
          shopInfo={shopInfo}
          isCheckbox
          checkboxValue={statusState.isConfirmPrivacyPolicy}
          onCheck={fnChangePrivacyPolicy}
        />
      )}
      <div
        className={`invoice__footer w-full my-1`}
        // ${
        //   status.isEditOrder ? 'is-sticky sticky-bottom' : ''
        // }
      >
        <div
          className="buttons w-full py-2"
          // style={{ marginTop: status.isEditOrder ? '0.5rem' : '' }}
        >
          <Button
            variant="contained"
            color="primary"
            // onClick={
            //   status.isEditOrder
            //     ? this._handleSubmitEditOrder
            //     : stepper.currentStep !== 3
            //     ? this._handleNextStep
            //     : this._handleProcessOrder
            // }
            onClick={
              currentStep !== 3 ?
                fnNextStep :
                fnProcessOrder
            }
            className="w-full"
            disabled={
              // isLoading ||
              ((currentStep === 1 &&
                (Object.values(formInfoStatus).some((x) => x < 3) ||
                (shopInfo?.is_enabled_privacy_policy && !statusState.isConfirmPrivacyPolicy))
              ) ||
              (currentStep === 2 &&
                (Object.values(productsOrdered).length <= 0 || pricingCharge.isCalculating)) ||
              (currentStep === 3 &&
                orderDetails.paymentMethod === ''))
            }
            disableElevation
            loading={currentStep === 3 ? statusState.isProcessOrder : null}
          >
            {currentStep === 2
              ? lang?.btn__proceed_order || 'Proceed Order'
              : currentStep === 3
                ? lang?.btn__choose_payment || 'Choose Payment Method'
                : lang?.btn__continue || 'Continue'
            }
          </Button>
        </div>
        {currentStep > 1 && !statusState.isEditOrder && (
          <div className="buttons w-full py-2">
            <Button
              variant="outlined"
              color="default"
              className="w-full"
              onClick={fnPrevStep}
              disableElevation
            >
              {/* <FormattedMessage id="components.text__Back" /> */}
              {lang?.btn__back || 'Back'}
            </Button>
          </div>
        )}
        {(currentStep === 2 && !statusState.isEditOrder) && (
          <div className="buttons w-full py-2">
            <Button
              color=""
              onClick={fnEditOrder}
              className="w-full"
              disableRipple
              style={{
                textTransform: 'none'
              }}
            >
              {lang?.btn__edit_order || 'I Want to Edit My Order'}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}