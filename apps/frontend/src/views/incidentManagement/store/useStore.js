import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { getCompliance } from "@/services/complianceToolsServices";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import * as incidentManagementApi from "@/services/incidentManagenmentService";
import { imsLogger } from "@/services/loggerService";
import { nudgePeople } from "@/services/notificationService";
import USER_ACTIONS from "../actions";
import filters from "../filters";
import { getSuppliers } from "@/services/supplierManagementServices";

export default function useStore(config) {
  const moduleType = config.moduleType ? config.moduleType : null;
  const moduleId = config.moduleId ? config.moduleId : null;
  const id = config.match && config.match.params.id;
  let notify = React.useContext(NotificationContext);
  let [incidents, setIncidents] = React.useState([]);
  let [suppliers, setSuppliers] = React.useState([]);
  let [visitingIncident, setVisitingIncident] = React.useState(null);
  let moduleMatch = moduleId ? { module: moduleId } : {};
  let [popAction, setPopAction] = React.useState(null);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let [controlsOnVisitingIncident, setControlsOnVisitingIncident] =
    React.useState([]);
  let complianceQueryTools = useQuery({});
  const _handleControlsOnVisitingIncident = (incident) => {
    /** only change query if the clauses are already available otherwiese set empty array */
    if (incident?.isoControls?.clauses?.length) {
      complianceQueryTools.handleFilter({
        value: {
          _id: {
            in: incident?.isoControls?.clauses || [],
          },
        },
      });
    } else setControlsOnVisitingIncident([]);
  };

  let { successAlert } = useAlerts();
  let handlePopAction = (action) => {
    setPopAction(action);
  };
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  const visitIncident = (incident) => {
    setVisitingIncident(incident);
    _handleControlsOnVisitingIncident(incident);
  };

  const initiateAllData = () => {
    fetchIncident();
  };

  const fullReset = () => {
    setVisitingIncident(null);
    setControlsOnVisitingIncident([]);
  };
  const reloadIncident = () => {
    fullReset();
    initiateAllData();
  };

  let IncidentQueryTools = useQuery({
    filter: filters.find((item) => item.default),
    required: {
      value: {
        source: {
          moduleType: {
            in: moduleType,
          },
          ...moduleMatch,
        },
      },
    },
  });
  const addToTable = (incident) =>
    setIncidents((prevIncidents) => [incident, ...prevIncidents]);

  const fetchIncidents = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_INCIDENTS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await incidentManagementApi.getIncidents({
        query: `${qStr}`,
      });
      setIncidents(data.incidents);
      IncidentQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_INCIDENTS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_INCIDENTS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("IncidentManagement", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };
  const fetchIncident = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_INCIDENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await incidentManagementApi.getIncident(
        visitingIncident?._id || id
      );
      visitIncident(data.incident);
      _dispatch({
        [USER_ACTIONS.LOAD_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("IncidentDetail", ex, ex.response);
    }
  };
  React.useEffect(() => {
    (async function () {
      await fetchIncidents(IncidentQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [IncidentQueryTools.query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);
  async function _loadLinkedControlsToIncident(qStr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qStr}`,
      });
      setControlsOnVisitingIncident(data.compliance);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger(ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  React.useEffect(() => {
    if (complianceQueryTools.toolState.filter.value?._id?.in)
      _loadLinkedControlsToIncident(complianceQueryTools.getQuery());
  }, [complianceQueryTools.query]);

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_INCIDENT]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setIncidents((prevIncidents) =>
      prevIncidents.map((incident) =>
        incident._id === updatedData._id ? updatedData : incident
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_INCIDENT]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  const escalateIncident = async (incident) => {
    const incidentId = incident._id;
    try {
      _dispatch({
        [USER_ACTIONS.ESCALATE_INCIDENT]: {
          status: true,
          error: false,
          id: incidentId,
        },
      });
      let { data } = await incidentManagementApi.escalateIncident(incidentId);
      notify("Incident escalated successfully", "success");
      reloadIncident();
      successAlert("Incident escalated successfully");

      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) => {
          return incident._id === incidentId ? data.incident : incident;
        })
      );
      _dispatch({
        [USER_ACTIONS.ESCALATE_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.ESCALATE_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Incidents", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
    }
  };

  const deleteIncident = async (incident) => {
    const incidentId = incident._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_INCIDENT]: {
          status: true,
          error: false,
          id: incidentId,
        },
      });
      let { data } = await incidentManagementApi.deleteIncident(incidentId);
      setIncidents((prevIncidents) =>
        prevIncidents.filter((incident) => incident._id !== incidentId)
      );
      notify("Incident deleted successfully", "success");
      successAlert("Incident deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Incidents", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
    }
  };

  const nudgeIncident = async (incident) => {
    const incidentId = incident._id;
    try {
      _dispatch({
        [USER_ACTIONS.NUDGE_INCIDENT]: {
          status: true,
          error: false,
          id: incidentId,
        },
      });
      let { data } = await nudgePeople(
        "incidents",
        incidentId,
        "nudge-to-look-at-incident"
      );
      reloadIncident();
      notify(
        `${incident.owner.name} is nudged to look at ${incident.reference} ${incident.title}`,
        "success"
      );
      successAlert("Incident owner has been nudged successfully");
      _dispatch({
        [USER_ACTIONS.NUDGE_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.NUDGE_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Incidents", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
    }
  };

  const createIncident = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_INCIDENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await incidentManagementApi.createIncident(payload, {
        moduleType,
        moduleId,
      });
      notify("Incident raised successfully", "success");
      addToTable && addToTable(data.incident);
      visitIncident(data.incident);
      _dispatch({
        [USER_ACTIONS.CREATE_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.CREATE_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to raise incident", "danger");
      imsLogger(err || err.message);
    }
  };

  const updateIncident = async (updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_INCIDENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await incidentManagementApi.updateIncident(
        visitingIncident?._id,
        updatedData,
        {
          moduleType,
          moduleId,
        }
      );
      notify("Incident updated successfully", "success");
      updateDataTable(data.incident);
      visitIncident(data.incident);
      _dispatch({
        [USER_ACTIONS.AMEND_INCIDENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.AMEND_INCIDENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to update incident", "danger");
      imsLogger(err || err.message);
    }
  };

  async function deleteAttachment(attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await incidentManagementApi.removeAttachment(
        visitingIncident._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitIncident(data.incident);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  const isResolvedIncident = () => {
    return visitingIncident?.resolved?.status;
  };

  async function linkISOControl(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.LINK_ISO_CONTROL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await incidentManagementApi.linkISOControl(
        visitingIncident?._id,
        {
          controls: payload.controls,
          toolkits: payload.toolkits || [],
        }
      );
      notify("Control added", "success");
      visitIncident(data.incident);
      _dispatch({
        [USER_ACTIONS.LINK_ISO_CONTROL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LINK_ISO_CONTROL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  }

  async function removeISOControl(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.REMOVE_ISO_CONTROL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await incidentManagementApi.removeISOControl(
        visitingIncident?._id,
        { controls: payload.controls, toolkits: payload.toolkits || [] }
      );
      notify("Controls removed.", "success");
      visitIncident(data.incident);
      _dispatch({
        [USER_ACTIONS.REMOVE_ISO_CONTROL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.REMOVE_ISO_CONTROL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  }

  const fetchSuppliers = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIERS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getSuppliers({
        query: `size=100`,
      });
      setSuppliers(data.suppliers);
      // fetches 100 suppliers for now.. Need to enhance in future
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIERS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIERS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SupplierManagement", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    incidents,
    processing,
    fetchIncidents,
    IncidentQueryTools,
    moduleType,
    moduleId,
    visitingIncident,
    popAction,
    handlePopAction,
    isResolvedIncident,
    escalateIncident,
    deleteIncident,
    nudgeIncident,
    visitIncident,
    createIncident,
    updateIncident,
    deleteAttachment,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingIncident,
    reloadIncident,
    suppliers,
    modalFilter,
    toggleModalFilter,
  };
}
