import React, { useContext, useEffect } from 'react';

import Maps from 'src/components/Maps';
import Button from 'src/components/Button';
import TextField from 'src/components/form/TextField';
import { InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import LocationSearch from './LocationSearch';

import FormContext from '../FormContext';

import images from 'src/constants/images';

export default function LocationMaps(props) {
  const [Address, setAddress] = React.useState({
    title: '',
    details: ''
  });
  const [Center, setCenter] = React.useState({
    lng: '',
    lat: ''
  });
  const [maps, setMaps] = React.useState({
    map: null,
    maps: null
  });
  const [LonglatChange, setLonglatChange] = React.useState(false);
  const [isSearching, setSearching] = React.useState(false);
  const [LoadMaps, setLoadMaps] = React.useState(false);
  const [Loading, setLoading] = React.useState(false);
  
  const FORMCONTEXT = useContext(FormContext);

  const handleChange = React.useCallback(({address, center}, isLonglatChange = false) => {
    FORMCONTEXT.fnCheckServiceLocation(center);
    if (isLonglatChange) {
      setLonglatChange(true);
    }
    setCenter({
      lat: center.lat,
      lng: center.lng
    });
    setAddress(address);
  }, [FORMCONTEXT]);

  const handleConfirm = React.useCallback(() => {
    FORMCONTEXT.fnChangeMaps(Address, Center);
    props.toggleModal && props.toggleModal();
  }, [FORMCONTEXT, Address, Center]);

  useEffect(() => {
    const { locationAddress } = FORMCONTEXT?.orderDetails;
    const { formInfoData } = FORMCONTEXT;
    if (formInfoData?.lat && formInfoData?.lng && locationAddress?.title && locationAddress?.details) {
      setAddress({
        title: locationAddress?.title,
        details: locationAddress?.details,
      });
      setCenter({
        lat: formInfoData?.lat,
        lng: formInfoData?.lng
      });
    }
    setLoadMaps(true);
  }, []);

  return (
    <div className={`flex flex-col h-full relative ${isSearching && 'justify-end'}`}>
      {LoadMaps && (
        <section className={`${isSearching && 'absolute inset-0'}`} style={{height: '65%'}} >
          {isSearching && (
            <div className="absolute inset-0 w-full z-10" style={{height: '65%'}} />
          )}
          <Maps
            value={{
              lat: Center.lat,
              lng: Center.lng
            }}
            longlatChange={LonglatChange}
            setLonglatChange={setLonglatChange}
            postCode={FORMCONTEXT?.formInfoData?.postcode}
            countryName={FORMCONTEXT?.countryName}
            onLoading={(status) => setLoading(status)}
            setMaps={setMaps}
            handleChange={handleChange}
          />
        </section>
      )}
      {isSearching ? (
        <section
          className="flex flex-col p-4 justify-end bg-white z-10"
          style={{height: '80%'}}
        >
          <LocationSearch
            maps={maps}
            center={Center}
            handleChange={handleChange}
            toggleSearch={() => setSearching(!isSearching)}
          />
        </section>
      ) : (
        <section className="flex flex-col p-4 " style={{height: '35%'}}>
          <div>
            <TextField
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onClick={() => setSearching(!isSearching)}
            />
          </div>
          <div className="flex flex-1 items-center">
            <img style={{width: '24px'}} src={images.pin} />
            {
              (Loading || FORMCONTEXT.isLoadService) ? (
                <div className="mx-auto w-4/5">
                  <div className="loading block w-3/5 h-5 mb-1"></div>
                  <div className="loading h-8"></div>
                </div>
              ) : (
                <div className="flex flex-col mx-auto w-4/5">
                  {Address.details ? (
                    <>
                      <h3 className="font-medium">
                        {Address.title}
                      </h3>
                      <div className="overflow-ellipsis overflow-hidden break-words" style={{maxHeight: '4rem'}}>
                        {Address.details}
                      </div>
                    </>
                  ) : (
                    'Choose Location'
                  )}
                </div>
              )
            }
          </div>
          {
            (Address.details && !FORMCONTEXT.isAvailableService && !FORMCONTEXT.isLoadService && !Loading) && (
              <div className="text-red-600 py-2">
                {'No courier service available'}
              </div>
            )
          }
          <div className="">
            <Button
              disabled={!Address.details || !FORMCONTEXT.isAvailableService || FORMCONTEXT.isLoadService || Loading}
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}