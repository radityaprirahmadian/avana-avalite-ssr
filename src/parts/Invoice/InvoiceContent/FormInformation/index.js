import React, { useContext, useState } from 'react';

import STORAGE from 'src/helpers/localStorage';

import FormAdditionalInfo from './FormAdditionalInfo';
import FormUserInformation from './FormUserInformation';

import orders from 'src/constants/api/orders';
import shipping from 'src/constants/api/shipping';

import calculateHourFromNow from 'src/helpers/calculateHourFromNow';
import { selectCourier } from 'src/helpers/indexCourier';

import MainContext from 'src/parts/Context';
import FormContext from './FormContext';
import Localization from 'src/configs/lang/invoice/form-information';

let fetchCityTimeout = null;

export default function FormInformation({
   COUNTRIES,
   STATES,
   CITIES,
   COURIER,
   SERVICES,
   SELFPICKUP,
   formInfoData,
   formInfoStatus,
   orderDetails,
   meta,
   productsOrdered,
   additionalInfoForm,
   updateFormInfoData,
   updateFormInfoStatus,
   setCountries,
   setStates,
   setCities,
   setCourier,
   setService,
   setSelfPickup,
   fnChange,
   fnUpdateOrderDetails
}) {
   const [isLoadShipping, setIsLoadShipping] = useState(false);
   const MAINCONTEXT = useContext(MainContext);
   const lang = Localization[MAINCONTEXT?.locale];
   
   const fnInitFormsInfo = React.useCallback(() => {
      fnGetCountries()
   }, [])

   const fnGetCountries = React.useCallback(() => {
      setCountries((prevState) => ({
         ...prevState,
         status: 'loading'
      }))
      if (meta?.shippable_countries) {
         const defaultCountry = meta.shippable_countries[meta.shippable_countries.findIndex(country => 
            (country.country_id === MAINCONTEXT.shop?.country?.id) || (country.name === formInfoData.country)
         )];
         setCountries((prevState) => ({
            ...prevState,
            data: meta?.shippable_countries,
            selected: defaultCountry,
            status: 'ok'
         }));
         fnGetStates(defaultCountry?.country_id);
      }
   }, [meta])

   const fnChangeCountry = React.useCallback((eventValue, newValue) => {
      const changeValue = typeof (eventValue) !== 'string' ? eventValue.toString() : eventValue;
      fnChange({
         target: {
            type: 'no_persist',
            name: 'country',
            value: changeValue,
         },
      }, () => {
         fnGetCities();
      });
      setCourier((prevState) => ({
         ...prevState,
         selected: null,
      }));
      updateFormInfoData({
         state: '',
         city: '',
         lat: '',
         lng: '',
         shippingCourierName: null,
         shipperRateId: null,
         shipperUseInsurance: null
      });
      updateFormInfoStatus({
         state: 0,
         city: 0,
         shippingCourierName: 0,
         shipperRateId: 0,
         shipperUseInsurance: 4
      });
      fnUpdateOrderDetails((prevState) => ({
         ...prevState,
         selectedCountry: COUNTRIES.data?.find((el) => el.country_id === changeValue),
      }));
      fnGetStates(eventValue);
      fnGetCities(eventValue);
   }, [fnChange]);

   const fnChangeState = React.useCallback((eventValue) => {
      const changeValue = typeof (eventValue) !== 'string' ? eventValue.toString() : eventValue;
      fnChange({
         target: {
            type: 'no_persist',
            name: 'state',
            value: changeValue,
         },
      });
      setCourier((prevState) => ({
         ...prevState,
         selected: null,
      }));
      updateFormInfoData({
         city: '',
         lat: '',
         lng: '',
         shippingCourierName: null,
         shipperRateId: null,
         shipperUseInsurance: null
      });
      updateFormInfoStatus({
         city: 0,
         shippingCourierName: 0,
         shipperRateId: 0,
         shipperUseInsurance: 4
      });
      fnUpdateOrderDetails((prevState) => ({
         ...prevState,
         selectedState: STATES.data?.find((el) => el.country_id === changeValue),
      }));
      fnCheckShippingMethod(eventValue);
   }, [fnChange,updateFormInfoData, updateFormInfoStatus]);

   const fnCheckShippingMethod = React.useCallback((stateId = null) => {
      if (stateId) {
         setIsLoadShipping(true);
         shipping.getRateByState({ stateId: stateId})
            .then((res) => {
               fnUpdateOrderDetails((prevState) => ({
                  ...prevState,
                  shippingMethod: res.courier_code,
                  shippingCourier: res.type === 'courier'
                     ? selectCourier(res.courier_code)
                     : { name: 'Courier' },
                  isAbleSelfPickup: !!res.is_self_pickup,
               }))
               setIsLoadShipping(false);
            })
            .catch((err) => {
               setIsLoadShipping(false);
            })
      }
   }, [shipping]);

   const fnGetCities = React.useCallback((countryId = formInfoData.country) => {
      let localStorageData = STORAGE.get('persist');
      const lastFetched = calculateHourFromNow(
         new Date(localStorageData?.[countryId]?.cities_fetched_at)
      );

      if ((countryId
            &&
               CITIES.status !== 'loading' &&
               !localStorageData?.[countryId]?.cities) ||
            lastFetched > 3
         ) {
         setCities((prevState) => ({
            ...prevState,
            status: 'loading',
         }));
         shipping.getDestination({ params: { keyword: '', limit: 999999} })
            .then((res) => {
               let cities = Object.values(res.data)
                  .map((city) => {
                     const [main, sub] = city.city_name.includes(',')
                        ? city.city_name
                           .trim()
                           .toLowerCase()
                           .replace(/,/, ', ')
                           .replace(/\w\S*/g, (w) =>
                              w.replace(/^\w/, (c) => c.toUpperCase())
                           )
                           .split(',')
                           .reverse()
                        : [
                           city.city_name
                              .trim()
                              .toLowerCase()
                              .replace(/\w\S*/g, (w) =>
                                 w.replace(/^\w?/, (c) => c.toUpperCase())
                              ),
                           '',
                           ];

                     return {
                        main: main.trim(),
                        sub: sub.trim(),
                        city_name: city.city_name,
                     };
                  })
                  .sort((a, b) => {
                     if (a.main === b.main || a.main === '' || b.main === '') {
                        return b.sub > a.sub ? -1 : 1;
                     }
                     return a.main > b.main ? 1 : -1;
                  })
                  .map((city) => ({
                     value: city.city_name,
                     label: `${city.main || ''}${city.main && city.sub ? ' - ' : ''}${city.sub || ''}`,
                  }));
               setCities((prevState) => ({
                  ...prevState,
                  data: cities,
                  status: 'ok',
               }));
               STORAGE.set(
                  'persist',
                  {
                     ...localStorageData,
                     [countryId]: {
                        ...localStorageData?.[countryId],
                        cities,
                        cities_fetched_at: new Date(),
                      },
                  }
               );
            })
            // .catch((err) => {

            // });
      } else {
         setCities((prevState) => ({
            ...prevState,
            data: localStorageData?.[countryId]?.cities ?? [],
            status: 'ok',
         }));
      }
   }, [shipping]);

   const fnChangeCity = React.useCallback((eventValue) => {
      fnChange({
         target: {
            type: 'no_persist',
            name: 'city',
            value: eventValue || '',
         },
      });
      setCourier((prevState) => ({
         ...prevState,
         data: [],
         selected: null,
         status: 'loading',
      }));
      if (fetchCityTimeout) {
         clearTimeout(fetchCityTimeout);
      }

      updateFormInfoData({
         lat: null,
         lng: null,
         shippingCourierName: null,
         shipperRateId: null,
         shipperUseInsurance: null
      })

      if (orderDetails.shippingMethod === 'shipper') {
         updateFormInfoStatus({
            shippingCourierName: 0,
            shipperRateId: 0,
            shipperUseInsurance: 4
         });
      } else {
         updateFormInfoStatus({
            shippingCourierName: 0,
            shipperRateId: 4,
            shipperUseInsurance: 4
         });
      }
      fnGetCouriers(eventValue);
   }, [fnChange, orderDetails]);

   const fnChangeCourier = React.useCallback((event, newValue) => {
      fnChange({
         target: {
            type: 'no_persist',
            name: 'shippingCourierName',
            value: newValue?.name ?? '',
         },
      });

      if (newValue?.isSelfPickup) {
         fnGetSelfPickupInfo();
      }

      setCourier((prevState) => ({
         ...prevState,
         selected: newValue,
      }));
      updateFormInfoData({
         lat: null,
         lng: null,
         shipperRateId: null,
         shipperUseInsurance: null
      })
      updateFormInfoStatus({
         shipperRateId: orderDetails.shippingMethod === 'shipper' && !newValue?.isSelfPickup
            ? 0
            : 4,
         shipperUseInsurance: 4,
      });
      fnUpdateOrderDetails((prevState) => ({
         ...prevState,
         isShippingSelfPickup: !!newValue?.isSelfPickup
      }))

      if (newValue &&
         orderDetails.shippingMethod === 'shipper' &&
         newValue?.name
      ) {
         fnGetServices(newValue?.name);
      }
   }, [fnChange, orderDetails]);

   const fnChangeService = React.useCallback((event, newValue) => {
      const eventValue = newValue?.rate_id ?? ''
      const changeValue = typeof (eventValue) !== 'string' ? eventValue.toString() : eventValue;
      fnChange({
         target: {
            type: 'no_persist',
            name: 'shipperRateId',
            value: changeValue,
         },
      });
      setService((prevState) => ({
         ...prevState,
         selected: newValue,
      }));
   }, [fnChange]);

   const fnChangeInsurance = React.useCallback((event) => {
      fnChange(event);
   }, [fnChange]);

   const fnGetStates = React.useCallback((countryId = null) => {
      let localStorageData = STORAGE.get('persist');
      const lastFetched = calculateHourFromNow(
         new Date(localStorageData?.[countryId]?.states_fetched_at)
      );

      if ((countryId &&
               STATES.status !== 'loading' &&
               !localStorageData?.[countryId]?.states) ||
            lastFetched > 3
         ) {
         setStates((prevState) => ({
            ...prevState,
            status: 'loading',
         }));

         orders.meta({ params: { country_id: countryId } })
            .then((res) => {
               setStates((prevState) => ({
                  ...prevState,
                  data: res.shippable_states,
                  status: 'ok',
               }));

               STORAGE.set(
                  'persist',
                  {
                     ...localStorageData,
                     [countryId]: {
                        ...localStorageData[countryId],
                        states: res.shippable_states,
                        states_fetched_at: new Date(),
                     },
                  }
               );
            })
            .catch((err) => {

            });
      } else {
         setStates((prevState) => ({
            ...prevState,
            data: localStorageData?.[countryId]?.states ?? [],
            status: 'ok',
         }));
      }
   }, [orders]);

   const fnGetServices = React.useCallback((courier = null, longlat = null) => {
      setService((prevState) => ({
         ...prevState,
         status: 'loading',
      }));
      const products = Object.values(productsOrdered);
      const subTotal = products.reduce(
         (acc, { price, quantity }) => acc + price * quantity,
         0
       );
   
      const totalTax = products.reduce(
         (acc, { price, quantity, tax }) => acc + ((price * quantity) / 100) * tax,
         0
      );

      const totalPrice = subTotal + totalTax;

      shipping.getServices({
         params: {
            courier_name: courier ?? formInfoData.shippingCourierName,
            country_id: formInfoData.country,
            state_id: formInfoData.state,
            city: formInfoData.city,
            total_quantity: products.reduce(
               (acc, current) => acc + current.quantity,
               0
             ),
            weight: products.reduce(
               (acc, current) => acc + current.quantity * current.weight,
               0
            ),
            total_weight: products.reduce(
               (acc, current) => acc + current.quantity * current.weight,
               0
            ),
            is_self_pickup: 0,
            total_product: totalPrice,
            ...(longlat
                  ? {
                     customer_long: longlat.lng,
                     customer_lat: longlat.lat
                  }
                  : {}
               )
         }
      })
         .then((res) => {
            setService((prevState) => ({
               ...prevState,
               data: res.data,
               status: 'ok',
            }));
         })
         .catch((err) => {
            setService((prevState) => ({
               ...prevState,
               data: [],
               status: 'error',
            }));
         });
   }, [shipping, formInfoData]);

   const fnCheckServiceLocation = React.useCallback((longlat) => {
      fnGetServices(COURIER?.selected?.name, longlat);
   }, [COURIER]);

   const fnChangeMaps = React.useCallback((address, longlat) => {
      fnUpdateOrderDetails((prevState) => ({
         ...prevState,
         locationAddress: address,
      }));

      updateFormInfoData({
         lng: longlat.lng,
         lat: longlat.lat,
      });

      // if (newValue) {
      //    fnGetServices(COURIER?.selected?.name, longlat);
      // }
   }, [fnChange]);

   const fnGetCouriers = React.useCallback((city) => {
      const selfPickupData = { name: 'Self Pickup', isSelfPickup: true };
      setCourier((prevState) => ({
         ...prevState,
         data: [],
         status: 'loading',
      }));
      const products = Object.values(productsOrdered);
      const subTotal = products.reduce(
         (acc, { price, quantity }) => acc + price * quantity,
         0
       );
   
      const totalTax = products.reduce(
         (acc, { price, quantity, tax }) => acc + ((price * quantity) / 100) * tax,
         0
      );

      const totalPrice = subTotal + totalTax;
      if (orderDetails.shippingMethod === 'shipper') {
         shipping.getCouriers({
            params: {
               country_id: formInfoData.country,
               state_id: formInfoData.state,
               city: city || formInfoData.city,
               total_quantity: products.reduce(
                  (acc, current) => acc + current.quantity,
                  0
               ),
               total_weight: products.reduce(
                  (acc, current) => acc + current.quantity * current.weight,
                  0
               ),
               is_self_pickup: 0,
               total_product: totalPrice
             }
         })
            .then((res) => {
               let couriersList = res.data?.filter((courier) => {
                  return courier.name !== 'Alfatrex' && courier.name !== 'Lion Parcel' && courier.name !== 'Tiki';
               });
               if (orderDetails.isAbleSelfPickup) {
                  couriersList.push(selfPickupData)
               }
               setCourier((prevState) => ({
                  ...prevState,
                  data: couriersList,
                  status: 'ok',
               }));
            })
      } else {
         setCourier((prevState) => ({
            ...prevState,
            data: [
               { name: orderDetails.shippingCourier?.name },
               ...(orderDetails.isAbleSelfPickup ? [selfPickupData] : [])
            ],
            status: 'ok',
         }));
         if (!orderDetails.isAbleSelfPickup) {
            // updateFormInfoData({
            //    shippingCourierName: orderDetails.shippingCourier?.name,
            // });
            // updateFormInfoStatus({
            //    shippingCourierName: 3,
            // });
            // setCourier((prevState) => ({
            //    ...prevState,
            //    selected: { name: orderDetails.shippingCourier?.name },
            // }));
            fnChangeCourier('', { name: orderDetails.shippingCourier?.name })
         }
      }
   }, [shipping, orderDetails, formInfoData])

   const fnGetSelfPickupInfo = React.useCallback(() => {
      setSelfPickup((prevState) => ({
         ...prevState,
         data: {},
         status: 'loading'
      }));
      shipping.getSelfPickupInfo()
         .then((res) => {
            const openHours = res.open_hour.split(":");
            const closeHours = res.close_hour.split(":");
            const {
               address1: shopAddress1,
               city: shopCity,
               state: shopStateId,
               country_id: shopCountryId,
               postcode: shopPostcode,
               phone: shopPhone,
               latitude,
               longitude
            } = res?.self_pickup_address || {};
            const shopCountry = COUNTRIES.data[COUNTRIES.data.findIndex(
               (country) => country.country_id === Number(shopCountryId)
            )];
            const shopState = STATES.data[STATES.data.findIndex(
               (state) => state.state_id === Number(shopStateId)
            )];
            const dayList = {
               0: lang?.text__monday || 'Monday',
               1: lang?.text__tuesday || 'Tuesday',
               2: lang?.text__wednesday || 'Wednesday',
               3: lang?.text__thursday || 'Thursday',
               4: lang?.text__friday || 'Friday',
               5: lang?.text__saturday || 'Saturday',
               6: lang?.text__sunday || 'Sunday',
            };
            const shopDaysOpen = JSON.parse(res.open_days);
            const isWeekends = shopDaysOpen.every((day) => [5, 6].includes(day)) && shopDaysOpen.length === 2;
            const isWeekdays = shopDaysOpen.every((day) => [0, 1, 2, 3, 4].includes(day)) && shopDaysOpen.length === 5;
            const daysOpen = shopDaysOpen.length === 7
               ? lang?.text__everydays || 'Every days'
               : isWeekends
               ? lang?.text__weekends || 'Weekends'
               : isWeekdays
               ? lang?.text__weekdays || 'Weekdays'
               : shopDaysOpen.map((day) => dayList[day]).join(', ')

            setSelfPickup((prevState) => ({
               ...prevState,
               data: {
                  address: `${shopAddress1}, ${shopCity}, ${shopState?.name || ''}, ${shopCountry?.name || ''} ${shopPostcode}`,
                  timeOpen: `${openHours[0]}:${openHours[1]} - ${closeHours[0]}:${closeHours[1]}`,
                  dayOpen: daysOpen,
                  phone: shopPhone,
                  mapsLink: `http://www.google.com/maps/place/${latitude},${longitude}`,
                  note: res.self_pickup_note
               },
               status: 'ok'
            }));
         })
         .catch((err) => {
            setSelfPickup((prevState) => ({
               ...prevState,
               data: {},
               error: err,
               status: 'error'
            }));
         })
   }, [shipping]);

   React.useEffect(() => {
      fnInitFormsInfo();
   }, [fnInitFormsInfo]);


   const CONTEXT = {
      formInfoData,
      orderDetails,
      countryName: MAINCONTEXT.shop?.country.name,
      isAvailableService: !!SERVICES.data.length || SERVICES.status !== 'error',
      isLoadService: SERVICES.status === 'loading',
      fnCheckServiceLocation,
      fnChangeMaps
   }
   
   return (
      <div
         className="flex flex-col"
      >
         <FormContext.Provider value={CONTEXT}>
            <FormUserInformation
               lang={lang}
               COUNTRIES={COUNTRIES}
               STATES={STATES}
               CITIES={CITIES}
               COURIER={COURIER}
               SERVICES={SERVICES}
               SELFPICKUP={SELFPICKUP}
               formInfoData={formInfoData}
               formInfoStatus={formInfoStatus}
               shippingMethod={orderDetails.shippingMethod}
               locationAddress={orderDetails.locationAddress}
               isAbleSelfPickup={orderDetails.isAbleSelfPickup}
               isShippingSelfPickup={orderDetails.isShippingSelfPickup}
               fnGetStates={fnGetStates}
               fnGetCities={fnGetCities}
               fnGetCouriers={fnGetCouriers}
               fnGetServices={fnGetServices}
               fnChangeCountry={fnChangeCountry}
               fnChangeState={fnChangeState}
               fnChangeCity={fnChangeCity}
               fnChangeCourier={fnChangeCourier}
               fnChangeService={fnChangeService}
               fnChangeInsurance={fnChangeInsurance}
               fnChange={fnChange}
            />
            <FormAdditionalInfo
               lang={lang}
               additionalInfoForm={additionalInfoForm}
               formInfoData={formInfoData}
               formInfoStatus={formInfoStatus}
               fnChange={fnChange}
            />
         </FormContext.Provider>
      </div>
   )
}