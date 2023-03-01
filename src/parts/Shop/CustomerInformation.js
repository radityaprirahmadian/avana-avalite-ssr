import React from 'react'

import TextField from 'src/components/form/TextField'
import PhoneInput from 'src/components/form/PhoneInput'

export default function CustomerInformation(props) {
   return (
      <div className="z-20">
         <div className="mb-1">
            <TextField
               id="form-customer-name"
               name="name"
               defaultValue={props.data.name}
               label={props.lang?.label__name || 'Name'}
               onChange={props.fnChange}
            />
         </div>
         <div className="mb-0">
            <PhoneInput
               id="form-customer-phone"
               label={props?.lang?.label__phone || 'Phone Number'}
               value={props.data.phoneNumber}
               country={props.defualtCountry}
               onlyCountries={
                  props.whitelistFeatures?.['white_label_707']
                     ? ['id']
                     : ['id', 'my', 'sg']
               }
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
