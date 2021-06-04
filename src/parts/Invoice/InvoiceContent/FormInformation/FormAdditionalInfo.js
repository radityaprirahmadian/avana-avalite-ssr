import React from 'react';
import TextField from 'src/components/form/TextField';

export default function FormAdditionalInfo({
   lang,
   additionalInfoForm,
   formInfoData,
   formInfoStatus,
   fnChange
}) {

  return (
    <>
      { !!additionalInfoForm.length && (
        <>
          <div className="text-base mt-6 mb-2">
            {lang?.text__additional_info || 'Additional Info'}
          </div>
          {
            additionalInfoForm.map((formAdditional) => (
                <TextField
                  name={`custom_${formAdditional.checkout_custom_field_id}`}
                  label={
                    `${formAdditional.label} ${!!formAdditional.is_required === false ? `(${lang?.label__optional || 'optional'})` : ''}`
                  }
                  value={formInfoData[`custom_${formAdditional.checkout_custom_field_id}`]}
                  key={`custom_${formAdditional.checkout_custom_field_id}`}
                  isRequired={!!formAdditional.is_required}
                  statusInput={formInfoStatus[`custom_${formAdditional.checkout_custom_field_id}`]}
                  onChange={fnChange}
                />
            ))
          }
        </>
      )}
    </>
  )
}
