import { useState, useCallback } from "react";
import validator from "validator";

export default (initialValues) => {
  const [values, setValues] = useState(() => initialValues);

  return [
    values,
    (e) => {
      if (
        Object.keys(values).filter((item) => item === e.target.name).length > 0
      ) {
        let statusUpdate;
        if (e.target.type === "email") {
          statusUpdate = validator.isEmail(e.target.value) ? 3 : 1;
        } else if (e.target.type === "tel") {
          statusUpdate =
            validator.isMobilePhone(e.target.value) &&
            e.target.value.length > 10
              ? 3
              : 1;
        } else if (e.target.type === "select-one") {
          statusUpdate = e.target.value.length > 0 ? 3 : 1;
        } else if (e.target.type === "files") {
          statusUpdate = e.target.value.length > 0 ? 3 : 1;
        } else if (
          //quill text area
          typeof e.target.value === "object" &&
          e.target.value.hasOwnProperty("index") &&
          e.target.value.hasOwnProperty("length")
        ) {
          statusUpdate =
            e.target.value.index > 0 || e.target.value.length > 0 ? 3 : 1;
        } else {
          statusUpdate = e.target.value.length > 0 ? 3 : 1;
        }
        setValues((prev) => ({
          ...prev,
          [e.target.name]: statusUpdate,
        }));
      }
    },
    () => {
      // check field errors
      const newStatus = { ...values };
      let errors = 0;
      Object.keys(values).forEach((m, i) => {
        if (values[m] !== 3) {
          newStatus[m] = 2;
          errors++;
          return false;
        }
        return true;
      });
      setValues(newStatus);
      return errors;
    },
    (payload) => {
      /*
      function hooks should called start with `updateSomething`
      */
      setValues((prev) => ({
        ...prev,
        ...payload,
      }));
    },
  ];
};
