import { useEffect, useState } from "react";
import socketConnection from "@/services/webSocketService";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";

const useSocket = () => {
  let [socketSubscriptionDetails, setSocketSubscriptionDetails] =
    useState(null);
  function _subscribe() {
    if (socketConnection?.isSet()) {
      imsLogger(
        "Socket connection status:",
        socketConnection?.getSocket()?.connected
      );
    }
    socketConnection?.init();
    socketConnection?.getSocket()?.on("reconnect", (reason) => {
      imsLogger("Socket is reconnecting...", reason);
    });
    socketConnection?.getSocket()?.on("disconnect", (reason) => {
      imsLogger("Socket Disconnected", reason);
    });
    socketConnection?.getSocket()?.on("connect", () => {
      imsLogger("Socket connected");
      if (getCurrentSessionData()) {
        socketConnection?.getSocket()?.emit("subscribe", {
          subscriptionFilter: {
            _id: getCurrentSessionData().user?._id,
            name: getCurrentSessionData().user?.name,
          },
        });
        socketConnection?.getSocket()?.on("subscription-response", (_data) => {
          imsLogger("Socket connection details", _data);
          setSocketSubscriptionDetails(_data);
        });
      }
    });
  }
  useEffect(() => {
    _subscribe();
  }, []);
  return { socketSubscriptionDetails };
};

export default useSocket;
