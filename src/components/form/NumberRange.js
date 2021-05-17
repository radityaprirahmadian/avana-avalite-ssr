import React from 'react';

export default function NumberRange(props) {
  const [value, setValue] = React.useState(props.value || null)
  const [lastValue, setLastValue] = React.useState(null)
  const fnMinus = React.useCallback(
    (e) => {
      e.stopPropagation && e.stopPropagation();
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
      fnChange(newEvent);
    },
    [props.fnChange, props.name, props.value, setValue]
  )

  const fnPlus = React.useCallback(
    (e) => {
      e.stopPropagation && e.stopPropagation();
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
      fnChange(newEvent);
    },
    [props.fnChange, props.name, props.value, setValue]
  )

  const fnChangeInput = React.useCallback(
    (e) => {
      e.persist && e.persist();
      if (!e.target.validity.valid) {
        return;
      } else {
        fnChange(e);
      }
    },
    [fnChange, value]
  )

  const fnChange = React.useCallback(
    (e) => {
      e.persist && e.persist();
      setLastValue(value);
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
    [props, setValue, value]
  )

  const fnBlur = React.useCallback(
    (e) => {
      e.persist && e.persist();
      if (e.target.value === '') {
        setValue(lastValue);
      }
    }
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
        pattern="^[0-9]*$"
        onChange={fnChangeInput}
        onClick={(e) => e.stopPropagation && e.stopPropagation()}
        value={value}
      />
      <button
        className={`input-number button plus rounded-full bg-blue-600 h-5 w-5 text-white focus:outline-none
          ${(!!props.max && value < props.max  || !props.max) ? ' visible' : ' invisible'}
        `}
        onClick={(e) => (!!props.max && value < props.max  || !props.max) && fnPlus(e)}
      >
      </button>
    </section>
  )
}