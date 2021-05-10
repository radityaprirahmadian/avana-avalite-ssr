import PhoneInput from 'react-phone-input-2';

export default (props) => (
   <PhoneInput
      onlyCountries={['id', 'my', 'sg']}
      country="my"
      {...props}
      style={{
         marginTop: '16px',
         marginBottom: '8px',
         width: '100%',
         ...props.style
      }}
      inputProps={{
         ...props.inputProps,
         style: {
            width: '100%',
            ...props.inputProps?.style,
         }
      }}
   />
)
