import NotificationContext from "@/contexts/notificationContext";
import axios from "axios";
import { useContext } from "react";

const useAPIError = () => {
  function isAPIError(err) {
    return axios.isAxiosError(err);
  }
  let notify = useContext(NotificationContext);
  function hanldeAPIError(err) {
    /** we only allowd netword of api realted error here */
    if (axios.isAxiosError(err)) {
      let statusCode = err.response?.status;
      /** here we have set up the priority levels of messages */
      let message =
        err.response?.data.details?.description ||
        err.response?.data.message ||
        err.message;
      /** 4xx errors need to be shown to users. */
      if (statusCode >= 400 && statusCode <= 499) {
        return notify(message, "danger");
      }
      if (statusCode >= 500 && statusCode <= 599) {
        if (process.env.NODE_ENV === "development") {
          return notify(message, "danger");
        } else {
          return notify(
            "Unexpected server error occured. Please contact support for help at support@imssystems.tech",
            "danger"
          );
        }
      }
    }
    /**
     * if code reaches here it means an UI or frontend related error.
     * we only show toast in development mode for better development experience.
     */
    if (process.env.NODE_ENV === "development") {
      return notify(
        "Unknown error detected in API Error handler: " + err.message,
        "danger"
      );
    }
  }
  return {
    isAPIError,
    hanldeAPIError,
  };
};
export default useAPIError;
