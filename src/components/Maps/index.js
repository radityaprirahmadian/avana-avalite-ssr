import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import googleMaps from 'src/constants/api/googleMaps';
import images from 'src/constants/images';

import { MyLocation } from '@material-ui/icons';

let fetchLocTimeout = null

export default function Maps(props) {
  const [mapState, setMapState] = React.useState({
    map: null,
    maps: null,
    defaultCenter: {
      lat: 3.116167,
      lng: 101.584953,
    },
    center: {
      lat: null,
      lng: null,
    },
    address: {
      title: '',
      details: ''
    },
    zoom: 11,
    status: {
      isInit: true,
      isLoaded: false,
      isLoadingApi: false,
    }
  })
  
  const handleChoosenPosition = React.useCallback((center, isZoom = false) => {
    props?.onLoading && props.onLoading(true);
    setMapState((prevState) => ({
      ...prevState,
      status: {
        ...prevState.status,
        isLoadingApi: true
      },
    }));
    googleMaps.getAddressByLongLat({ params: { lat: center.lat, lng: center.lng }})
      .then((data) => {
        props?.onLoading && props.onLoading(false);
        const address = {
          title: data?.results[0]?.address_components?.reduce((accumulator, currentValue) => {
              if (currentValue?.types[0] === 'street_number') {
                return `${accumulator} No.${currentValue.short_name}`;
              } else if (currentValue.types[0] === 'route') {
                return `${currentValue.short_name} ${accumulator}`;
              } else {
                return accumulator
              }
            }, ''),
          details: data?.results[0]?.formatted_address
        };

        props.onDrag && props.onDrag(false);
        props?.handleChange && props.handleChange({
            address: address,
            center: center
          });

        setMapState((prevState) => ({
          ...prevState,
          address: address,
          center: { lat: center.lat, lng: center.lng },
          ...(isZoom && { zoom: 16 }),
          status: {
            ...prevState.status,
            isLoadingApi: false
          },
        }));
      });
  }, [props]);

  const fnChangeMaps = React.useCallback(({center}) => {
    if (!mapState.status.isInit) {
      if (fetchLocTimeout) {
        clearTimeout(fetchLocTimeout);
      }
      fetchLocTimeout = setTimeout(handleChoosenPosition(center), 1000);
    } else {
      setMapState((prevState) => ({
        ...prevState,
        status: {
          ...prevState.status,
          isInit: false
        },
      }))
    }
  }, [mapState.status])

  const fnLocationClick = React.useCallback(
    () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            handleChoosenPosition({ lat: position.coords.latitude, lng: position.coords.longitude }, true);
          },
          () => {
            // toggleSnackBar('Please enable location access settings') 
          }
        )
      } else {
        // toggleSnackBar('Geolocation is not available for this device')
      }
    },
    [handleChoosenPosition]
  );

  const fnMapsLoaded = React.useCallback(({map, maps}) => {
    setMapState((prevState) => ({
      ...prevState,
      map: map,
      maps: maps,
      status: {
        ...prevState.status,
        isLoaded: true
      }
    }));
    props.setMaps && props.setMaps({
      map: map,
      maps: maps,
    });
  }, [props]);

  const setPropsValue = React.useCallback(() => {
    setMapState((prevState) => ({
      ...prevState,
      zoom: 16,
      center: {
        lat: props.value.lat,
        lng: props.value.lng,
      },
      status: {
        ...prevState.status,
        isInit: true,
      },
    }));
  }, [props]);

  const getInitData = React.useCallback(() => {
    if (props.value.lat && props.value.lng) {
      setPropsValue();
      return;
    }
    googleMaps.getLongLatByPostCode({
      params: {
        address: `${props?.postCode} ${props?.countryName}`
      }
    }).then((data) => {
      const { results } = data;
      setMapState((prevState) => ({
        ...prevState,
        center: {
          lng: results?.[0]?.geometry?.location?.lng,
          lat: results?.[0]?.geometry?.location?.lat
        },
        status: {
          ...prevState.status,
          isInit: true
        },
      }));
    });
  }, [props, googleMaps]);

  useEffect(() => {
    if (props.longlatChange && props.value.lat && props.value.lng) {
      setPropsValue();
      props.setLonglatChange(false);
    }
  }, [props.longlatChange, props.value.lat, props.value.lng]);

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <section className="w-full h-full relative">
      <GoogleMapReact
        bootstrapURLKeys={{
          key:
            process.env.NODE_ENV === 'production' //GMAPS_API_KEY called when build only
              ? process.env.NEXT_PUBLIC_GOOGLE_MAPS
              : process.env.NEXT_PUBLIC_GOOGLE_MAPS,
          libraries: ['places']
        }}
        center={mapState.center}
        zoom={mapState.zoom}
        draggable
        options={{
          fullscreenControl: false,
          zoomControl: false,
          gestureHandling: 'greedy'
        }}
        // onDrag={onDragMaps}
        // onDragEnd={onDragEndMaps}
        onGoogleApiLoaded={fnMapsLoaded}
        yesIWantToUseGoogleMapApiInternals
        onChange={fnChangeMaps}
      />
      <img
        style={{
          width: '28px',
          transform: 'translate(-50%, -100%)',
          top: '50%',
          left: '50%',
          position: 'absolute',
          textAlign: 'center'
        }}
        className="select-none"
        src={images.pin}
        alt="Pin Point"
      />
      <button
        className={`focus:outline-none rounded-full bg-white shadow-md absolute bottom-0
          right-0 mb-4 mr-2 p-2 transition ease-in-out duration-300 hover:bg-gray-300`
        }
        onClick={fnLocationClick}
      >
        <MyLocation fontSize="small" />
      </button>
    </section>
  )
}