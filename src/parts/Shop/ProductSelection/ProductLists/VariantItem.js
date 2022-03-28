import React from "react";
import Image from 'src/components/Container/Image';
import NumberRange from 'src/components/form/NumberRange';
import formatThousand from 'src/helpers/formatThousand';

export default function VariantItem({
  item,
  optionData,
  fnChangeRangeProduct,
}) {
  return (
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
          max={item.meta?.maxQuantity || optionData?.[item.variation_option_id]?.quantity}
          value={item?.quantity}
          fnChange={fnChangeRangeProduct}
        />
      </div>
    </div>
  )
}