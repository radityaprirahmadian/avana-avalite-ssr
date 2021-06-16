import Autocomplete from '@material-ui/lab/Autocomplete';
import {
   withStyles,
 } from '@material-ui/core/styles';
import { Close, KeyboardArrowDown } from '@material-ui/icons';
import TextField from './TextField';
import Spinner from '../Spinner';

export default (props) => (
   <Autocomplete
      {...props}
      autoComplete
      popupIcon={<KeyboardArrowDown fontSize="small" />}
      closeIcon={<Close fontSize="small" />}
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
                        className="m-0 flex-none justify-start"
                        size={0.25}
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