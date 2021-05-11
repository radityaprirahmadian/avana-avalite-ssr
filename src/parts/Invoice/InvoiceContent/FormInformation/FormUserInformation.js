import TextField from 'src/components/form/TextField';
import AutoComplete from 'src/components/form/AutoComplete';
import PhoneInput from 'src/components/form/PhoneInput';
import Select from 'src/components/form/Select';
import LocationModal from './LocationModal';
import InputList from 'src/components/form/InputList';

import writeLocalization from 'src/helpers/localization';

import checkCourierSameDay from 'src/helpers/checkCourierSameDay';

export default function FormUserInformation({
   lang,
   COUNTRIES,
   STATES,
   CITIES,
   COURIER,
   SERVICES,
   formInfoData,
   formInfoStatus,
   shippingMethod,
   locationAddress,
   fnGetStates,
   fnGetCities,
   fnGetCouriers,
   fnGetServices,
   fnChangeCountry,
   fnChangeState,
   fnChangeCity,
   fnChangeCourier,
   fnChangeService,
   fnChangeInsurance,
   fnChange,
}) {
  return (
    <>
      <TextField
         name="name"
         label={lang?.label__full_name || 'Full Name'}
         value={formInfoData.name}
         onChange={fnChange}
         isRequired
         statusInput={formInfoStatus.name}
      />
      <PhoneInput
         name="phoneNumber"
         country="my"
         specialLabel={lang?.label__phone || 'Phone Number'}
         value={formInfoData.phoneNumber}
         onChange={(phone) =>
            fnChange({
               target: {
                  id: 'order',
                  name: 'phoneNumber',
                  value: phone,
                  type: 'no_persist',
               },
            })
         }
      />
      <TextField
         name="email"
         label={lang?.label__email || 'Email'}
         type="email"
         value={formInfoData.email}
         onChange={fnChange}
         isRequired
         statusInput={formInfoStatus.email}
         labelError="Please type valid email"
      />
      {
         COUNTRIES && (<>
            <TextField
               name="address1"
               label={lang?.label__address_1 || 'Address 1'}
               value={formInfoData.address1}
               onChange={fnChange}
               isRequired
               statusInput={formInfoStatus.address1}
            />
            <TextField
               name="address2"
               label={lang?.label__address_2 || 'Address 2 (optional)'}
               value={formInfoData.address2}
               onChange={fnChange}
            />
            {/* <AutoComplete
               name="country"
               options={COUNTRIES.data}
               loading={COUNTRIES.status === 'loading'}
               disabled={COUNTRIES.status === 'loading'}
               getOptionLabel={(option) => option?.name ?? ''}
               value={COUNTRIES.selected}
               renderInput={{
                  name: "country_input",
                  isRequired: true,
                  statusInput: formInfoStatus.country,
                  InputProps:{
                     placeholder: (lang?.placeholder__country || 'Select Country'),
                  },
                  label: (lang?.label__country || 'Country')
               }}
               onChange={fnChangeCountry}
            /> */}
            <InputList
               isSearch
               labelSearch={lang?.label_search || 'Search'}
               errorSearch={writeLocalization(
                  lang?.text__not_found || 'The [0] you are looking for was not found',
                  [lang?.label__country || 'Country']
               )}
               options={COUNTRIES.data}
               value={formInfoData.country}
               optionLabel={(option) => option?.name}
               valueKey={(option) => option?.country_id}
               loading={COUNTRIES.status === 'loading'}
               label={lang?.label__country || 'Country'}
               placeholder={lang?.placeholder__country || 'Select Country'}
               onChange={fnChangeCountry}
            />
            {
               formInfoData.country && (<>
                  {/* <AutoComplete
                     name="states"
                     onOpen={STATES.data.length === 0 ? fnGetStates : null}
                     options={STATES.data}
                     loading={STATES.status === 'loading'}
                     disabled={STATES.status === 'loading'}
                     getOptionLabel={(option) => option?.name ?? ''}
                     value={STATES.selected}
                     defaultValue={formInfoStatus.state}
                     renderInput={{
                        name: "state_input",
                        isRequired: true,
                        statusInput: formInfoStatus.state,
                        InputProps:{
                           placeholder: (lang?.placeholder__state || 'Select State'),
                        },
                        label: (lang?.label__state || 'State'),
                     }}
                     onChange={fnChangeState}
                  /> */}
                  <InputList
                     isSearch
                     labelSearch={lang?.label_search || 'Search'}
                     errorSearch={writeLocalization(
                        lang?.text__not_found || 'The [0] you are looking for was not found',
                        [lang?.label__state || 'State']
                     )}
                     options={STATES.data}
                     value={formInfoData.state}
                     optionLabel={(option) => option?.name}
                     valueKey={(option) => option?.state_id}
                     loading={STATES.status === 'loading'}
                     label={lang?.label__state || 'State'}
                     placeholder={lang?.placeholder__state || 'Select State'}
                     onChange={fnChangeState}
                  />
               </>)
            }
            {
               formInfoData.state && (<>
                  {/* <AutoComplete
                     name="city"
                     onOpen={CITIES.data.length === 0 ? () => fnGetCities() : null}
                     options={CITIES.data}
                     loading={CITIES.status === 'loading'}
                     disabled={CITIES.status === 'loading'}
                     getOptionLabel={(option) => option?.label ?? ''}
                     value={CITIES.selected}
                     renderInput={{
                        name: "city_input",
                        isRequired: true,
                        statusInput: formInfoStatus.city,
                        InputProps:{
                           placeholder: (lang?.placeholder__city || 'Select City'),
                        },
                        label: (lang?.label__city || 'City'),
                     }}
                     onChange={fnChangeCity}
                  /> */}
                  <InputList
                     isSearch
                     limit={20}
                     labelSearch={lang?.label_search || 'Search'}
                     errorSearch={writeLocalization(
                        lang?.text__not_found || 'The [0] you are looking for was not found',
                        [lang?.label__city || 'City']
                     )}
                     options={CITIES.data}
                     optionLabel={(option) => option?.label ?? ''}
                     value={formInfoData.city}
                     valueKey={(option) => option?.value}
                     loading={CITIES.status === 'loading'}
                     onOpen={() => CITIES.data.length === 0 ? fnGetCities() : null}
                     label={lang?.label__city || 'City'}
                     placeholder={lang?.placeholder__city || 'Select City'}
                     onChange={fnChangeCity}
                  />
               </>)
            }
            <TextField
               name="postcode"
               label="Post Code"
               value={formInfoData.postcode}
               onChange={fnChange}
               inputProps={{
                  pattern:'^[0-9]*$'
               }}
               isRequired
               statusInput={formInfoStatus.postcode}
            />
            {
               (formInfoData.postcode && shippingMethod === 'shipper') && (<>
                  <AutoComplete
                     name="shipperCourierName"
                     onOpen={() => COURIER.data?.length === 0 && fnGetCouriers}
                     getOptionLabel={(option) => option?.name || ''}
                     loading={COURIER.status === 'loading'}
                     disabled={COURIER.status === 'loading'}
                     options={COURIER.data}
                     value={COURIER.selected}
                     renderInput={{
                        name: "shipperCourierName_input",
                        isRequired: true,
                        statusInput: formInfoStatus.shipperCourierName,
                        InputProps:{
                           placeholder: (lang?.placeholder__courier || 'Select Courier'),
                        },
                        label: (lang?.label__courier || 'Courier')
                     }}
                     onChange={fnChangeCourier}
                  />
               </>)
            }
            {(shippingMethod === 'shipper' && formInfoData.shipperCourierName &&
               formInfoData.postcode &&
               checkCourierSameDay(formInfoData.shipperCourierName)) && (
                  <LocationModal />
            )}
            {formInfoData.shipperCourierName &&
               ((checkCourierSameDay(formInfoData.shipperCourierName) && !! locationAddress) || 
               !checkCourierSameDay(formInfoData.shipperCourierName)) && (<>
                  <AutoComplete
                     name="service"
                     onOpen={() => SERVICES.data.length === 0 && fnGetServices}
                     getOptionLabel={(option) => option.rate_name ?
                        `${option.rate_name} - ${option.finalRate} (Est. ${
                        option.min_day === option.max_day
                           ? `${option.min_day} days`
                           : `${option.min_day} - ${option.max_day} days`
                        })` : ''
                     }
                     value={SERVICES.selected}
                     loading={SERVICES.status === 'loading'}
                     disabled={SERVICES.status === 'loading'}
                     options={SERVICES.data}
                     renderInput={{
                        name: "service_input",
                        isRequired: true,
                        statusInput: formInfoStatus.shipperRateId,
                        InputProps:{
                           placeholder: (lang?.placeholder__services || 'Select Services'),
                        },
                        label: (lang?.label__services || 'Service')
                     }}
                     onChange={fnChangeService}
                  />
               </>)
            }
            {
               formInfoData.shipperRateId && (<>
                  <Select
                     Select={{
                        label: (lang?.label__insurance || 'Insurance'),
                        onChange: fnChangeInsurance,
                        inputProps:{
                           name: 'shipperUseInsurance',
                        }
                     }}
                  >
                     <option aria-label="None" value={0}>
                        No
                     </option>
                     <option value={1}>
                        Yes
                     </option>
                  </Select>
               </>)
            }
         </>)
      }
    </>
  )
}