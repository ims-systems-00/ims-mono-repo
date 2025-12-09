import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { getCompliance } from "@/services/complianceToolsServices";
import * as ContinualImprovementApi from "@/services/continualImprovementServices";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { nudgePeople } from "@/services/notificationService";
import USER_ACTIONS from "../actions";
import filters from "../filters";
export default function useStore(config) {
  let id = config.match && config.match.params.id;
  let notify = React.useContext(NotificationContext);
  let [cips, setCips] = React.useState([]);
  let [visitingCip, setVisitingCip] = React.useState(null);
  let [popAction, setPopAction] = React.useState(null);
  let [controlsOnVisitingCip, setControlsOnVisitingCip] = React.useState([]);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let complianceQueryTools = useQuery({});
  const _handleControlsOnVisitingCip = (cip) => {
    /** only change query if the clauses are already avaiable otherwiese set empty array */
    if (cip?.isoControls?.clauses?.length) {
      complianceQueryTools.handleFilter({
        value: {
          _id: {
            in: cip?.isoControls?.clauses || [],
          },
        },
      });
    } else setControlsOnVisitingCip([]);
  };

  let handlePopAction = (action) => {
    setPopAction(action);
  };
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let CIPQueryTools = useQuery({});

  const addToTable = (cip) => setCips((prevCips) => [cip, ...prevCips]);
  const visitCip = (cip) => {
    setVisitingCip(cip);
    _handleControlsOnVisitingCip(cip);
  };

  const initiateAllData = () => {
    fetchCip();
  };

  const fullReset = () => {
    setVisitingCip(null);
    setControlsOnVisitingCip([]);
  };
  const reloadCip = () => {
    fullReset();
    initiateAllData();
  };

  const fetchCips = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_CIPS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ContinualImprovementApi.getCIPs({
        query: `${qStr}`,
      });
      setCips(data.cips);
      CIPQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_CIPS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("CIP", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_CIPS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };
  const fetchCip = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_CIP]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ContinualImprovementApi.getCIP(
        visitingCip?._id || id
      );
      visitCip(data.cip);
      _dispatch({
        [USER_ACTIONS.LOAD_CIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("CIP", ex, ex.response);
    }
  };

  React.useEffect(() => {
    (async function () {
      await fetchCips(CIPQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [CIPQueryTools.query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);
  async function _loadLinkedControlsToCip(qStr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_CIP]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getCompliance({
        query: `${qStr}`,
      });
      setControlsOnVisitingCip(data.compliance);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_CIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("RiskManagement", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  React.useEffect(() => {
    if (complianceQueryTools.toolState.filter.value?._id?.in)
      _loadLinkedControlsToCip(complianceQueryTools.getQuery());
  }, [complianceQueryTools.query]);

  const createCip = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_CIP]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ContinualImprovementApi.createCIP(payload);
      notify("CIP created successfully", "success");
      addToTable && addToTable(data.cip);
      visitCip(data.cip);
      _dispatch({
        [USER_ACTIONS.CREATE_CIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.CREATE_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to raise risk", "danger");
      imsLogger(err || err.message);
    }
  };

  const updateCip = async (updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      let { data } = await ContinualImprovementApi.updateCIP(
        visitingCip?._id,
        updatedData
      );
      notify("CIP updated successfully", "success");
      updateDataTable(data.cip);
      visitCip(data.cip);
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.AMEND_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to update cip", "danger");
      imsLogger(err || err.message);
    }
  };
  const implementCip = async (updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.IMPLEMENT_CIP]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ContinualImprovementApi.updateCIP(
        visitingCip?._id,
        updatedData
      );
      let implementedAudit = await ContinualImprovementApi.implementCIP(
        data.cip._id
      );
      notify("CIP implemented successfully", "success");
      updateDataTable(implementedAudit.data.cip);
      reloadCip();
      _dispatch({
        [USER_ACTIONS.IMPLEMENT_CIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.IMPLEMENT_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to implement cip", "danger");
      imsLogger(err || err.message);
    }
  };
  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_CIP]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setCips((prevCips) =>
      prevCips.map((cip) => (cip._id === updatedData._id ? updatedData : cip))
    );
    _dispatch({
      [USER_ACTIONS.AMEND_CIP]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  const nudgeCip = async (cip) => {
    const cipId = cip?._id;
    try {
      _dispatch({
        [USER_ACTIONS.NUDGE_OWNER]: {
          status: true,
          error: false,
          id: cipId,
        },
      });
      let { data } = await nudgePeople("cips", cipId, "nudge-to-look-at-cip");
      notify(
        `${cip.owner.name} is nudged to look at ${cip.reference} ${cip.title}`,
        "success"
      );
      successAlert("OFI owner has been nudged successfully");
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

  const deleteCip = async (cip) => {
    const cipId = cip?._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_CIP]: {
          status: true,
          error: false,
          id: cipId,
        },
      });
      let { data } = await ContinualImprovementApi.deleteCIP(cip._id);
      notify("OFI deleted successfully", "success");
      setCips((prevCip) => prevCip.filter((cip) => cip._id !== data._id));
      successAlert("OFI deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_CIP]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("CIP", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_CIP]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  async function handleCipAttachment(attachment) {
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
      let { data } = await ContinualImprovementApi.removeAttachment(
        visitingCip._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      //   setCips((prevRisks) =>
      //     prevRisks.map((risk) => {
      //       return risk._id === data.risk._id ? data.risk : risk;
      //     })
      //   );
      setVisitingCip(data.cip);
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
      let { data } = await ContinualImprovementApi.linkISOControl(
        visitingCip?._id,
        {
          controls: payload.controls,
          toolkits: payload.toolkits || [],
        }
      );
      notify("Control added", "success");
      visitCip(data.cip);
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
      let { data } = await ContinualImprovementApi.removeISOControl(
        visitingCip?._id,
        { controls: payload.controls, toolkits: payload.toolkits || [] }
      );
      notify("Control removed", "success");
      visitCip(data.cip);
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

  const isImplementedCip = () => {
    return visitingCip?.implemented?.status === "Implemented";
  };

  return {
    cips,
    processing,
    CIPQueryTools,
    fetchCips,
    createCip,
    updateCip,
    implementCip,
    handleCipAttachment,
    visitCip,
    visitingCip,
    nudgeCip,
    deleteCip,
    isImplementedCip,
    popAction,
    handlePopAction,
    controlsOnVisitingCip,
    linkISOControl,
    removeISOControl,
    reloadCip,
    modalFilter,
    toggleModalFilter,
  };
}
