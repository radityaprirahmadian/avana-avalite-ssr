import React, { useContext } from 'react';

import Modal from 'src/components/Modal';
import TextField from 'src/components/form/TextField';
import LocationMaps from './LocationMaps';
import FormContext from '../FormContext';

import { ArrowBack, LocationOn } from '@material-ui/icons';
import { InputAdornment } from '@material-ui/core';

export default function LocationModals() {
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
                    Choose Location
                  </span>
                </div>
                <div className="h-full">
                  <LocationMaps
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
          label={'Customer Location'}
          multiline
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            ),
          }}
          placeholder="Click to choose location"
          value={FORMCONTEXT?.orderDetails?.locationAddress?.details}
          onClick={toggleModal}
        />
      )}
      </Modal>
    </>
  )
}