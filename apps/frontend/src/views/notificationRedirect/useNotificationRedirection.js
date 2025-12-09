import useAccess from "@/hooks/useAccess";
import useLinks from "@/hooks/useLinks";
import { useLocation, useHistory } from "react-router-dom";
import { imsLogger } from "@/services/loggerService";
import { getNotification } from "@/services/notificationService";
const QUERY_CHECKS = {
  NOIFICATION: "notification",
  USER: "user",
};

export default function useNotificationRedirection() {
  const location = useLocation();
  const history = useHistory();
  const { getLink } = useLinks();
  const { entityAccessControl } = useAccess();
  async function _notificationRedirect(id) {
    try {
      if (!id) throw new Error("notification id is required");
      id = id.toString();
      const {
        data: { notification },
      } = await getNotification(id);
      let link = getLink({
        screenIdentifier: notification.screenIdentifier,
        params: notification.params,
      });
      history.push(link);
    } catch (ex) {
      imsLogger(ex);
      history.push("/");
    }
  }
  function redirect() {
    let query = new URLSearchParams(location.search);
    if (query.get(QUERY_CHECKS.NOIFICATION)) {
      if (
        !entityAccessControl({
          users: [query.get(QUERY_CHECKS.USER)],
          effect: "Allow",
        })
      ) {
        history.push("/");
        return;
      }
      return _notificationRedirect(query.get(QUERY_CHECKS.NOIFICATION));
    }
    history.push("/");
  }
  return { redirect };
}
