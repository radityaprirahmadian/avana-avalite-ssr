import { useState } from "react";

export default (initialValues) => {
  const [values, setValues] = useState(() => initialValues);

  return [
    values,
    (e) => {
      e.persist && e.persist();
      /* 
      function hooks should called start with `setSomething`
      you can't fake the async behaviour thru setTimeout
      the only solution is to mimmic the old setState like in class component using the next function `updateSomething`
      */
      let value = e.target.value;
      if (e.target.type === "checkbox") value = e.target.checked;

      if (e?.target?.name)
        setValues((prev) => ({
          ...prev,
          [e.target.name]: value,
        }));
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
