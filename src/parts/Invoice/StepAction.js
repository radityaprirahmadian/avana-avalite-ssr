import React from 'react';

import Button from 'src/components/Button';

export default function StepAction({
  lang,
  formInfoStatus,
  orderDetails,
  currentStep,
  statusState,
  pricingCharge,
  productsOrdered,
  setStatusState,
  fnProcessOrder,
  fnNextStep,
  fnPrevStep
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
      <div
        className={`invoice__footer 
          w-full
        `}
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
            className="whatsapp w-full"
            disabled={
              // isLoading ||
              ((currentStep === 1 &&
                Object.values(formInfoStatus).some((x) => x < 3 || x === 0)) ||
              (currentStep === 2 &&
                (Object.values(productsOrdered).length <= 0 || pricingCharge.isCalculating)) ||
              (currentStep === 3 &&
                orderDetails.paymentMethod === ''))
            }
            loading={currentStep === 3 ? statusState.isProcessOrder : null}
          >
            { currentStep === 2
                ? lang?.btn__proceed_order || 'Proceed Order'
                : currentStep === 3
                  ? lang?.btn__choose_payment || 'Choose Payment Method'
                  : lang?.btn__continue || 'Continue'
            }
          </Button>
        </div>
        <div className="buttons w-full py-2">
          {currentStep > 1 && !statusState.isEditOrder && (
            <Button
              variant="contained"
              color="default"
              className="w-full"
              onClick={fnPrevStep}
              disableElevation
            >
              {/* <FormattedMessage id="components.text__Back" /> */}
              {lang?.btn__back || 'Back'}
            </Button>
          )}
        </div>
        <div className="buttons w-full py-2">
          {(currentStep === 2 && !statusState.isEditOrder) && (
            <Button
              color="primary"
              onClick={fnEditOrder}
              className="w-full"
              disableRipple
              style={{
                textTransform: 'none'
              }}
            >
              {lang?.btn__edit_order || 'I Want to Edit My Order'}
            </Button>
          )}
        </div>
      </div>
  )
}