import { toast } from "react-toastify";

import Localization from 'src/configs/lang/errors';
import { getCurrentLang } from 'src/helpers/localization';

export default function errorHandler(error) {
  if (error) {
    let message;
    if (error.response) {
      if (error.response.status === 500)
        message = "Something went terribly wrong";
      else message = error.response.data.message;

      if (error?.config?.toastErrorEnabled &&
        typeof message === "string") toast.error(message);
      return Promise.reject(error);
    } else {
      const lang = Localization?.[getCurrentLang?.()];
      toast.error(lang?.text__network_error || 'Network Error');

      return Promise.reject(error);
    }
  }
}
