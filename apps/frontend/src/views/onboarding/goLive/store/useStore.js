import { useContext, useState } from "react";
import * as organisationService from "../../../../services/organizationService";
import NotificationContext from "@/contexts/notificationContext";
import useError from "@/hooks/error";
import { useApplication } from "@/stores/applicationStore";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function useStore(config) {
  const { tokenPair, freezImsForLoading, unFreezImsForLoading } =
    useApplication();
  const history = useHistory();
  const notify = useContext(NotificationContext);
  const { handleError } = useError();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [licenses, setLicenses] = useState(null);
  const [goinglive, setgoinglive] = useState(false);

  function chosePaymentMethod(method) {
    setPaymentMethod(method);
  }
  function updateLicenses(d) {
    setLicenses(d);
    goLive(d);
  }
  async function goLive(d) {
    try {
      setgoinglive(true);
      freezImsForLoading("Preparing your iMS...");
      const { data } = await organisationService.goLive(
        tokenPair?.accessTokenData?.user?.organizationId,
        {
          ...d,
        }
      );
      notify(data.message, "success");
      unFreezImsForLoading();
      if (data.paymentSession) window.location.replace(data.paymentSession.url);
      return history.push("/auth/preparation-screen");
    } catch (ex) {
      handleError(ex);
      unFreezImsForLoading();
    }
    setgoinglive(false);
  }
  return {
    chosePaymentMethod,
    updateLicenses,
    goinglive,
    paymentMethod,
    organization: {
      ...licenses,
    },
  };
}
