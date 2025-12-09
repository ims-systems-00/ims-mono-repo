import { useEffect } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { imsLogger } from "@/services/loggerService";
import { useApplication } from "@/stores/applicationStore";
import { listInvitations } from "../../../services/invitationsService";
import { listPartnerships } from "../../../services/partnershipProgramService";
import { listMemberships } from "../../../services/membershipService";

const useSystemPreparation = () => {
  const history = useHistory();
  const location = useLocation();
  let query = new URLSearchParams(location.search);
  const { refreshCache, currentUserData } = useApplication();
  useEffect(() => {
    async function prepare() {
      try {
        const [refreshCacheRes, membershipRes, partnershipRes, invitationsRes] =
          await Promise.all([
            refreshCache(),
            listMemberships(),
            listPartnerships(),
            listInvitations(),
          ]);
        /**
         * following algorithm is basewd on priority.
         * - if not varified ? send them to resend verification page
         * - if no organisation & no partnership & some inivitation found ? send them to accept invitation page.
         * - if no organisation & no partnership ? send them to configuration flow selection page.
         * - if organisation found ? send them to choose organisation page. -> dashboard
         * - if partnership found ? send them to partnerhsip programe page.
         */
        if (refreshCacheRes.emailVerified.status !== "varified") {
          return history.push("/auth/resend-account-verification");
        }
        if (query.get("redirect")) {
          window.location.href = query.get("redirect");
        }
        if (
          !membershipRes.data?.details?.memberships?.length &&
          !partnershipRes.data?.details?.partnerships?.length &&
          invitationsRes.data?.details?.invitations?.length
        ) {
          return history.push(
            "/auth/onboard/accept-invitaion/" +
              invitationsRes.data?.details?.invitations[0].token
          );
        }
        if (
          !membershipRes.data?.details?.memberships?.length &&
          !partnershipRes.data?.details?.partnerships?.length
        ) {
          return history.push("/auth/onboard/organisation");
        }
        if (membershipRes.data?.details?.memberships?.length) {
          // const isCustomer = membershipRes.data?.details?.memberships?.find(
          //   (m) => m.organization?.isCustomer
          // );
          // const isPartner = partnershipRes.data?.details?.partnerships?.length;
          // if (isCustomer || isPartner)
          //   return history.push("/auth/organisation-selection");
          // if (!isCustomer && !isPartner)
          //   return history.push("/auth/onboard/organisation");
          // if (isPartner) {
          //   return history.push("/partner/partnership-dashboard");
          // }
          return history.push("/auth/organisation-selection");
        }
        return history.push("/auth/users/" + currentUserData?._id);
      } catch (err) {
        imsLogger(err);
        /**
         * we are sending them o login packe in case of error
         */
        return history.push("/auth/login");
      }
    }
    prepare();
  }, []);
  return {};
};
export default useSystemPreparation;
