import { useEffect, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import { listMemberships } from "../../../services/membershipService";
import { useApplication } from "@/stores/applicationStore";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const useOrgChoice = () => {
  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const { switchIntoOrganisation, unFreezImsForLoading, freezImsForLoading } =
    useApplication();
  const history = useHistory();
  useEffect(() => {
    async function prepare() {
      try {
        setLoadingMemberships(true);
        const membershipRes = await listMemberships();
        setMemberships(membershipRes.data?.details?.memberships);
      } catch (err) {
        imsLogger(err);
        /**
         * we are sending them o login packe in case of error
         */
      }
      setLoadingMemberships(false);
    }
    // prepare();
  }, []);
  async function hanldeSelect(membership) {
    freezImsForLoading("Signing in...");
    try {
      await switchIntoOrganisation(membership?.organization?._id);
      unFreezImsForLoading();
      if (
        !membership?.organization?.isCustomer &&
        !membership?.organization?.isPartner
      ) {
        return history.push("/auth/onboard/flow-selection");
      }
      if (membership?.organization?.isCustomer) {
        return history.push("/");
      }
      if (membership?.organization?.isPartner) {
        return history.push("/partner/partnership-dashboard");
      }
    } catch (err) {
      imsLogger(err);
      /**
       * we are sending them o login packe in case of error
       */
      unFreezImsForLoading();
    }
  }
  return { loadingMemberships, memberships, hanldeSelect };
};
export default useOrgChoice;
