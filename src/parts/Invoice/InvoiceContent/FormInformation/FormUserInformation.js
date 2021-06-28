import TextField from 'src/components/form/TextField';
import AutoComplete from 'src/components/form/AutoComplete';
import PhoneInput from 'src/components/form/PhoneInput';
import Select from 'src/components/form/Select';
import InputList from 'src/components/form/InputList';

import LocationModal from './LocationModal';
import SelfPickupInformation from './SelfPickupInformation';

import writeLocalization from 'src/helpers/localization';

import checkCourierSameDay from 'src/helpers/checkCourierSameDay';

export default function FormUserInformation({
   lang,
   COUNTRIES,
   STATES,
   CITIES,
   COURIER,
   SERVICES,
   SELFPICKUP,
   formInfoData,
   formInfoStatus,
   shippingMethod,
   locationAddress,
   isShippingSelfPickup,
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
         labelError={lang?.text__invalid_email || 'Please type valid email'}
      />
      {
         COUNTRIES && (<>
            <TextField
               name="address1"
               label={lang?.label__address_1 || 'Address 1'}
               value={formInfoData.address1}
               onChange={fnChange}
               isRequired
               multiline
               rowsMax={2}
               statusInput={formInfoStatus.address1}
            />
            <TextField
               name="address2"
               label={lang?.label__address_2 || 'Address 2 (optional)'}
               value={formInfoData.address2}
               onChange={fnChange}
               multiline
               rowsMax={2}
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
               isRequired
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
                  <InputList
                     isSearch
                     labelSearch={lang?.label_search || 'Search'}
                     errorSearch={writeLocalization(
                        lang?.text__not_found || 'The [0] you are looking for was not found',
                        [lang?.label__state || 'State']
                     )}
                     isRequired
                     options={STATES.data}
                     value={formInfoData.state}
                     optionLabel={(option) => option?.name}
                     valueKey={(option) => option?.state_id}
                     loading={STATES.status === 'loading'}
                     onOpen={() => STATES.data.length === 0 ? fnGetStates() : null}
                     label={lang?.label__state || 'State'}
                     placeholder={lang?.placeholder__state || 'Select State'}
                     onChange={fnChangeState}
                  />
               </>)
            }
            {
               formInfoData.state && (<>
               {String(formInfoData.country) === '100' ? (
                  <InputList
                     isSearch
                     limit={20}
                     labelSearch={lang?.label_search || 'Search'}
                     errorSearch={writeLocalization(
                        lang?.text__not_found || 'The [0] you are looking for was not found',
                        [lang?.label__city || 'City']
                     )}
                     isRequired
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
               ) : (
                  <TextField
                     name="city"
                     label={lang?.label__city || 'City'}
                     value={formInfoData.city}
                     onChange={(event) => fnChangeCity(event.target.value)}
                     isRequired
                     statusInput={formInfoStatus.city}
                  />
               )}
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
            {(formInfoData.state &&
               formInfoData.postcode) && (<>
                  <AutoComplete
                     name="shippingCourierName"
                     onOpen={() => COURIER.data?.length === 0 && fnGetCouriers}
                     getOptionLabel={(option) => option?.name || ''}
                     loading={COURIER.status === 'loading'}
                     disabled={COURIER.status === 'loading'}
                     options={COURIER.data}
                     value={COURIER.selected}
                     renderInput={{
                        name: "shippingCourierName_input",
                        isRequired: true,
                        statusInput: formInfoStatus.shippingCourierName,
                        InputProps:{
                           placeholder: (lang?.placeholder__courier || 'Select Courier'),
                        },
                        label: (lang?.label__courier || 'Courier')
                     }}
                     onChange={fnChangeCourier}
                  />
               </>)
            }
            {(shippingMethod === 'shipper' && !isShippingSelfPickup && formInfoData.shippingCourierName &&
               formInfoData.postcode &&
               checkCourierSameDay(formInfoData.shippingCourierName)) && (
                  <LocationModal
                     lang={lang}
                  />
            )}
            {isShippingSelfPickup && (
               <SelfPickupInformation
                  selfPickupInfo={SELFPICKUP.data}
                  isLoading={SELFPICKUP.status === 'loading'}
                  lang={lang}
               />
            )}
            {formInfoData.shippingCourierName && shippingMethod === 'shipper' && !isShippingSelfPickup &&
               ((checkCourierSameDay(formInfoData.shippingCourierName) && !! locationAddress) || 
               !checkCourierSameDay(formInfoData.shippingCourierName)) && (<>
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
                     label={(lang?.label__insurance || 'Insurance')}
                     onChange={fnChangeInsurance}
                     inputProps= {{
                        name: 'shipperUseInsurance',
                     }}
                     value={formInfoData.shipperUseInsurance}
                  >
                     <option aria-label="None" value={0}>
                        {lang?.option__no || 'No'}
                     </option>
                     <option value={1}>
                        {lang?.option__yes || 'Yes'}
                     </option>
                  </Select>
               </>)
            }
         </>)
      }
    </>
  )
}