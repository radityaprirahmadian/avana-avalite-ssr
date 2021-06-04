import NumberRange from 'src/components/form/NumberRange';
import { Checkbox } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import formatThousand from 'src/helpers/formatThousand';

export default function Variation({
  lang,
  item,
  productsOrdered,
  fnSelectProduct,
  fnChangeRangeProduct,
  fnToggleSelectVariant
}) {
  return (
    <section className="py-4 flex-1">
      <div
        className="relative mb-4 flex items-center text-lg"
        onClick={() => fnToggleSelectVariant()}
      >
        <ArrowBack
            className="mr-2"
            style={{ cursor: 'pointer' }}
        />
        <span className="truncate">
          {item.name}
        </span>
      </div>
      <span className="text-sm py-1 px-2 rounded bg-gray-400 mb-4">
        {item.variation?.name}
      </span>
      <div className="py-4">
        {item?.variation?.options
          ?.filter((option) => option.id)
          ?.map(
            (option, index) => {
              return (
                  <div className="flex flex-col mb-2">
                    <div className="flex items-center" key={index}>
                      <div className="-ml-3">
                        <Checkbox
                          id={`${item.id}_${option.id}`}
                          name={`${item.id}_${option.id}`}
                          color="primary"
                          onChange={(e) => {
                            e.persist()
                            fnSelectProduct(item, {...option, isSelected: e.target.checked})
                          }}
                          checked={!!productsOrdered?.[`${item.id}_${option.id}`]}
                          //   disabled={variation.quantity === 0}
                        />
                      </div>
                      <div className="w-full px-4">
                        <div>{option.name}</div>
                        {option.quantity === 0 && (
                          <div className="text-sm text-red-600 leading-3">
                            {lang?.text__out_of_stock || 'Out of stock'}
                          </div>
                        )}
                      </div>
                      <div className="flex-none">
                          <span className="">
                            {`${
                                item?.currency
                                  ?.code ?? ''
                            } ${formatThousand(
                                option?.price
                            )}`}
                          </span>
                      </div>
                    </div>
                    {productsOrdered?.[`${item.id}_${option.id}`] && (
                      <div className="self-end py-2">
                        <NumberRange
                          name={`${item.id}_${option.id}`}
                          min="0"
                          max={option.quantity}
                          value={productsOrdered?.[`${item.id}_${option.id}`]?.quantity}
                          fnChange={fnChangeRangeProduct}
                        />
                      </div>
                    )}
                  </div>
              )
            }
        )}
      </div>
  </section>
  )
}