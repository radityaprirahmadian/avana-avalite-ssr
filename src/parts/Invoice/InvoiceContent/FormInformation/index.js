import React, { useContext } from 'react';

import STORAGE from 'src/helpers/localStorage';

import FormAdditionalInfo from './FormAdditionalInfo';
import FormUserInformation from './FormUserInformation';

import orders from 'src/constants/api/orders';
import shipping from 'src/constants/api/shipping';

import calculateHourFromNow from 'src/helpers/calculateHourFromNow';

import MainContext from 'src/parts/Context';
import FormContext from './FormContext';
import Localization from 'src/configs/lang/invoice/form-information';

export default function FormInformation({
   COUNTRIES,
   STATES,
   CITIES,
   COURIER,
   SERVICES,
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
   fnChange,
   fnUpdateOrderDetails
}) {
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
      // console.log(event, newValue)
      // const eventValue = newValue?.country_id ?? '';
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
      // setCountries((prevState) => ({
      //    ...prevState,
      //    selected: newValue,
      // }));
      setStates((prevState) => ({
         ...prevState,
         selected: {},
      }));
      updateFormInfoData({
         state: '',
         city: '',
         lat: '',
         lng: ''
      });
      updateFormInfoStatus({
         state: 0,
         city: 0
      });
      fnGetStates(eventValue);
      fnGetCities(eventValue);
   }, [fnChange]);

   const fnChangeState = React.useCallback((eventValue) => {
      // const eventValue = newValue?.state_id ?? '';
      const changeValue = typeof (eventValue) !== 'string' ? eventValue.toString() : eventValue;
      fnChange({
         target: {
            type: 'no_persist',
            name: 'state',
            value: changeValue,
         },
      });
      // setStates((prevState) => ({
      //    ...prevState,
      //    selected: newValue,
      // }));
      updateFormInfoData({
         city: ''
      });
      updateFormInfoStatus({
         city: 0
      });
      fnCheckShippingMethod(eventValue);
   }, [fnChange]);

   const fnCheckShippingMethod = React.useCallback((stateId = null) => {
      if (stateId) {
         shipping.getRateByState({ stateId: stateId})
            .then((res) => {
               fnUpdateOrderDetails((prevState) => ({
                  ...prevState,
                  shippingMethod: res.courier_code
               }))
            })
            .catch((err) => {

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
                     if (a.main === b.main) {
                        return b.sub > a.sub ? -1 : 1;
                     }
                     return a.main > b.main ? 1 : -1;
                  })
                  .map((city) => ({
                     value: city.city_name,
                     label: `${city.main}${city.sub ? ` - ${city.sub}` : ''}`,
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
            value: eventValue ?? '',
         },
      });
      // setCities((prevState) => ({
      //    ...prevState,
      //    selected: newValue,
      // }));
      if (orderDetails.shippingMethod === 'shipper') {
         fnGetCouriers();
         updateFormInfoData({
            lat: null,
            lng: null
         })
         updateFormInfoStatus({
            shipperCourierName: 0,
            shipperRateId: 0,
         });
      } else {
         updateFormInfoStatus({
            shipperCourierName: 4,
            shipperRateId: 4,
         });
      }
   }, [fnChange, orderDetails]);

   const fnChangeCourier = React.useCallback((event, newValue) => {
      fnChange({
         target: {
            type: 'no_persist',
            name: 'shipperCourierName',
            value: newValue?.name ?? '',
         },
      });
      setCourier((prevState) => ({
         ...prevState,
         selected: newValue,
      }));
      updateFormInfoData({
         lat: null,
         lng: null
      })
      if (newValue && orderDetails.shippingMethod === 'shipper'  &&
         formInfoData.shipperCourierName) {
         fnGetServices(newValue?.name)
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
            courier_name: courier ?? formInfoData.shipperCourierName,
            city: formInfoData.city,
            weight: products.reduce(
               (acc, current) => acc + current.quantity * current.weight,
               0
            ),
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

   const fnGetCouriers = React.useCallback(() => {
      setCourier((prevState) => ({
         ...prevState,
         status: 'loading',
      }));
      shipping.getCouriers()
         .then((res) => {
            setCourier((prevState) => ({
               ...prevState,
               data: res.data?.filter((courier) => {
                  return courier.name !== 'Alfatrex' && courier.name !== 'Lion Parcel' && courier.name !== 'Tiki';
               }),
               status: 'ok',
            }));
         })
   }, [shipping])

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
               formInfoData={formInfoData}
               formInfoStatus={formInfoStatus}
               shippingMethod={orderDetails.shippingMethod}
               locationAddress={orderDetails.locationAddress}
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