import image from 'src/constants/images'
import Spinner from 'src/components/Spinner';
import Button from 'src/components/Button';

import Localization from 'src/configs/lang/invoice/finish-order';

export default function FinishOrder({
  statusState,
  orderDetails
}) {
  const lang = Localization['id']

  return (
    <div
      className="flex flex-col justify-center text-center"
    >
      <div  className="flex flex-col items-center">
        <img src={image.congratulation} alt="AVA mascot gratz" width="100" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 my-4">
            {lang?.text__thank_for_order || 'Thank You for Order'}!
          </h2>
          <div>
            {lang?.text__please_wait_redirect || 'Please wait in a moment... we will redirect you to payment page'}
          </div>
        </div>
      </div>
      <div className="loader my-4">
          <Spinner size={0.5} />
        </div>
      {/* <a href={data.pay_url} ref={this.paymentRef}>
        <FormattedMessage id="components.Invoice.anchor__PaymentLink" />
      </a> */}
      <div
        className="redirectLink"
      >
        {statusState.isShowRedirect && (
          <div
            className="buttons"
          >
            <div>
              {lang?.text__not_directed_to_payment || 'Not yet direct to payment page'}? {lang?.text__click_button_bellow || 'Click button bellow'}
            </div>
            <Button
              variant="contained"
              color="primary"
              className="whatsapp"
              href={orderDetails.paymentUrl}
              // ref={this.paymentRef}
            >
              {lang?.btn__go_to_payment || 'Go to Payment Page'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}