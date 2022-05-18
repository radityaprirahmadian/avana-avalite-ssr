import React from 'react';

import {
  withStyles,
} from '@material-ui/core/styles';
import { FormControl, InputAdornment, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core';

const FormController = withStyles(() => ({
  root: {
    width: '100%',
  },
}))(FormControl)

export const Input = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '&$error $notchedOutline': {
      borderColor: '#f44336 !important',
    },
    '&$focused $notchedOutline': {
      borderColor: '#000',
      borderWidth: '1px'
    },
    '&$multiline $textarea': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    fontSize: '14px',
  },
  inputMarginDense: {
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  multiline: {},
  focused: {},
  error: {},
  notchedOutline: {}
}))(OutlinedInput)

const Label = withStyles(() => ({
  root: {
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
  },
  focused: {},
  error:{}
}))(InputLabel)

export default function Text({label, onClick, endIcon, ...props}) {
  const isError = props.statusInput === 1 || props.statusInput === 2
  return (
    <div
      style={{
        margin: '1rem 0 0',
        // cursor: props.onClick ? 'pointer' : 'unset'
      }}
    >
      <FormController
        variant="outlined"
        error={(props.isRequired && isError) || props.error}
        onClick={() => {
          !!onClick && onClick()
        }}
        style={{
          cursor: onClick ? 'pointer' : 'unset',
        }}
      >
        {
          label && (
            <Label {...props.InputLabelProps} shrink htmlFor={props.id}>{label}{props.isRequired && (<span className="text-red-5">*</span>)}</Label>
          )
        }
        <Input
          {...props.InputProps}
          // ref={props.ref}
          type={props.type}
          label={props.label}
          id={props.id}
          name={props.name}
          aria-describedby={'helper'+props.id}
          defaultValue={props.defaultValue}
          value={props.value}
          // {...(props.value ? {value: props.value} : {})}
          size={props.size}
          onChange={props.onChange}
          margin="dense"
          fullWidth
          required={props.isRequired}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          autoComplete={props.autoComplete}
          inputRef={props.inputRef}
          {...endIcon ? {endAdornment:(
            <InputAdornment position="end">
              {endIcon}
            </InputAdornment>
          )}: {}}
          style={{
            ...props.style
          }}
          inputProps={{
            ...props.inputProps,
            style: {
              cursor: onClick ? 'pointer' : 'unset'
            }
          }}
        />
        <FormHelperText id={`helper-${props.id || props.label}`} style={{fontSize:'12px'}}>
          {((props.isRequired &&
            isError) || props.error) &&
            (props.labelError || 'This field is required')
          }
        </FormHelperText>
      </FormController>
    </div>
  )
}