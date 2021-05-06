import { FormControl, InputLabel, Select } from '@material-ui/core';

export default (props) => (
   <FormControl margin="normal" variant="outlined">
      <InputLabel>{props?.Select.label}</InputLabel>
      <Select
         native
         {...props?.Select}
      >
         { props.children }
      </Select>
   </FormControl>
)