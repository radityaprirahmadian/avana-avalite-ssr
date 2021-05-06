import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from './TextField';
import Spinner from '../Spinner';
export default (props) => (
   <Autocomplete
      {...props}
      autoComplete
      renderInput={(params) => (
         <TextField
         {...params}
         {...props.renderInput}
         InputProps={{
            ...params.InputProps,
            ...props.renderInput?.InputProps,
            endAdornment: (
               <React.Fragment>
               {
                  props.loading &&
                     <Spinner
                     size={ 0.25}
                     style={{
                        flex: 'unset',
                        justifyContent: 'flex-start'
                     }}
                     />
               }
               {params.InputProps?.endAdornment}
               </React.Fragment>
            ),
         }}
         />
      )}
   />
)