import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'

export default (props) => {
   let isError = props.statusInput === 1 || props.statusInput === 2
   return (
      <TextField
         margin="normal"
         variant="outlined"
         fullWidth
         inputProps={{
            autoComplete: 'no',
         }}
         InputLabelProps={{ shrink: true }}
         error={props.isRequired && isError}
         {...props}
         helperText={
            props.isRequired &&
            isError &&
            (props.labelError || 'This field is required')
         }
      />
   )
}
