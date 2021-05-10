import React from 'react'

import TextField from 'src/components/form/TextField'
import PhoneInput from 'src/components/form/PhoneInput'

export default function CustomerInformation(props) {
   return (
      <div>
         <div className="mb-1">
            <TextField
               name="name"
               defaultValue={props.data.name}
               // error={errors.customer_name}
               // helperText={errorMessageHandler(errors.customer_name)}
               // inputRef={register({
               //    required: true,
               // })}
               label={props.lang?.label__name || 'Your Name'}
               onChange={props.fnChange}
            />
         </div>
         <div className="mb-0">
            <PhoneInput
               value={props.data.phoneNumber}
               country={props.defualtCountry}
               onlyCountries={['id', 'my', 'sg']}
               onChange={(phone) =>
                  props.fnChange({
                     target: {
                        id: 'order',
                        name: 'phoneNumber',
                        value: phone,
                        type: 'no_persist',
                     },
                  })
               }
               specialLabel={props.lang?.label__phone || 'Your Phone'}
            />
         </div>
      </div>
   )
}
