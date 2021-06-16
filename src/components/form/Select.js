import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Select,
  FormControl,
  InputLabel
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';

import { Input } from './TextField';

const FormController = withStyles((theme) => ({
  root: {
    width: '100%',
  },
  input: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  }
}))(FormControl)

const Label = withStyles(() => ({
  root: {
    // paddingBottom: '0.5rem',
    marginBottom: '0.5px',
    transform: 'none',
    fontSize: '14px',
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: '#000',
    '&$error': {
      color: '#f44336 !important'
    },
    '&$focused': {
      color: '#000',
    },
  },
  shrink: {
    transform: 'none!important',
    // fontSize: '16px',
  },
  focused: {},
  error:{}
}))(InputLabel)

const SelectInput = withStyles(() => ({

}))(Select)

export default function Selects({
  label,
  value,
  onChange,
  ...props
}) {
  return (
    <FormController margin="normal" variant="outlined">
      <Label>{label}</Label>
      <SelectInput
        native
        margin="dense"
        label={label}
        value={value}
        onChange={onChange}
        input={<Input/>}
        IconComponent={() => (
          <KeyboardArrowDown fontSize="small" style={{ pointerEvents: 'none', position:'absolute', right:'0', paddingRight:'15px' }}/>
        )}
        {...props}
      >
        {props.children}
      </SelectInput>
    </FormController>
  )
}