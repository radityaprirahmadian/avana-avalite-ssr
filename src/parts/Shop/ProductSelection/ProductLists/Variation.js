import React, { useContext } from 'react';
import NumberRange from 'src/components/form/NumberRange';
import { Checkbox } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import Button from 'src/components/Button';

import formatThousand from 'src/helpers/formatThousand';

import MainContext from 'src/parts/Context';

export default function Variation({
  lang,
  item,
  selectedMeta,
  productsOrdered,
  fnSelectProduct,
  fnChangeRangeProduct,
  fnToggleSelectVariant
}) {
  const MAINCONTEXT = useContext(MainContext);
  const whitelistFeatures = MAINCONTEXT?.whitelistFeatures;
  return (
    <section className="pt-4 flex-1 flex flex-col">
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
      <div>
        <span className="text-base py-1 mb-4">
          {lang?.text__select || 'Select'}{' '}{item.variation?.name}
        </span>
      </div>
      <div className="py-4 flex-1">
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
                          disabled={option.quantity === 0}
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
                          <div className="text-sm text-red-5 leading-3">
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
                    {(productsOrdered?.[`${item.id}_${option.id}`] && !whitelistFeatures?.['catalog_wacommerce'])
                      ? (
                        <div className="self-end py-2">
                          <NumberRange
                            name={`${item.id}_${option.id}`}
                            min="0"
                            max={option.quantity}
                            value={productsOrdered?.[`${item.id}_${option.id}`]?.quantity}
                            fnChange={fnChangeRangeProduct}
                          />
                        </div>
                      ) : null
                    }
                  </div>
              )
            }
        )}
      </div>
      <section
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '1rem 0',
          background: 'white'
        }}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={() => fnToggleSelectVariant()}
          disabled={!item?.quantity || !selectedMeta?.quantity}
        >
          {whitelistFeatures?.['catalog_wacommerce']
            ? (lang?.btn__choose || 'Choose')
            : (lang?.btn__buy || 'Buy')
          }
        </Button>
      </section>
  </section>
  )
}