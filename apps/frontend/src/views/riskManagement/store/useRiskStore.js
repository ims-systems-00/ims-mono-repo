import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { getCompliance } from "@/services/complianceToolsServices";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { nudgePeople } from "@/services/notificationService";
import * as riskManagementApi from "@/services/riskManagementServices";
import USER_ACTIONS from "../actions";
import filters from "../filters";

export default function useRiskStore(config) {
  let id = config.match && config.match.params.id;
  // let type = toLetterCase(config.location.pathname.split("/")[3]);
  let [action, setAction] = React.useState("");
  const handleAction = (action) => {
    setAction(action);
  };
  let [risks, setRisks] = React.useState([]);
  let [visitingRisk, setVisitingRisk] = React.useState(null);
  let [controlsOnVisitingRisk, setControlsOnVisitingRisk] = React.useState([]);
  let complianceQueryTools = useQuery({});
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  const _handleControlsOnVisitingRisk = (risk) => {
    /** only change query if the clauses are already avaiable otherwiese set empty array */
    if (risk?.isoControls?.clauses?.length) {
      complianceQueryTools.handleFilter({
        value: {
          _id: {
            in: risk?.isoControls?.clauses || [],
          },
        },
      });
    } else setControlsOnVisitingRisk([]);
  };
  const visitRisk = (risk) => {
    setVisitingRisk(risk);
    _handleControlsOnVisitingRisk(risk);
  };

  const initiateAllData = () => {
    fetchRisk();
  };

  const fullReset = () => {
    setVisitingRisk(null);
    setControlsOnVisitingRisk([]);
  };
  const reloadRisk = () => {
    fullReset();
    initiateAllData();
  };

  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  let pathname = config.match.url;
  let RiskQueryTools = useQuery({
    required: {},
    filter: filters.find((item) => item.default),
  });
  const addToTable = (risk) => setRisks((prevRisks) => [risk, ...prevRisks]);
  const fetchRisks = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_RISKS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await riskManagementApi.getRisks({
        query: `${qStr}`,
      });
      setRisks(data.risks);
      RiskQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_RISKS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("RiskManagement", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_RISKS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("RiskManagement", ex, ex.response);
    }
  };
  const fetchRisk = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_RISK]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await riskManagementApi.getRisk(visitingRisk?._id || id);
      visitRisk(data.risk);
      _dispatch({
        [USER_ACTIONS.LOAD_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("RiskDetail", ex, ex.response);
    }
  };

  React.useEffect(() => {
    (async function () {
      await fetchRisks(RiskQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [RiskQueryTools.query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);
  async function _loadLinkedControlsToRisk(qStr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qStr}`,
      });
      setControlsOnVisitingRisk(data.compliance);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("RiskManagement", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  React.useEffect(() => {
    if (complianceQueryTools.toolState.filter.value?._id?.in)
      _loadLinkedControlsToRisk(complianceQueryTools.getQuery());
  }, [complianceQueryTools.query]);
  const createRisk = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_RISK]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await riskManagementApi.createRisk(payload);
      notify("Risk raised successfully", "success");
      addToTable && addToTable(data.risk);
      visitRisk(data.risk);
      _dispatch({
        [USER_ACTIONS.CREATE_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.CREATE_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to raise risk", "danger");
      imsLogger(err || err.message);
    }
  };

  const updateRisk = async (payload, config) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_RISK]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await riskManagementApi.updateRisk(
        visitingRisk?._id,
        payload
      );
      notify("Risk updated successfully", "success");
      updateDataTable(data.risk);
      visitRisk(data.risk);
      _dispatch({
        [USER_ACTIONS.AMEND_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.AMEND_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to raise risk", "danger");
      imsLogger(err || err.message);
    }
  };

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_RISK]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setRisks((prevRisks) =>
      prevRisks.map((risk) =>
        risk._id === updatedData._id ? updatedData : risk
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_RISK]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };
  const isMitigatedRisk = (risk) => {
    return risk?.mitigated?.status;
  };
  const isAcceptedRisk = (risk) => {
    return risk?.accepted?.status;
  };
  const nudgeRisk = async (risk) => {
    const riskId = risk?._id;
    try {
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: true,
          error: false,
          id: riskId,
        },
      });
      await nudgePeople("risks", riskId, "nudge-to-look-at-risk");
      notify(
        `${risk.owner?.name} is nudged to look at ${risk.reference} ${risk.title}`,
        "success"
      );
      successAlert("Risk owner has been nudged successfully");
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("RiskActions", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const escalateRisk = async (risk) => {
    const riskId = risk?._id;
    try {
      _dispatch({
        [USER_ACTIONS.ESCALATE_RISK]: {
          status: true,
          error: false,
          id: riskId,
        },
      });
      let { data } = await riskManagementApi.escalateRisk(riskId);
      notify("Risk escalated successfully", "success");
      reloadRisk();
      successAlert("Risk escalated successfully");
      _dispatch({
        [USER_ACTIONS.ESCALATE_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
      setRisks((prevRisks) =>
        prevRisks.map((risk) => {
          return risk._id === riskId ? data.risk : risk;
        })
      );
    } catch (ex) {
      imsLogger("RiskActions", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
      _dispatch({
        [USER_ACTIONS.ESCALATE_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const deleteRisk = async (risk) => {
    const riskId = risk?._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_RISK]: {
          status: true,
          error: false,
          id: riskId,
        },
      });
      infoAlert("Your request is being processed");
      let { data } = await riskManagementApi.deleteRisk(riskId);
      successAlert("Risk deleted successfully");
      setRisks((prevRisks) => prevRisks.filter((risk) => risk._id !== riskId));
      notify("Risk deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("RiskActions", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };
  async function handleRiskAttachment(attachment, risk) {
    try {
      _dispatch(
        {
          [USER_ACTIONS.DELETE_ATTACHMENT]: {
            status: true,
            error: false,
            id: attachment._id,
          },
        },
        [USER_ACTIONS.DELETE_ATTACHMENT]
      );
      let { data } = await riskManagementApi.removeAttachment(
        risk._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      setRisks((prevRisks) =>
        prevRisks.map((risk) => {
          return risk._id === data.risk._id ? data.risk : risk;
        })
      );
      setVisitingRisk(data.risk);
      notify("Document deleted successfully", "success");
    } catch (ex) {
      imsLogger("riskAttachments", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
    _dispatch(
      {
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: false,
          id: null,
        },
      },
      [USER_ACTIONS.DELETE_ATTACHMENT]
    );
  }
  async function linkISOControl(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.LINK_ISO_CONTROL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await riskManagementApi.linkISOControl(visitingRisk?._id, {
        controls: payload.controls,
        toolkits: payload.toolkits || [],
      });
      notify("Control added", "success");
      visitRisk(data.risk);
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
      imsLogger("RiskDetail", ex, ex.response);
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
      let { data } = await riskManagementApi.removeISOControl(
        visitingRisk?._id,
        { controls: payload.controls, toolkits: payload.toolkits || [] }
      );
      notify("Control removed", "success");
      visitRisk(data.risk);
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
      imsLogger("RiskDetail", ex, ex.response);
    }
  }
  return {
    isMitigatedRisk,
    isAcceptedRisk,
    processing,
    controlsOnVisitingRisk,
    risks,
    RiskQueryTools,
    fetchRisks,
    addToTable,
    pathname,
    updateDataTable,
    alert,
    successAlert,
    infoAlert,
    createRisk,
    updateRisk,
    warningWithConfirmMessage,
    handleRiskAttachment,
    visitingRisk,
    visitRisk,
    nudgeRisk,
    escalateRisk,
    deleteRisk,
    action,
    handleAction,
    fetchRisk,
    linkISOControl,
    removeISOControl,
    reloadRisk,
    toggleModalFilter,
    modalFilter,
  };
}
