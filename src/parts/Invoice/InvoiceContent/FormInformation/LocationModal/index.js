import React, { useContext } from 'react';

import Modal from 'src/components/Modal';
import TextField from 'src/components/form/TextField';
import LocationMaps from './LocationMaps';
import FormContext from '../FormContext';

import { ArrowBack, LocationOn } from '@material-ui/icons';
import { InputAdornment } from '@material-ui/core';

export default function LocationModals(props) {
  const { lang } = props;
  const FORMCONTEXT = useContext(FormContext);
  return (
    <>
      <Modal
        content={(toggleModal) => (
          <div
            className="fixed inset-0 bg-white mx-auto"
            style={{
              minWidth: '300px',
              maxWidth: '375px'
            }}
          >
              <div className="flex flex-col h-full">
                <div
                  className="relative p-4 flex items-center text-lg"
                >
                  <ArrowBack
                    className="mr-2"
                    onClick={toggleModal}
                    style={{ cursor: 'pointer' }}
                  />
                  <span className="truncate">
                    {lang?.text__choose_location || 'Choose Location'}
                  </span>
                </div>
                <div className="h-full">
                  <LocationMaps
                    lang={lang}
                    toggleModal={toggleModal}
                  />
                </div>
              </div>
          </div>
        )}
    >
      {(toggleModal) => (
        <TextField
          name="customer_location"
          label={lang?.label__customer_location || 'Customer Location'}
          multiline
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            ),
          }}
          placeholder={lang?.placeholder__choose_location|| 'Click to choose location'}
          value={FORMCONTEXT?.orderDetails?.locationAddress?.details}
          onClick={toggleModal}
        />
      )}
      </Modal>
    </>
  )
}