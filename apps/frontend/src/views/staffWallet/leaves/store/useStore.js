import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React, { useContext } from "react";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import * as leavesApi from "@/services/wallet/leavesServices";
import USER_ACTIONS from "../actions";

export default function useStore(config) {
  let id = config.match && config.match.params.id;
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let [leaves, setLeaves] = React.useState([]);
  let [visitingLeave, setVisitingLeave] = React.useState(null);
  let {
    authUser,
    authGlobalAccess,
    authAdminAccess,
    authWalletAccess,
    entityAccessControl,
  } = useAccess();
  let walletId = config.walletId
    ? config.walletId
    : getCurrentSessionData().user?._id;
  let notify = React.useContext(NotificationContext);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const { profile } = useContext(SuperGlobalContext);
  let filterDrafted = () => {
    return authWalletAccess(walletId)
      ? { submission: { status: { ne: "Draft" } } }
      : {};
  };
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: {
        value: {
          created: { by: walletId },
          ...filterDrafted(),
        },
      },
    });

  const addToTable = (leave) =>
    setLeaves((prevLeaves) => [leave, ...prevLeaves]);

  const visitLeave = (leave) => {
    setVisitingLeave(leave);
  };

  const fetchLeaves = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_LEAVES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await leavesApi.getLeaves({
        query: `${qStr}`,
      });
      setLeaves(data.leaveRequests);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_LEAVES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_LEAVES]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Leaves", ex, ex.response);
      notify("Error occurred while fetching leaves data", "danger");
    }
  };
  async function fetchLeave() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_LEAVE]: {
          status: true,
          error: false,
          id: null,
        },
      });

      let { data } = await leavesApi.getLeave(id);
      setVisitingLeave(data.leaveRequest);
      _dispatch({
        [USER_ACTIONS.LOAD_LEAVE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_LEAVE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeaveDetail", ex, ex.response);
    }
  }
  React.useEffect(() => {
    if (id) {
      fetchLeave();
    } else {
      fetchLeaves(getQuery());
    }
  }, [id, query]);

  let updateDataTable = (updatedLeave) => {
    _dispatch({
      [USER_ACTIONS.AMEND_LEAVE]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave._id === updatedLeave._id ? updatedLeave : leave
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_LEAVE]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  let createLeave = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_LEAVE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await leavesApi.createLeave(payload);
      notify("Leave requested successfully ", "success");
      addToTable && addToTable(data.leaveRequest);
      _dispatch({
        [USER_ACTIONS.CREATE_LEAVE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.CREATE_LEAVE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let updateLeave = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_LEAVE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await leavesApi.updateLeave(visitingLeave._id, payload);
      notify("Leave request updated successfully", "success");
      visitLeave && visitLeave(data.leaveRequest);
      // viewContextData.switchView && viewContextData.switchView();
      _dispatch({
        [USER_ACTIONS.AMEND_LEAVE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_LEAVE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let submitLeave = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.SUBMIT_LEAVE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await leavesApi.submitLeave(visitingLeave._id);
      notify(
        "Leave request submitted to your line manager successfully",
        "success"
      );
      visitLeave && visitLeave(data.leaveRequest);
      _dispatch({
        [USER_ACTIONS.SUBMIT_LEAVE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.SUBMIT_LEAVE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let saveAndSubmitLeave = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND_LEAVE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let savedLeave = await createLeave(payload);
      let { data } = await leavesApi.submitLeave(
        savedLeave.data.leaveRequest._id
      );
      notify(
        "Leave request submitted to your line manager successfully",
        "success"
      );
      addToTable && addToTable(data.leaveRequest);
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND_LEAVE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND_LEAVE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let approveLeave = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.HANDLE_LEAVE_REQUEST]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await leavesApi.evaluateLeave(visitingLeave._id, {
        decision: "Approved",
      });
      notify("This leave request has been approved", "success");
      visitLeave && visitLeave(data.leaveRequest);
      _dispatch({
        [USER_ACTIONS.HANDLE_LEAVE_REQUEST]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.HANDLE_LEAVE_REQUEST]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let rejectLeave = async (leave) => {
    try {
      _dispatch({
        [USER_ACTIONS.HANDLE_LEAVE_REQUEST]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await leavesApi.evaluateLeave(leave, {
        decision: "Rejected",
      });
      notify("This leave request has been rejected", "success");
      visitLeave && visitLeave(data.leaveRequest);
      _dispatch({
        [USER_ACTIONS.HANDLE_LEAVE_REQUEST]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.HANDLE_LEAVE_REQUEST]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  async function deleteLeave(data) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_LEAVE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await leavesApi.deleteLeave(data._id);
      notify("Leave request deleted successfully", "success");
      setLeaves((prevLeaves) =>
        prevLeaves.filter((leave) => leave._id !== data._id)
      );
      successAlert("Leave request deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_LEAVE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("LeavesTable", ex);
      notify(
        "Leave request delete failed.Unknown server error occurred",
        "danger"
      );
    }
  }

  let isManagementByMe = (leave) => {
    return getCurrentSessionData().managedUsers.find(
      (user) => user === leave?.created?.by?._id
    )
      ? true
      : false;
  };
  const getSubmissionStatus = (visitingLeave) => {
    return visitingLeave?.submission?.status;
  };
  return {
    alert,
    authUser,
    authGlobalAccess,
    entityAccessControl,
    authAdminAccess,
    warningWithConfirmMessage,
    profile,
    leaves,
    visitLeave,
    visitingLeave,
    fetchLeaves,
    processing,
    queryHandlers,
    toolState,
    updatePagination,
    addToTable,
    updateDataTable,
    createLeave,
    deleteLeave,
    updateLeave,
    submitLeave,
    saveAndSubmitLeave,
    approveLeave,
    rejectLeave,
    getSubmissionStatus,
    isManagementByMe,
  };
}
