import useAccess from "@/hooks/useAccess";
import { Redirect } from "react-router";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import Sites from "./Sites";

const SiteManagement = (props) => {
  let { authUser, authGlobalAccess } = useAccess();
  return (
    <>
      {authUser({
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW,
      }) && authGlobalAccess() ? (
        <Sites {...props} />
      ) : (
        <Redirect
          to={`/admin/cqc/overviews/undefined/${
            getCurrentSessionData().session.current.group
          }`}
        />
      )}
    </>
  );
};

export default SiteManagement;
