import { useState, useEffect, useContext } from "react";
import routes from "@/routes";
import { getCurrentUserInfo } from "@/services/userServices";
import socketConnection from "@/services/webSocketService";
import { AlertContext } from "@/contexts/AlertContext";
import {
  getNotifications,
  updateBulkPopupStatus,
  UpdateNotificationReadStatus,
  updateNotificationSentStatus,
} from "@/services/notificationService";
import moment from "moment";
import useAccess from "@/hooks/useAccess";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import useProcessingControl from "@/hooks/useProcessingControl";
import USER_ACTIONS from "../actions";
import { SOUNDS, playSound } from "@/utils/soundPlayer";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import { useApplication } from "@/stores/applicationStore";
const useNotifications = () => {
  let { alerts } = useContext(AlertContext);
  let [notifications, setNotifications] = useState([]);
  let { authUser } = useAccess(getCurrentUserInfo());
  let { socketSubscriptionDetails } = useApplication();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
    size: 10,
    totalPages: 1,
    totalResults: 10,
  });
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_NOTIFICATIONS },
    { action: USER_ACTIONS.UPDATE_READ_STATUS },
    { action: USER_ACTIONS.UPDATE_POPUP_STATUS },
    { action: USER_ACTIONS.UPDATE_SENT_STATUS },
  ]);
  let cleanUp = () => {
    setNotifications([]);
    setPagination({
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      size: 10,
      totalPages: 1,
      totalResults: 10,
    });
  };
  let updateNotifications = async (page = 1, size = 10) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_NOTIFICATIONS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getNotifications({
        query: `page=${page}&size=${size}&userId=${
          getCurrentSessionData().user._id
        }`,
      });
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...data.notifications,
      ]);
      setPagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_NOTIFICATIONS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_NOTIFICATIONS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("useNotifications", ex);
    }
  };
  async function _updateNotificationPupUpStatus() {
    try {
      await updateBulkPopupStatus();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.popUp.status === "unread"
            ? { ...notification, popUp: { status: "read" } }
            : notification
        )
      );
    } catch (ex) {
      imsLogger(ex.response, ex);
    }
  }
  function _startListening() {
    let events = { new_notification: "new-notification" };
    if (
      getCurrentSessionData() &&
      socketConnection.isSet() &&
      !socketConnection?.getSocket()?._callbacks["$" + events.new_notification]
    ) {
      socketConnection?.getSocket()?.on(events.new_notification, (_data) => {
        setNotifications((prevNotifications) => [_data, ...prevNotifications]);
        /** todo: turn on this code when we know how to filter important and not important */
        // playSound(SOUNDS.NOTIFICATION);
      });
    }
  }
  async function _alertImportantNotifications(popUpNotifications) {
    if (!popUpNotifications.length) return;
    for (let [index, notification] of popUpNotifications.entries()) {
      await alerts.popUpAlerts(
        `${notification.msg} [${index + 1}/${popUpNotifications.length}]`,
        { icon: notification.icon }
      );
    }
    _updateNotificationPupUpStatus();
  }
  useEffect(() => {
    updateNotifications(pagination.currentPage);
  }, []);
  useEffect(() => {
    _startListening();
  }, [socketSubscriptionDetails]);
  useEffect(() => {
    _alertImportantNotifications(
      notifications.filter(
        (notification) => notification.popUp.status === "unread"
      )
    );
  }, [notifications]);

  function _getPath(routes, screenIdentifier) {
    let path = "Not found";
    for (let _route of routes) {
      if (_route.screenIdentifier === screenIdentifier)
        if (authUser(_route.accessPolicy)) return _route.path;
      if (_route.collapse) path = _getPath(_route.views, screenIdentifier);
      if (path === "Not found") continue;
      else break;
    }
    return path;
  }
  const getLink = ({ screenIdentifier, params }) => {
    let path = _getPath(routes, screenIdentifier);
    if (path === "Not found") return null;
    return `/admin${path
      .split("/")
      .map((splitedPath) =>
        splitedPath[0] === ":" ? params[splitedPath.substring(1)] : splitedPath
      )
      .join("/")}`;
  };
  function getNewNotificationCounts() {
    return notifications.reduce(
      (total, notification) =>
        (total += notification.sent.status === "unsent" ? 1 : 0),
      0
    );
  }
  async function updateSentStatus() {
    try {
      await updateNotificationSentStatus();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.sent.status === "unsent"
            ? { ...notification, sent: { status: "sent" } }
            : notification
        )
      );
    } catch (ex) {
      imsLogger("useNotifications", ex);
    }
  }
  async function updateReadStatus(id) {
    try {
      await UpdateNotificationReadStatus(id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: { status: "read" } }
            : notification
        )
      );
    } catch (ex) {
      imsLogger("useNotifications", ex);
    }
  }
  // function timePassedSinceCreated(date) {
  //   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  //   let interval = 0;
  //   interval = seconds / 86400;
  //   if (interval > 1 && interval < 2)
  //     return "Yesterday at " + moment(date).format("HH:mm");
  //   interval = seconds / 3600;
  //   if (interval >= 2 && interval <= 24)
  //     return Math.floor(interval) + " hours ago";
  //   if (interval >= 1 && interval < 2) return "an hour ago";
  //   interval = seconds / 60;
  //   if (interval >= 2 && interval <= 60)
  //     return Math.floor(interval) + " minutes ago";
  //   if (interval >= 1 && interval < 2)
  //     return Math.floor(interval) + " minute ago";
  //   if ((seconds >= 0 && seconds <= 60) || seconds < 0) return "Just now";
  //   return moment(date).format("DD/MM/YYYY HH:mm");
  // }
  return {
    processing,
    notifications,
    pagination,
    cleanUp,
    updateNotifications,
    getLink,
    updateSentStatus,
    updateReadStatus,
    getNewNotificationCounts,
    // timePassedSinceCreated,
  };
};

export default useNotifications;
