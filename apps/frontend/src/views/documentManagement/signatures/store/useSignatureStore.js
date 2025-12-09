import useProcessingControl from "@/hooks/useProcessingControl";
import { useContext, useEffect, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "./actions";
import * as documentManagmentApi from "@/services/documentManagement/index";
import NotificationContext from "@/contexts/notificationContext";
import useQuery from "@/hooks/useQuery";
import { getCurrentSessionData } from "@/services/authService";
export default function useSignatureStore(config) {
  const [signatures, setSignatures] = useState([]);
  const notify = useContext(NotificationContext);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const signaturesQueryUtils = useQuery({
    required: {
      value: {
        user: {
          internalRef: getCurrentSessionData()?.user?._id || null,
        },
      },
    },
  });
  // handler functions & api hits based on requirement...
  async function _loadSignatures(query = "") {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SIGNATURES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagmentApi.getSignatures({
        query,
      });
      setSignatures(data.usersForSignature);
      _dispatch({
        [USER_ACTIONS.LOAD_SIGNATURES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.LOAD_SIGNATURES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function loadMoreSignatures() {}
  useEffect(() => {
    _loadSignatures(signaturesQueryUtils.getQuery());
  }, [signaturesQueryUtils.query]);
  return {
    signatures,
  };
}
