import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import { useCallback, useContext, useEffect, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import * as userApi from "@/services/userServices";
import USER_ACTIONS from "./actions";
import { useUserManager } from "../../store";
import { deleteMembership } from "../../../../../services/membershipService";
import { getCurrentSessionData } from "@/services/authService";
import { startListening, stopListening } from "@/services/webSocketService";
import { useApplication } from "@/stores/applicationStore";
import useError from "@/hooks/error";

export default function useStore(config) {
  const [alreadyATransferInprogress, setAlreadyATransferInprogress] =
    useState(false);
  const [flaggedData, setFlaggedData] = useState();
  const notify = useContext(NotificationContext);
  const { visitingUser, visitUser } = useUserManager();
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const { handleError } = useError();
  async function deleteUser(payload) {
    try {
      const membership = visitingUser?.membership?.find(
        (m) =>
          m.organization ===
          globalData.tokenPair?.accessTokenData?.user?.organizationId
      );
      _dispatch({
        [USER_ACTIONS.DELETE_USER]: {
          status: false,
          error: false,
          id: null,
        },
      });
      const { data } = await deleteMembership(membership?._id);
      notify(`${visitingUser?.name} deleted successfully`, "success");
      visitUser(null);
      if (typeof config.onDelete === "function") config.onDelete(visitingUser);
      _dispatch({
        [USER_ACTIONS.DELETE_USER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("UserForm", ex.response || ex);
      handleError(ex);
      _dispatch({
        [USER_ACTIONS.DELETE_USER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function transferDataOwnership(payload) {
    if (visitingUser) {
      try {
        _dispatch({
          [USER_ACTIONS.TRANSFER_OWNERSHIP]: {
            status: true,
            error: false,
            id: null,
          },
        });
        let { data } = await userApi.transferDataOwnership(
          visitingUser._id,
          payload
        );
        notify(
          "Data ownership will be transfered to " +
            payload.destinationUser.label,
          "success"
        );
      } catch (err) {
        imsLogger(err, err.message);
        notify(
          err.response?.data?.message ||
            err.message ||
            "Server error occured, please try again later.",
          "danger"
        );
        _dispatch({
          [USER_ACTIONS.TRANSFER_OWNERSHIP]: {
            status: false,
            error: true,
            id: null,
          },
        });
      }
    }
  }
  async function _checkDataOwnership(userId) {
    if (userId) {
      try {
        _dispatch({
          [USER_ACTIONS.CHECK_OWNERSHIP]: {
            status: true,
            error: false,
            id: null,
          },
        });
        const { data } = await userApi.checkDataOwnership(userId);
        /**
         * we are not stopping check process here until a socket event returns
         */
        /**
         * we are setting transfer process to true if alreay in progress found
         */
        if (data.alreadyATransferInprogress)
          _dispatch({
            [USER_ACTIONS.TRANSFER_OWNERSHIP]: {
              status: true,
              error: false,
              id: null,
            },
          });
      } catch (err) {
        imsLogger(err, err.message);
        notify(
          err.response?.data?.message ||
            err.message ||
            "Server error occured, could not check for data ownership.",
          "danger"
        );
        _dispatch({
          [USER_ACTIONS.CHECK_OWNERSHIP]: {
            status: false,
            error: true,
            id: null,
          },
        });
      }
    }
  }
  useEffect(() => {
    if (!processing[USER_ACTIONS.TRANSFER_OWNERSHIP].status) {
      _checkDataOwnership(visitingUser?._id);
    }
  }, [visitingUser, processing[USER_ACTIONS.TRANSFER_OWNERSHIP].status]);
  const globalData = useApplication();
  const _updateOnwershipInformation = useCallback(function (data) {
    imsLogger("recieving data ownership info: ", data);
    _dispatch({
      [USER_ACTIONS.CHECK_OWNERSHIP]: {
        status: false,
        error: false,
        id: null,
      },
    });
    setFlaggedData(data);
  }, []);
  const _updateTransferInformation = useCallback(function (data) {
    imsLogger("recieving data transfer info: ", data);
    _dispatch({
      [USER_ACTIONS.TRANSFER_OWNERSHIP]: {
        status: data.transferProcessRunning,
        error: false,
        id: null,
      },
    });
  }, []);
  useEffect(() => {
    let events = {
      new_data_ownership_info: "new-data-ownership-info",
      new_data_transfer_info: "new-data-transfer-info",
    };
    if (getCurrentSessionData() && globalData?.socketSubscriptionDetails) {
      startListening(
        events.new_data_ownership_info,
        _updateOnwershipInformation
      );
      startListening(events.new_data_transfer_info, _updateTransferInformation);
    }
    return () => {
      stopListening(
        events.new_data_ownership_info,
        _updateOnwershipInformation
      );
      stopListening(events.new_data_transfer_info, _updateTransferInformation);
    };
  }, [globalData?.socketSubscriptionDetails]);
  return {
    flaggedData,
    processing,
    deleteUser,
    transferDataOwnership,
  };
}
