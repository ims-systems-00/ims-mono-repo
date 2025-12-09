import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import * as auditManagementApi from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "../actions";
import filters from "../filters";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { getCompliance } from "@/services/complianceToolsServices";
import { getKpiObjectives } from "@/services/kpiObjectiveServices";

export default function useStore(config) {
  let id = config.match && config.match.params.id;
  let typeAudit = config.location.pathname.split("/")[3];
  let [audits, setAudits] = React.useState([]);
  let [visitingAudit, setVisitingAudit] = React.useState(null);
  let auditType = typeAudit.charAt(0).toUpperCase() + typeAudit.slice(1);
  let [controlsOnVisitingAudit, setControlsOnVisitingAudit] = React.useState(
    []
  );
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  const [kpiObjectives, setKpiObjectves] = React.useState([]);
  let complianceQueryTools = useQuery({});
  const _handleControlsOnVisitingAudit = (audit) => {
    /** only change query if the clauses are already avaiable otherwiese set empty array */
    if (audit?.isoControls?.clauses?.length) {
      complianceQueryTools.handleFilter({
        value: {
          _id: {
            in: audit?.isoControls?.clauses || [],
          },
        },
      });
    } else setControlsOnVisitingAudit([]);
  };
  let { authUser, authSuperUser, authInternalUser, authExternalUser } =
    useAccess();
  let [identificationEditMode, setIdentificationEditMode] =
    React.useState(false);
  let toggleIdentificationEditMode = () =>
    setIdentificationEditMode((currentMode) => !currentMode);

  let [ofiEditMode, setOfiEditMode] = React.useState(false);
  let toggleOfiEditMode = () => setOfiEditMode((currentMode) => !currentMode);

  let [riskEditMode, setRiskEditMode] = React.useState(false);
  let toggleRiskEditMode = () => setRiskEditMode((currentMode) => !currentMode);

  const visitAudit = (audit) => {
    setVisitingAudit(audit);
    fetchKpi();
    _handleControlsOnVisitingAudit(audit);
  };

  const initiateAllData = () => {
    fetchAudit();
    fetchKpi();
  };

  const fullReset = () => {
    setVisitingAudit(null);
    setKpiObjectves([]);
    setControlsOnVisitingAudit([]);
  };
  const reloadAudit = () => {
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
  let AuditQueryTools = useQuery({
    required: { value: { type: auditType } },
  });

  const addToTable = (audits) =>
    setAudits((prevAudits) => [...audits, ...prevAudits]);

  function accessControlScheduleForm() {
    let permitted = ["Schedule audit"];
    let notPermitted = [];
    if (
      authUser({
        service: IMS_SERVICES.AUDIT,
        action: ACTIONS.CREATE,
        effect: EFFECTS.ALLOW,
      })
    ) {
      if (authSuperUser()) return permitted;
      if (auditType === "Internal" && authInternalUser()) return permitted;
      if (auditType === "External" && authExternalUser()) return permitted;
    }
    return notPermitted;
  }
  const fetchAudits = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_AUDITS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.getAudits({
        query: `${qStr}`,
      });
      setAudits(data.audits);
      AuditQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_AUDITS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_AUDITS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("useAudit", ex, ex.response);
      notify("Could not fetch data", "danger");
    }
  };

  async function fetchKpi() {
    try {
      if (auditType === "Internal") {
        async function fetchKpi() {
          try {
            let { data } = await getKpiObjectives();
            setKpiObjectves(
              data.kpiObjectives.filter(
                (kpi) => kpi.privacy === "Organisational"
              )
            );
          } catch (ex) {
            imsLogger("AuditForm", ex.response || ex);
          }
        }
        fetchKpi();
      }
    } catch (ex) {
      imsLogger("AuditForm", ex.response || ex);
    }
  }

  const fetchAudit = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_AUDIT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.getAudit(
        visitingAudit?._id || id
      );
      visitAudit(data.audit);
      _dispatch({
        [USER_ACTIONS.LOAD_AUDIT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("useSTore", ex, ex.response);
    }
  };
  React.useEffect(() => {
    (async function () {
      await fetchAudits(AuditQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [AuditQueryTools.query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);

  async function _loadLinkedControlsToAudit(qStr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_AUDIT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qStr}`,
      });
      setControlsOnVisitingAudit(data.compliance);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_AUDIT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger(ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  React.useEffect(() => {
    if (complianceQueryTools.toolState.filter.value?._id?.in)
      _loadLinkedControlsToAudit(complianceQueryTools.getQuery());
  }, [complianceQueryTools.query]);

  const deleteAudit = async (audit) => {
    const auditId = audit?._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_AUDIT]: {
          status: false,
          error: true,
          id: auditId,
        },
      });
      await auditManagementApi.deleteAudit(auditId);
      setAudits((prevAudits) =>
        prevAudits.filter((audit) => audit._id !== auditId)
      );
      notify("Audit deleted successfully", "success");
      successAlert("Audit deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_AUDIT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("AuditTable", ex.response || ex);
      notify("Audit delete failed.Unknown server error occurred", "danger");
    }
  };

  const createAudit = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      let { data } = await auditManagementApi.createAudit(payload);
      notify("Audit created successfully", "success");
      addToTable(data.audits);
      visitAudit(data.audits[0]);
      _dispatch({
        [USER_ACTIONS.CREATE_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
    } catch (err) {
      imsLogger("useStore", err || err.message);
    }
  };

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_AUDIT]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setAudits((prevAudits) =>
      prevAudits.map((audit) =>
        audit._id === updatedData._id ? updatedData : audit
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_AUDIT]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  const updateAudit = async (payload, config) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_AUDIT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.updateAudit(
        visitingAudit?._id,
        payload
      );
      notify("Audit updated successfully", "success");
      updateDataTable(data.audit);
      visitAudit(data.audit);
      _dispatch({
        [USER_ACTIONS.AMEND_AUDIT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.AMEND_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to amend audit", "danger");
      imsLogger(err || err.message);
    }
  };

  const completeAudit = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.COMPLETE_AUDIT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.updateAudit(
        visitingAudit?._id,
        payload
      );
      let completedAudit = await auditManagementApi.completeAudit(
        data.audit._id
      );
      updateDataTable(completedAudit.data.audit);
      visitAudit(completedAudit.data.audit);
      notify("Audit completed successfully", "success");
      _dispatch({
        [USER_ACTIONS.COMPLETE_AUDIT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.COMPLETE_AUDIT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to amend audit", "danger");
      imsLogger(err || err.message);
    }
  };

  const createIdentification = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_IDENTIFICATION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.addIdentifications(
        visitingAudit._id,
        payload
      );
      notify("Non-conformity added successfully ", "success");
      visitAudit(data.audit);
      _dispatch({
        [USER_ACTIONS.ADD_IDENTIFICATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.ADD_IDENTIFICATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("store", ex.response || ex);
      notify(
        "Non-conformity add failed. Unknown server error occurred",
        "danger"
      );
    }
  };

  const updateIdentification = async (identification, payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_IDENTIFICATION]: {
          status: true,
          error: false,
          id: identification?._id,
        },
      });
      let { data } = await auditManagementApi.updateIdentifications(
        visitingAudit._id,
        identification._id,
        payload
      );
      toggleIdentificationEditMode();
      notify("Non-conformity updated successfully", "success");
      visitAudit(data.audit);
      _dispatch({
        [USER_ACTIONS.AMEND_IDENTIFICATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_IDENTIFICATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Identification", ex.response || ex);
      notify(
        "Non-conformity update failed. Unknown server error occurred",
        "danger"
      );
    }
  };

  const deleteIdentification = async (identification) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_IDENTIFICATION]: {
          status: true,
          error: false,
          id: identification?._id,
        },
      });
      let { data } = await auditManagementApi.deleteIdentifications(
        visitingAudit._id,
        identification._id
      );
      notify("Non-conformity deleted successfully", "success");
      visitAudit(data.audit);
      _dispatch({
        [USER_ACTIONS.DELETE_IDENTIFICATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_IDENTIFICATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Identification", ex.response || ex);
      notify(
        "Non-conformity delete failed. Unknown server error occurred",
        "danger"
      );
    }
  };
  const createOfi = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_OFI]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.addOfi(
        visitingAudit._id,
        payload
      );
      notify("OFI added successfully ", "success");
      visitAudit(data.audit);
      updateDataTable(data.audit);
      _dispatch({
        [USER_ACTIONS.ADD_OFI]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.ADD_OFI]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("store", ex.response || ex);
      notify("OFI add failed.Unknown server error occurred", "danger");
    }
  };

  const updateOfi = async (ofi, payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_OFI]: {
          status: true,
          error: false,
          id: ofi?._id,
        },
      });
      let { data } = await auditManagementApi.updateOfi(
        visitingAudit._id,
        ofi._id,
        payload
      );
      toggleOfiEditMode();
      notify("OFI updated successfully", "success");
      visitAudit(data.audit);
      updateDataTable(data.audit);
      _dispatch({
        [USER_ACTIONS.AMEND_OFI]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_OFI]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Identification", ex.response || ex);
      notify("OFI update failed.Unknown server error occurred", "danger");
    }
  };

  const deleteOfi = async (ofi) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_OFI]: {
          status: true,
          error: false,
          id: ofi?._id,
        },
      });
      let { data } = await auditManagementApi.deleteOfi(
        visitingAudit._id,
        ofi._id
      );
      notify("OFI deleted successfully", "success");
      visitAudit(data.audit);
      updateDataTable(data.audit);
      _dispatch({
        [USER_ACTIONS.DELETE_OFI]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_OFI]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Identification", ex.response || ex);
      notify("OFI delete failed. Unknown server error occurred", "danger");
    }
  };

  const createRisk = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_RISK]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await auditManagementApi.addRisk(
        visitingAudit._id,
        payload
      );
      notify("Risk added successfully ", "success");
      visitAudit(data.audit);
      updateDataTable(data.audit);
      _dispatch({
        [USER_ACTIONS.ADD_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.ADD_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("store", ex.response || ex);
      notify("Risk add failed.Unknown server error occurred", "danger");
    }
  };

  const updateRisk = async (risk, payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_RISK]: {
          status: true,
          error: false,
          id: risk?._id,
        },
      });
      let { data } = await auditManagementApi.updateRisk(
        visitingAudit._id,
        risk._id,
        payload
      );
      toggleRiskEditMode();
      notify("RIsk updated successfully", "success");
      visitAudit(data.audit);
      updateDataTable(data.audit);
      _dispatch({
        [USER_ACTIONS.AMEND_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Identification", ex.response || ex);
      notify("RIsk update failed.Unknown server error occurred", "danger");
    }
  };

  const deleteRisk = async (risk) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_RISK]: {
          status: true,
          error: false,
          id: risk?._id,
        },
      });
      let { data } = await auditManagementApi.deleteRisk(
        visitingAudit._id,
        risk._id
      );
      notify("RIsk deleted successfully", "success");
      visitAudit(data.audit);
      updateDataTable(data.audit);
      _dispatch({
        [USER_ACTIONS.DELETE_RISK]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Identification", ex.response || ex);
      notify("RIsk delete failed.Unknown server error occurred", "danger");
    }
  };

  const isCompletedAudit = () => {
    return visitingAudit.completed.status;
  };

  const deleteAttachment = async (attachment) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await auditManagementApi.deleteAuditDocument(
        visitingAudit?._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitAudit(data.audit);
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
      imsLogger("Attachments", ex.response || ex);
      notify("Document delete failed.Unknown server error occurred", "danger");
    }
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
      let { data } = await auditManagementApi.linkISOControl(
        visitingAudit?._id,
        {
          controls: payload.controls,
          toolkits: payload.toolkits || [],
        }
      );
      notify("Control added", "success");
      visitAudit(data.audit);
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
      let { data } = await auditManagementApi.removeISOControl(
        visitingAudit?._id,
        { controls: payload.controls, toolkits: payload.toolkits || [] }
      );
      notify("Control removed", "success");
      visitAudit(data.audit);
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

  const sendAuditReport = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.SEND_REPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await auditManagementApi.extractReport(visitingAudit?._id, payload);
      notify(
        `Audit report has been sent to ${payload.person} ${payload.personEmail}`,
        "success"
      );
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.SEND_REPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  };

  return {
    audits,
    processing,
    AuditQueryTools,
    fetchAudits,
    auditType,
    alert,
    successAlert,
    infoAlert,
    deleteAudit,
    createAudit,
    updateAudit,
    visitAudit,
    completeAudit,
    visitingAudit,
    createIdentification,
    updateIdentification,
    deleteIdentification,
    identificationEditMode,
    toggleIdentificationEditMode,
    ofiEditMode,
    toggleOfiEditMode,
    createOfi,
    updateOfi,
    deleteOfi,
    riskEditMode,
    toggleRiskEditMode,
    createRisk,
    updateRisk,
    deleteRisk,
    warningWithConfirmMessage,
    isCompletedAudit,
    deleteAttachment,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingAudit,
    typeAudit,
    kpiObjectives,
    sendAuditReport,
    reloadAudit,
    modalFilter,
    toggleModalFilter,
  };
}
