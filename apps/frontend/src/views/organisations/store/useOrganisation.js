import React from "react";
import NotificationContext from "../../../contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";

import {
  createOrganisation,
  getOrganizations,
  getOrganization,
  updateOrganisation,
  getLicenses,
  getUsersByOrganization,
  updateIncidentResolution,
  getIncidentResolution,
  setSystemDates,
  getSystemDates,
  addReportSubscriber,
  deleteReportSubscriber,
  getReportSubscriber,
  changeOrganisationLogo,
  changeOrganisationBanner,
} from "../../../services/organizationService";

import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "../actions";

export default function useOrganisation(config = {}) {
  const id = config.match?.params?.id;

  const [organisations, setOrganisations] = React.useState([]);
  const [organisation, setOrganisation] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [incidentResolution, setIncidentResolutionState] = React.useState(null);
  const [systemDates, setSystemDatesState] = React.useState(null);
  const [reportSubscribers, setReportSubscribers] = React.useState([]);

  const notify = React.useContext(NotificationContext);
  const { successAlert, infoAlert } = useAlerts();

  const { processing, dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((a) => ({ action: USER_ACTIONS[a] }))
  );

  const OrgQueryTools = useQuery({});

  const fetchOrganisations = async (queryStr) => {
    try {
      dispatch({ [USER_ACTIONS.LOAD_ORGANISATIONS]: { status: true } });

      const { data } = await getOrganizations({ query: queryStr });
      setOrganisations(data.organizations || []);

      dispatch({ [USER_ACTIONS.LOAD_ORGANISATIONS]: { status: false } });
    } catch (ex) {
      imsLogger("LOAD_ORGANISATIONS", ex);
      dispatch({
        [USER_ACTIONS.LOAD_ORGANISATIONS]: { status: false, error: true },
      });
    }
  };

  React.useEffect(() => {
    fetchOrganisations(OrgQueryTools.getQuery());
  }, [OrgQueryTools.query]);

  const fetchOrganisation = async () => {
    if (!id) return;

    try {
      dispatch({ [USER_ACTIONS.LOAD_ORGANISATION]: { status: true } });

      const { data } = await getOrganization(id);
      setOrganisation(data.organization);
      console.log("ORGANISATION : ", data.organization);
      dispatch({ [USER_ACTIONS.LOAD_ORGANISATION]: { status: false } });
    } catch (ex) {
      imsLogger("LOAD_ORGANISATION", ex);
      dispatch({
        [USER_ACTIONS.LOAD_ORGANISATION]: { status: false, error: true },
      });
    }
  };

  React.useEffect(() => {
    fetchOrganisation();
  }, [id]);

  const createOrg = async (payload) => {
    try {
      dispatch({ [USER_ACTIONS.CREATE_ORGANISATION]: { status: true } });
      const { data } = await createOrganisation(payload);
      setOrganisations((prev) => [data.organization, ...prev]);

      notify("Organisation created", "success");
      successAlert("Created successfully");

      dispatch({ [USER_ACTIONS.CREATE_ORGANISATION]: { status: false } });
    } catch (ex) {
      imsLogger("CREATE_ORGANISATION", ex);
      dispatch({
        [USER_ACTIONS.CREATE_ORGANISATION]: { status: false, error: true },
      });
    }
  };

  const updateOrg = async (id, payload) => {
    try {
      dispatch({ [USER_ACTIONS.UPDATE_ORGANISATION]: { status: true } });

      const { data } = await updateOrganisation(id, payload);
      setOrganisation(data.organization);

      setOrganisations((prev) =>
        prev.map((o) => (o._id === id ? data.organization : o))
      );

      notify("Organisation updated", "success");

      dispatch({ [USER_ACTIONS.UPDATE_ORGANISATION]: { status: false } });
    } catch (ex) {
      imsLogger("UPDATE_ORGANISATION", ex);
      dispatch({
        [USER_ACTIONS.UPDATE_ORGANISATION]: { status: false, error: true },
      });
    }
  };

  const fetchOrganisationUsers = async () => {
    if (!id) return;

    try {
      dispatch({ [USER_ACTIONS.LOAD_USERS]: { status: true } });

      const { data } = await getUsersByOrganization(id);
      setUsers(data.users || []);

      dispatch({ [USER_ACTIONS.LOAD_USERS]: { status: false } });
    } catch (ex) {
      imsLogger("LOAD_USERS", ex);
      dispatch({ [USER_ACTIONS.LOAD_USERS]: { status: false, error: true } });
    }
  };

  const updateOrgLogo = async (file) => {
    try {
      dispatch({ [USER_ACTIONS.UPDATE_LOGO]: { status: true } });

      const { data } = await changeOrganisationLogo(id, file);
      setOrganisation(data.organization);

      notify("Logo updated", "success");

      dispatch({ [USER_ACTIONS.UPDATE_LOGO]: { status: false } });
    } catch (ex) {
      imsLogger("UPDATE_LOGO", ex);
      dispatch({ [USER_ACTIONS.UPDATE_LOGO]: { status: false, error: true } });
    }
  };

  const updateOrgLogoRectangle = async (file) => {
    try {
      dispatch({ [USER_ACTIONS.UPDATE_LOGO_RECT]: { status: true } });

      const { data } = await changeOrganisationBanner(id, file);
      setOrganisation(data.organization);

      notify("Rectangle logo updated", "success");

      dispatch({ [USER_ACTIONS.UPDATE_LOGO_RECT]: { status: false } });
    } catch (ex) {
      imsLogger("UPDATE_LOGO_RECT", ex);
      dispatch({
        [USER_ACTIONS.UPDATE_LOGO_RECT]: { status: false, error: true },
      });
    }
  };

  const fetchIncidentResolution = async () => {
    try {
      dispatch({ [USER_ACTIONS.LOAD_INCIDENT]: { status: true } });

      const { data } = await getIncidentResolution(id);
      setIncidentResolutionState(data);

      dispatch({ [USER_ACTIONS.LOAD_INCIDENT]: { status: false } });
    } catch (ex) {
      imsLogger("LOAD_INCIDENT", ex);
      dispatch({
        [USER_ACTIONS.LOAD_INCIDENT]: { status: false, error: true },
      });
    }
  };

  const updateIncident = async (payload) => {
    try {
      dispatch({ [USER_ACTIONS.UPDATE_INCIDENT]: { status: true } });

      await updateIncidentResolution(id, payload);

      notify("Incident resolution updated", "success");
      successAlert("Updated successfully");

      dispatch({ [USER_ACTIONS.UPDATE_INCIDENT]: { status: false } });
    } catch (ex) {
      imsLogger("UPDATE_INCIDENT", ex);
      dispatch({
        [USER_ACTIONS.UPDATE_INCIDENT]: { status: false, error: true },
      });
    }
  };

  const fetchSystemDates = async () => {
    try {
      dispatch({ [USER_ACTIONS.LOAD_DATES]: { status: true } });

      const { data } = await getSystemDates(id);
      setSystemDatesState(data);

      dispatch({ [USER_ACTIONS.LOAD_DATES]: { status: false } });
    } catch (ex) {
      imsLogger("LOAD_SYSTEM_DATES", ex);
      dispatch({
        [USER_ACTIONS.LOAD_DATES]: { status: false, error: true },
      });
    }
  };

  const updateDates = async (payload) => {
    try {
      dispatch({ [USER_ACTIONS.UPDATE_DATES]: { status: true } });

      await setSystemDates(id, payload);

      notify("System dates updated", "success");

      dispatch({ [USER_ACTIONS.UPDATE_DATES]: { status: false } });
    } catch (ex) {
      imsLogger("UPDATE_SYSTEM_DATES", ex);
      dispatch({
        [USER_ACTIONS.UPDATE_DATES]: { status: false, error: true },
      });
    }
  };

  const loadSubscribers = async (q) => {
    try {
      dispatch({ [USER_ACTIONS.LOAD_SUBSCRIBERS]: { status: true } });

      const { data } = await getReportSubscriber(id, { query: q });
      setReportSubscribers(data.subscribers || []);

      dispatch({ [USER_ACTIONS.LOAD_SUBSCRIBERS]: { status: false } });
    } catch (ex) {
      imsLogger("LOAD_SUBSCRIBERS", ex);
      dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: { status: false, error: true },
      });
    }
  };

  const addSubscriber = async (payload) => {
    try {
      dispatch({ [USER_ACTIONS.ADD_SUBSCRIBER]: { status: true } });

      await addReportSubscriber(id, payload);
      successAlert("Subscriber added");

      dispatch({ [USER_ACTIONS.ADD_SUBSCRIBER]: { status: false } });
    } catch (ex) {
      imsLogger("ADD_SUBSCRIBER", ex);
      dispatch({
        [USER_ACTIONS.ADD_SUBSCRIBER]: { status: false, error: true },
      });
    }
  };

  const deleteSubscriber = async (subscriberId) => {
    try {
      dispatch({ [USER_ACTIONS.DELETE_SUBSCRIBER]: { status: true } });

      await deleteReportSubscriber(id, subscriberId);
      successAlert("Subscriber deleted");

      dispatch({ [USER_ACTIONS.DELETE_SUBSCRIBER]: { status: false } });
    } catch (ex) {
      imsLogger("DELETE_SUBSCRIBER", ex);
      dispatch({
        [USER_ACTIONS.DELETE_SUBSCRIBER]: { status: false, error: true },
      });
    }
  };

  return {
    organisations,
    organisation,
    users,
    processing,

    fetchOrganisations,
    fetchOrganisation,
    fetchOrganisationUsers,

    createOrg,
    updateOrg,

    updateOrgLogo,
    updateOrgLogoRectangle,

    incidentResolution,
    fetchIncidentResolution,
    updateIncident,

    systemDates,
    fetchSystemDates,
    updateDates,

    reportSubscribers,
    loadSubscribers,
    addSubscriber,
    deleteSubscriber,

    OrgQueryTools,
  };
}
