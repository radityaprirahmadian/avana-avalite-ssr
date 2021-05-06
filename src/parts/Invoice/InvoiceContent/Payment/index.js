import React from 'react';

import { bankList } from 'src/constants/images';
import Slider from "react-slick";
const PaymentsContainer = ({children}) => (
  <div
    style={{
      display: 'grid',
      'grid-template-columns': '1fr',
      'grid-gap': '15px',
      margin: '1rem 0'
    }}
  >
    {children}
  </div>
)

const PaymentsWrapper = ({checked, children, ...props}) => (
  <label
    className="flex flex-col cursor-pointer text-center rounded-lg px-3 border-solid border-2"
    style={{
      minHeight: '75px',
      maxHeight: '150px',
      ...(checked  && { backgroundColor: '#fff8ee' })
    }}
    {...props}
  >
    {children}
  </label>
)

const PaymentMethod = ({children}) => (
  <div
    className="flex justify-between items-center cursor-pointer mx-3"
    style={{
      height: '75px',
    }}
  >
    {children}
  </div>
)

export default function Payments({
  paymentList,
  orderDetails,
  fnUpdateOrderDetails,
}) {
  const slickSetting= {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 5,
    swipeToSlide: true,
    className: 'h-100 w-100'
  };
  return (
    <PaymentsContainer>
      {
        paymentList
          ?.filter((payment) => payment.code !== 'manual')
          ?.filter((payment) => payment.code !== 'nicepay')
          ?.map((payment) => (
            <PaymentsWrapper
              key={payment.code}
              htmlFor={payment.code}
              checked={payment.code === orderDetails.paymentMethod}
              onClick={() =>{
                fnUpdateOrderDetails((prevState) => ({
                  ...prevState,
                  paymentMethod: payment.code
                }))}
              }
            >
              <PaymentMethod>
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/payments/${
                    payment.code === 'faspay' || payment.code === 'avapay'
                      ? `onlinebanking` : payment.code}.svg`
                  }
                  alt=""
                  className="h-3/6"
                  style={{
                    flex: '1',
                    maxWidth: '100px',
                  }}
                />
                <span
                  className="font-medium text-left px-3"
                  style={{
                    flex: '2',
                  }}
                >
                  {payment.code === 'faspay'
                    ? 'Online Banking'
                    : payment.display_name}
                </span>
                <input
                  type="radio"
                  id={payment.code}
                  name="payments"
                  className="hidden"
                  value={payment.code}
                />
              </PaymentMethod>
              {
                payment.code === 'faspay' || payment.code === 'avapay' ? 
                <div className="grid border-t border-solid border-gray-300 py-3 mx-4 my-1">
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: '75px'
                    }}
                  >
                    <Slider {...slickSetting}>
                      {
                        Object.values(bankList[payment.code === 'faspay' ? 'idBank' : 'myBank']).map((bank) => (
                          <div className="w-100 h-100">
                            <img
                              className="inline-block px-2"
                              src={`${bank.url}`}
                              alt={`${bank.name}`}
                            />
                          </div>
                        ))
                      }
                    </Slider>
                  </div>
                </div>
                : ''
              }
            </PaymentsWrapper>
          ))
      }
    </PaymentsContainer>
  )
}