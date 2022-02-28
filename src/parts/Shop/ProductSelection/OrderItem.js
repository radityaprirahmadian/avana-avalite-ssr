import React, { memo, useMemo } from "react";
import Image from "src/components/Container/Image";
import NumberRange from "src/components/form/NumberRange";
import formatThousand from 'src/helpers/formatThousand';
const OrderItem = ({
  item,
  keyItem,
  fnChangeRangeProduct,
}) => {
  const {
    image,
    name,
    quantity,
    price,
    meta,
  } = useMemo(
    () => item,
    [item]
  );

  return (
    <div className="flex flex-col py-4 border-b border-gray-200 px-2">
      <div className="flex">
        <div className="w-auto cursor-pointer">
          <div className="relative">
            <div
              className="object-cover rounded overflow-hidden"
              style={{ width: 80, height: 80 }}
            >
              <Image
                src={image}
                alt={name}
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
                  {name}
              </div>
              {meta?.originPrice && (
                <div className="flex items-center mb-1">
                  <div className="text-sm leading-2 text-neutral-5 mr-2">
                    <strike>
                        {`${meta?.currency_code ?? ''} ${formatThousand(
                          meta?.originPrice
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
                    {`${Math.round(meta?.salePercentage)}%`}
                  </div>
                </div>
              )}
              <div className="text-sm font-semibold text-primary-orange mb-2">
                  {`${meta?.currency_code ?? ''} ${formatThousand(
                    price
                  )}`}
              </div>
              <div className="flex">
                {
                  meta?.variation_options?.map((options) => (
                    <div className="border rounded-lg p-1 mr-1">
                      {options}
                    </div>
                  ))
                }
              </div>
            </div>
        </div>
      </div>
      {console.log(quantity)}
      {`aw: ${quantity}`}
      <div className="self-end">
        <NumberRange
          name={`${keyItem}`}
          min="0"
          max={meta?.maxQuantity}
          value={quantity}
          fnChange={fnChangeRangeProduct}
        />
      </div>
    </div>
  )
}

export default memo(OrderItem);