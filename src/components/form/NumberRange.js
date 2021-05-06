import React from 'react';
import { target } from 'tailwind.config';

export default function NumberRange(props) {
  const [value, setValue] = React.useState(props.value || null)
  const fnMinus = React.useCallback(
    () => {
      const newValue = Number(value) - 1;
      const newEvent = {
        target: {
          type: 'no_persist',
          name: props?.name,
          value: newValue,
          min: props.min,
          max: props.max
        }
      };
      setValue(newValue);
      fnChange(newEvent);
    },
    [props.fnChange, props.name, props.value, setValue]
  )

  const fnPlus = React.useCallback(
    () => {
      const newValue = Number(value) + 1;
      const newEvent = {
        target: {
          type: 'no_persist',
          name: props?.name,
          value: newValue,
          min: props.min,
          max: props.max
        }
      };
      setValue(newValue);
      fnChange(newEvent);
    },
    [props.fnChange, props.name, props.value, setValue]
  )

  const fnChange = React.useCallback(
    (e) => {
      e.persist && e.persist();
      setValue(e.target.value);
      if (e.target.value !== '') {
        e.target.value = (props.hasOwnProperty('min') && (Number(e.target.value) < Number(props.min))) ?
          props.min :
          (props.hasOwnProperty('max') && (Number(e.target.value) > Number(props.max))) ?
            props.max :
            e.target.value;
        props.fnChange && props.fnChange(e);
        setValue(e.target.value);
      }
    },
    [props.fnChange, setValue]
  )

  return (
    <section className="flex align-center">
      <button
        className="input-number button minus rounded-full bg-red-600 h-5 w-5 text-white focus:outline-none"
        onClick={fnMinus}
      >
      </button>
      <input
        autoComplete="off"
        name={props?.name}
        type="number"
        min={props.min}
        max={props.max}
        className="input-number input text-center border-none"
        style={{
          maxWidth: '2.5rem'
        }}
        onChange={fnChange}
        value={value}
      />
      <button
        className="input-number button plus rounded-full bg-blue-600 h-5 w-5 text-white focus:outline-none"
        onClick={fnPlus}
      >
      </button>
    </section>
  )
}