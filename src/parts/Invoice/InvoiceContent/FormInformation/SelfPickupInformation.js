import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { Button } from '@material-ui/core';
import { Schedule, Phone, HomeOutlined, InfoOutlined } from '@material-ui/icons';

export default function SelfPickupInformation({
  selfPickupInfo,
  isLoading,
  lang,
}) {
  return (
    <div className="my-2 border border-solid border-gray-200 rounded-lg">
      <div className="mx-4 my-6">
        <div className="mb-8 font-bold">
          {lang?.text__pickup_information || 'Pickup Information'}
        </div>
        {isLoading ? (
          <>
            {Array(3)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="flex flex-wrap mb-6"
                >
                  {/* <div className="w-auto px-4">
                    <div className="w-6 h-6 loading"></div>
                  </div> */}
                  <div className="flex-1 px-4">
                    <div className="loading h-4 w-32 mr-auto mb-2"></div>
                    <div className="loading block h-4 w-30 mr-auto"></div>
                  </div>
                </div>
              ))}
          </>
        ) : (
          <>
            <div className="flex mb-6">
              <div className="mr-4">
                <HomeOutlined fontSize="small" />
              </div>
              <div>
                <div className="mb-2 font-bold">
                  {lang?.text__address || 'Address'}:
                </div>
                <div className="mb-3">{selfPickupInfo?.address || '-'}</div>
                <div>
                  <Button href={selfPickupInfo?.mapsLink} target="_blank" variant="outlined">
                    {lang?.text__open_maps || 'Open Google Maps'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex mb-6">
              <div className="mr-4">
                <Schedule fontSize="small" />
              </div>
              <div>
                <div className="mb-2 font-bold">
                  {lang?.text__time_open || 'Time Open'}:
                </div>
                <div>{selfPickupInfo?.timeOpen || '-'}</div>
              </div>
            </div>
            <div className="flex mb-6">
              <div className="mr-4">
                <Schedule fontSize="small" />
              </div>
              <div>
                <div className="mb-2 font-bold">
                  {lang?.text__day_open || 'Day Open'}:
                </div>
                <div>{selfPickupInfo?.dayOpen || '-'}</div>
              </div>
            </div>
            <div className="flex mb-6">
              <div className="mr-4">
                <Phone fontSize="small" />
              </div>
              <div>
                <div className="mb-2 font-bold">
                  {lang?.text__phone || 'Phone'}:
                </div>
                <div>{selfPickupInfo?.phone || '-'}</div>
              </div>
            </div>
            <div className="flex mb-6">
              <div className="mr-4">
                <InfoOutlined fontSize="small" />
              </div>
              <div>
                <div className="mb-2 font-bold">
                  {lang?.text__note || 'Note'}:
                </div>
                <div>{selfPickupInfo?.note || '-'}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}