import { Store } from "react-notifications-component";

const useNotification = () => {
  function notify(msg, type, options) {
    Store.addNotification({
      message: msg,
      type: type,
      insert: "top",
      onRemoval: options?.onRemoval || function () {},
      container: options?.container || "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: options?.duration || 2000,
        onScreen: true,
        pauseOnHover: true,
        showIcon: true,
      },
    });
  }
  return {
    notify,
  };
};

export default useNotification;
