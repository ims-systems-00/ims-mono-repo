import useError from "@/hooks/error";
import { acceptInvitation } from "../../../services/invitationsService";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useApplication } from "@/stores/applicationStore";

export default function useAcceptInvitation() {
  const { handleError } = useError();
  const { tokenPair } = useApplication();
  const [accepting, setAccepting] = useState(false);
  const history = useHistory();
  async function accept(token) {
    try {
      setAccepting(true);
      await acceptInvitation(token);
      history.push("/auth/preparation-screen");
    } catch (err) {
      handleError(err);
    }
    setAccepting(false);
  }
  useEffect(() => {
    if (!tokenPair)
      return history.push("/auth/login?redirect=" + window.location.href);
  }, []);
  return { accepting, accept };
}
