import React from 'react';

import PhoneInput from 'react-phone-input-2';

export default function PhoneNumber(props) {
  const { country, value, onChange } = props;

  const phonePlaceholder = 'Label Phone'

  return (
    <div className="relative mt-2">
      <div className="phone-label">{phonePlaceholder}{props.required && (<span style={{color:'red'}}>*</span>)}</div>
      <PhoneInput
         specialLabel=""
        country={country}
        value={value}
        onlyCountries={['id', 'my', 'sg']}
        onChange={onChange}
      />
    </div>
  )
}



// import PhoneInput from 'react-phone-input-2';

// export default (props) => (
//    <PhoneInput
//       onlyCountries={['id', 'my', 'sg']}
//       country="my"
//       {...props}
//       style={{
//          marginTop: '16px',
//          marginBottom: '8px',
//          width: '100%',
//          ...props.style
//       }}
//       inputProps={{
//          ...props.inputProps,
//          style: {
//             width: '100%',
//             ...props.inputProps?.style,
//          }
//       }}
//    />
// )
