import React from 'react'
import { Checkbox } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

import formatThousand from 'src/helpers/formatThousand'

export default function ModalSelectVariant(props) {
   return (
      <div className="fixed inset-0 bg-white mx-auto" style={{ maxWidth: 375 }}>
         <div className="p-4">
            <div
               className="relative mb-4 flex items-center text-lg"
               onClick={props.toggleModal}
            >
               <ArrowBack className="mr-2" style={{ cursor: 'pointer' }} />
               <span className="truncate">{props.item.name}</span>
            </div>
            <span className="text-sm py-1 px-2 rounded bg-gray-400 mb-4">
               {props.item.variation.name}
            </span>
            <div className="p-4">
               {props.item?.variation?.options?.map((option, index) => {
                  const checked =
                     Object.keys(props.data.data.productsOrdered).indexOf(
                        `${props.item.id}-${option.id}`
                     ) > -1
                  return (
                     <div
                        key={option.id}
                        className={[
                           'flex -mx-4 py-1 items-center',
                           option.quantity === 0 ? 'opacity-50' : '',
                        ].join(' ')}
                     >
                        <div className="flex-none">
                           <Checkbox
                              id={String(option.id)}
                              name={String(option.id)}
                              onClick={() =>
                                 props.data.fnSelectProduct({
                                    id: `${props.item.id}-${option.id}`,
                                    name: option.name,
                                    price: option.price,
                                    qty: 0,
                                 })
                              }
                              color="primary"
                              checked={checked}
                              disabled={option.quantity === 0}
                           />
                        </div>
                        <div className="w-full px-4">{option.name}</div>
                        <div className="flex-none px-4">
                           <span className="">
                              {`${
                                 props.item?.currency?.code ?? ''
                              } ${formatThousand(option?.price)}`}
                           </span>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>
      </div>
   )
}
