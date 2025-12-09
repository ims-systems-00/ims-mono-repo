import NotificationContext from "@/contexts/notificationContext";
import useError from "@/hooks/error";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as partnershipService from "../../../../services/partnershipProgramService";

export default function useStore(config) {
  const notify = useContext(NotificationContext);
  const { handleError } = useError();
  const [basicInfo, setBasicInfo] = useState(null);
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [applyingnow, setapplyingnow] = useState(false);
  const history = useHistory();
  function updateBasicInfo(d) {
    setBasicInfo(d);
  }
  function updateApplicationInfo(d) {
    setApplicationInfo(d);
    createPartnership({ ...basicInfo, ...d });
  }
  async function createPartnership(d) {
    try {
      setapplyingnow(true);
      const { data } = await partnershipService.createPartnership({
        ...d,
      });
      notify(data.message, "success");
      return history.push("/auth/preparation-screen");
    } catch (ex) {
      handleError(ex);
    }
    setapplyingnow(false);
  }
  return {
    updateBasicInfo,
    updateApplicationInfo,
    applyingnow,
    organization: {
      ...basicInfo,
      ...applicationInfo,
    },
  };
}
