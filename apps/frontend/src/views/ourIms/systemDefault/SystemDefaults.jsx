import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useContext, useEffect } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import { getNotifications } from "@/services/notificationService";
import {
  getIncidentResolution,
  getReportSubscriber,
  getSystemDates,
} from "@/services/organizationService";
import Organisation from "../organisation/Organisation";
import USER_ACTIONS from "./actions.js";
import PushNotificationForm from "./PushNotificationForm";
import PushNotificationTable from "./PushNotificationTable";
import ResolutionForm from "./ResolutionForm";
import SubscriptionForm from "./SubscriptionForm";
import SubscriptionTable from "./SubscriptionTable";
import SystemDateForm from "./SystemDateForm";

const SystemDefaults = (props) => {
  let { authUser } = useAccess();
  let [subscribers, setSubscribers] = React.useState([]);
  let [systemDate, setSystemDate] = React.useState({});
  let [resolutionTime, setResolutionTime] = React.useState({});
  let [pushNotifications, setPushNotifications] = React.useState([]);
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_SUBSCRIBERS },
    { action: USER_ACTIONS.LOAD_DATA },
    { action: USER_ACTIONS.LOAD_NOTIFICATIONS },
    { action: USER_ACTIONS.DELETE_SUBSCRIBER },
    { action: USER_ACTIONS.ADD_SUBSCRIBER },
    { action: USER_ACTIONS.UPDATE_RESOLUTION },
    { action: USER_ACTIONS.UPDATE_SYSTEMDATES },
    { action: USER_ACTIONS.ADD_NOTIFICATION },
  ]);
  let {
    query: subscriberQuery,
    toolState: subscriberToolState,
    getQuery: getSubscriberQuery,
    updatePagination: updateSubscriberPagination,
    ...subscribersQueryHandlers
  } = useQuery();

  let {
    query: notificationQuery,
    toolState: notificationToolState,
    getQuery: getNotificationQuery,
    updatePagination: updateNotificationPagination,
    ...notificationsQueyHandlers
  } = useQuery({
    required: {
      value: {
        userId: getCurrentSessionData().user?._id,
        push: true,
        actor: true,
      },
    },
  });

  let notify = useContext(NotificationContext);
  const addToTable = (subscriber) =>
    setSubscribers((prevSubscribers) => [subscriber, ...prevSubscribers]);

  const fetchPushNotifications = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_NOTIFICATIONS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getNotifications({
        query: `${qStr}`,
      });
      setPushNotifications(data.notifications);
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
      imsLogger("SystemDefaults", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  const fetchSubscribers = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getReportSubscriber({
        query: `${qStr}`,
      });
      setSubscribers(data.reportSubscriptions);
      dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SystemDefaults", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch({
          [USER_ACTIONS.LOAD_DATA]: { status: true, error: false, id: null },
        });
        let [systemDateRsesponse, resolutionTimeResponse] = await Promise.all([
          getSystemDates(),
          getIncidentResolution(),
        ]);
        setSystemDate(systemDateRsesponse.data.systemDate);
        setResolutionTime(resolutionTimeResponse.data.resolutionTime);
        dispatch({
          [USER_ACTIONS.LOAD_DATA]: { status: false, error: false, id: null },
        });
      } catch (error) {
        dispatch({
          [USER_ACTIONS.LOAD_DATA]: { status: false, error: true, id: null },
        });
        imsLogger(error.response);
      }
    }
    fetchData();
    fetchSubscribers(getSubscriberQuery());
    fetchPushNotifications(getNotificationQuery());
  }, [subscriberQuery, notificationQuery]);

  const addToPushNotificationTable = (pushNotification) =>
    setPushNotifications((prevNotifications) => [
      pushNotification,
      ...prevNotifications,
    ]);
  return (
    <div className="content">
      <Panels
        defaultPanel={"My organisation"}
        navLinks={
          authUser({
            service: IMS_SERVICES.SYSTEM_DEFAULTS,
            action: ACTIONS.READ,
            effect: EFFECTS.ALLOW,
          })
            ? [
                "My organisation",
                "System date",
                "Report intervals",
                "Incident resolution",
                "Push notification",
              ]
            : ["My organisation"]
        }
      >
        <Panel panelId="My organisation">
          <Organisation />
        </Panel>
        <Panel panelId="System date">
          {processing[USER_ACTIONS.LOAD_DATA].status ? (
            <Loading />
          ) : (
            <SystemDateForm
              {...props}
              systemDate={systemDate}
              dispatch={dispatch}
              processing={processing}
            />
          )}
        </Panel>
        <Panel panelId="Report intervals">
          {processing[USER_ACTIONS.LOAD_DATA].status && <Loading />}
          <>
            <SubscriptionForm
              addToTable={addToTable}
              dataTable={subscribers}
              processing={processing}
              dispatch={dispatch}
              setSubscribers={setSubscribers}
              pathname={props.match.url}
            />
            <SubscriptionTable
              dataTable={subscribers}
              processing={processing}
              dispatch={dispatch}
              setSubscribers={setSubscribers}
              pathname={props.match.url}
              onPageChange={fetchSubscribers}
              pagination={subscriberToolState.pagination}
              {...subscribersQueryHandlers}
            />
          </>
        </Panel>
        <Panel panelId="Incident resolution">
          {processing[USER_ACTIONS.LOAD_DATA].status ? (
            <Loading />
          ) : (
            <ResolutionForm
              {...props}
              resolutionTime={resolutionTime}
              dispatch={dispatch}
              processing={processing}
            />
          )}
        </Panel>
        <Panel panelId="Push notification">
          <PushNotificationForm
            processing={processing}
            dispatch={dispatch}
            addToPushNotificationTable={addToPushNotificationTable}
          />
          <PushNotificationTable
            dataTable={pushNotifications}
            processing={processing}
            onPageChange={fetchPushNotifications}
            pagination={notificationToolState.pagination}
            {...notificationsQueyHandlers}
          />
        </Panel>
      </Panels>
    </div>
  );
};
export default SystemDefaults;
