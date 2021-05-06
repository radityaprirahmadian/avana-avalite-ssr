import React, { useEffect, useRef } from 'react';

import TextField from 'src/components/form/TextField';
import { InputAdornment } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import  SearchIcon from '@material-ui/icons/Search';

import images from 'src/constants/images';

let fetchSearchTimeout = null;
export default function LocationMaps(props) {
  const [Search, setSearch] = React.useState({
    data: [],
    input: '',
    status: 'IDLE'
  });
  const searchRef = useRef();

  const handleChange = React.useCallback((e) => {
    e.persist && e.persist();
    
    if (fetchSearchTimeout) {
      clearTimeout(fetchSearchTimeout);
    }

    setSearch((prevState) => ({
      ...prevState,
      input: e.target.value,
      status: 'LOADING'
    }))

    if (props.maps?.maps && props.maps?.map) {
      let service = new props.maps.maps.places.PlacesService(props.maps?.map);
      const center = new props.maps.maps.LatLng(props.Center?.lat, props.Center?.lng);
      fetchSearchTimeout = setTimeout(() => {
        service.findPlaceFromQuery({
          query: e.target.value,
          fields: ['formatted_address', 'name', 'geometry'],
          locationBias: center,
          // radius: '50000',
        }, function (results, status) {
          setSearch((prevState) => ({
            ...prevState,
            data: results,
            status: status
          }))
        })
      }, 2000)
    }
  }, [props, Search]);

  const onClick = React.useCallback((place) => {
    let center = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }
    props?.handleChange && props.handleChange({
      address: {
        title: place.name,
        details: place.formatted_address
      },
      center
    }, true);
    props.toggleSearch & props.toggleSearch();
  }, [props]);

  useEffect(() => {
    searchRef?.current && searchRef.current.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center">
        <ArrowBack
          className="mr-2"
          onClick={props.toggleSearch}
          style={{ cursor: 'pointer' }}
        />
        <TextField
          inputRef={searchRef}
          margin="dense"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={handleChange}
        />
      </div>
      <div
        className="overflow-y-auto"
        style={{height: '80%'}}
      >
        {
          Search.status === 'OK' ? (
              Search.data.map((place, idx) => (
                <div
                  className="border-b border-gray-200 p-4 cursor-pointer"
                  key={idx}
                  onClick={() => {
                    onClick(place)
                  }}
                >
                  <div className="font-medium">{place.name}</div>
                  <div className="">{place.formatted_address}</div>
                </div>
              ))
            ) : Search.status === 'IDLE' ? (
            <div className="p-4">
              Find your location
            </div>) : Search.status === 'LOADING' ? (
            <div className="p-4" style={{display:'flex', flex: '1'}}>
              {/* <Spinner size={1} /> */}
              Loading...
            </div>) : (<div className="p-4">
              Location not found
            </div>
          )}
      </div>
    </div>
  )
}