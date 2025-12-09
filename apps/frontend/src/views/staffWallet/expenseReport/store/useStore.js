import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { getCurrentSessionData } from "@/services/authService";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import * as expenseReportApi from "@/services/wallet/expenseReportServices";
import USER_ACTIONS from "../actions";

export default function useExpenseReport(config) {
  let id = config?.match && config.match.params.id;
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let { authUser, authWalletAccess, entityAccessControl } = useAccess();
  let walletId = config?.walletId || getCurrentSessionData().user?._id;
  let [expenseReports, setExpenseReports] = React.useState([]);
  let [visitingExpenseReport, setVisitingExpenseReport] = React.useState(null);
  let [editMode, setEditMode] = React.useState(false);
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  /**
   * use this function to fetch the not drafted reports for line manager
   *  */
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
  const addToTable = (report) =>
    setExpenseReports((prevReports) => [report, ...prevReports]);
  const visitExpenseReport = (report) => {
    setVisitingExpenseReport(report);
  };
  const initiateAllData = () => {
    fetchReport();
  };

  const fullReset = () => {
    setVisitingExpenseReport(null);
  };
  const reloadExpenseReport = () => {
    fullReset();
    initiateAllData();
  };
  const fetchReports = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_EXPENSEREPORTS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.getExpenseReports({
        query: `${qStr}`,
      });
      setExpenseReports(data.reports);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_EXPENSEREPORTS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_EXPENSEREPORTS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ExpenseReports", ex, ex.response);
      // notify("Error occurred while fetching data", "danger");
    }
  };

  const visitReport = (report) => {
    setVisitingExpenseReport(report);
    config.onUpdate && config.onUpdate(report);
  };

  const fetchReport = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_EXPENSEREPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      // let id =
      //   (config.match && config.match.params.id) ||
      //   (config.view && config.view._id);
      let { data } = await expenseReportApi.getExpenseReport(
        visitingExpenseReport?._id || id
      );
      visitExpenseReport(data.report);
      _dispatch({
        [USER_ACTIONS.LOAD_EXPENSEREPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_EXPENSEREPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ExpenseDetail", ex, ex.response);
    }
  };

  React.useEffect(() => {
    fetchReports(getQuery());
  }, [query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);

  let createExpenseReport = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_EXPENSEREPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.createExpenseReport(payload);
      notify("Expense report created successfully ", "success");
      addToTable && addToTable(data.report);
      _dispatch({
        [USER_ACTIONS.CREATE_EXPENSEREPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.CREATE_EXPENSEREPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let updateExpenseReport = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_EXPENSEREPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.updateExpenseReport(
        visitingExpenseReport._id,
        payload
      );
      notify("Expense report updated successfully", "success");
      visitReport && visitReport(data.report);
      // viewContextData.switchView && viewContextData.switchView();
      _dispatch({
        [USER_ACTIONS.AMEND_EXPENSEREPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_EXPENSEREPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let submitExpenseReport = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.SUBMIT_REPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.submitReport(
        visitingExpenseReport._id
      );
      notify(
        `${data?.report?.title} has been submitted successfully as an expense`,
        "success"
      );
      visitReport && visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.SUBMIT_REPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.SUBMIT_REPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let approveExpenseReport = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.HANDLE_REPORT_SUBMISSION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.evaluateReport(
        visitingExpenseReport._id,
        {
          decision: "Approved",
        }
      );
      notify("Expense report approved successfully", "success");
      visitReport && visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.HANDLE_REPORT_SUBMISSION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.HANDLE_REPORT_SUBMISSION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };
  let rejectExpenseReport = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.HANDLE_REPORT_SUBMISSION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.evaluateReport(
        visitingExpenseReport._id,
        {
          decision: "Rejected",
        }
      );
      notify("Expense report rejected successfully", "success");
      visitReport && visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.HANDLE_REPORT_SUBMISSION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.HANDLE_REPORT_SUBMISSION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };

  async function deleteExpenseAttachment(expense, attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSE_ATTACHMENT]: {
          status: true,
          error: false,
          id: document._id,
        },
      });
      let { data } = await expenseReportApi.deleteExpenseAttachment(
        visitingExpenseReport._id,
        expense,
        attachment
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitReport && visitReport(data.report);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSE_ATTACHMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSE_ATTACHMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Attachments", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  let isManagementByMe = (report) => {
    return getCurrentSessionData().managedUsers.find(
      (user) => user === report?.created?.by?._id
    )
      ? true
      : false;
  };

  let updateDataTable = (updatedReport) => {
    _dispatch({
      [USER_ACTIONS.AMEND_EXPENSEREPORT]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setExpenseReports((prevReports) =>
      prevReports.map((report) =>
        report._id === updatedReport._id ? updatedReport : report
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_EXPENSEREPORT]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  async function handleDelete(data) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSEREPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await expenseReportApi.deleteExpenseReport(data._id);
      notify("Expense report deleted successfully", "success");
      setExpenseReports((prevReport) =>
        prevReport.filter((report) => report._id !== data._id)
      );
      successAlert("Expense report deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSEREPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("ExpenseReportTable", ex);
      notify(
        "Expense report delete failed.Unknown server error occurred",
        "danger"
      );
    }
  }

  let addAccommodation = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.INCLUDE_ACCOMMODATION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.includeAccommodation(
        visitingExpenseReport._id,
        payload
      );
      notify("Accommodation added successfully ", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.INCLUDE_ACCOMMODATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.INCLUDE_ACCOMMODATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("AccommodationForm", ex.response || ex);
      notify(
        "Accommodation add failed.Unknown server error occurred",
        "danger"
      );
    }
  };
  let updateAccommodation = async (accommodation, payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_ACCOMMODATION]: {
          status: true,
          error: false,
          id: accommodation,
        },
      });
      let { data } = await expenseReportApi.updateAccommodation(
        visitingExpenseReport._id,
        accommodation,
        payload
      );
      notify("Accommodation updated successfully", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.AMEND_ACCOMMODATION]: {
          status: false,
          error: false,
          id: accommodation._id,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_ACCOMMODATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("AccommodationForm", ex.response || ex);
      notify(
        "Accommodation update failed.Unknown server error occurred",
        "danger"
      );
    }
    toggleEditMode();
  };

  async function handleTableButton(attachment, accommodation) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ACCOMMODATION_ATTACHMENT]: {
          status: true,
          error: false,
          id: document._id,
        },
      });
      let { data } = await expenseReportApi.deleteAccommodationAttachment(
        visitingExpenseReport._id,
        accommodation,
        attachment
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitReport && visitReport(data.report);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_ACCOMMODATION_ATTACHMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_ACCOMMODATION_ATTACHMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Attachments", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  let deleteAccommodation = async (accommodation) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ACCOMMODATION]: {
          status: true,
          error: false,
          id: accommodation._id,
        },
      });
      let { data } = await expenseReportApi.deleteAccommodation(
        visitingExpenseReport._id,
        accommodation
      );
      notify("Accommodation deleted successfully", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.DELETE_ACCOMMODATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_ACCOMMODATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Accommodation", ex.response || ex);
      notify(
        "Accommodation delete failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  let handleAddTravel = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.INCLUDE_TRAVEL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.includeTravel(
        visitingExpenseReport._id,
        payload
      );
      notify("Trip added successfully ", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.INCLUDE_TRAVEL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.INCLUDE_TRAVEL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("TravelForm", ex.response || ex);
      notify("Trip add failed.Unknown server error occurred", "danger");
    }
  };
  let handleUpdateTravel = async (travel, payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_TRAVEL]: {
          status: true,
          error: false,
          id: travel._id,
        },
      });
      let { data } = await expenseReportApi.updateTravel(
        visitingExpenseReport._id,
        travel,
        payload
      );
      notify("Trip updated successfully", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.AMEND_TRAVEL]: {
          status: false,
          error: false,
          id: travel._id,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_TRAVEL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("TravelForm", ex.response || ex);
      notify("Travel update failed.Unknown server error occurred", "danger");
    }
    toggleEditMode();
  };

  let handleDeleteTravel = async (travel) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_TRAVEL]: {
          status: true,
          error: false,
          id: travel,
        },
      });
      let { data } = await expenseReportApi.deleteTravel(
        visitingExpenseReport._id,
        travel
      );
      notify("Travel deleted successfully", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.DELETE_TRAVEL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_TRAVEL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Travel", ex.response || ex);
      notify("Travel delete failed.Unknown server error occurred", "danger");
    }
  };

  async function deleteTravelAttachment(travel, attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_TRAVEL_ATTACHMENT]: {
          status: true,
          error: false,
          id: document._id,
        },
      });
      let { data } = await expenseReportApi.deleteTravelAttachment(
        visitingExpenseReport._id,
        travel,
        attachment
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitReport && visitReport(data.report);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_TRAVEL_ATTACHMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_TRAVEL_ATTACHMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Attachments", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  let handleAddExpense = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.INCLUDE_EXPENSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await expenseReportApi.includeExpense(
        visitingExpenseReport._id,
        payload
      );
      notify("Expense added successfully ", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.INCLUDE_EXPENSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.INCLUDE_EXPENSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ExpenseForm", ex.response || ex);
      notify("Expense add failed.Unknown server error occurred", "danger");
    }
  };

  let handleUpdateExpense = async (expense, payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_EXPENSE]: {
          status: true,
          error: false,
          id: expense,
        },
      });
      let { data } = await expenseReportApi.updateExpense(
        visitingExpenseReport._id,
        expense,
        payload
      );
      notify("Expense updated successfully", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.AMEND_EXPENSE]: {
          status: false,
          error: false,
          id: expense,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_EXPENSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ExpenseForm", ex.response || ex);
      notify("Expense update failed.Unknown server error occurred", "danger");
    }
    toggleEditMode();
  };

  let handleDeleteExpense = async (expense) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSE]: {
          status: true,
          error: false,
          id: expense,
        },
      });
      let { data } = await expenseReportApi.deleteExpense(
        visitingExpenseReport._id,
        expense
      );
      notify("Expense deleted successfully", "success");
      visitReport(data.report);
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_EXPENSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Expense", ex.response || ex);
      notify("Expense delete failed.Unknown server error occurred", "danger");
    }
  };

  const getSubmissionStatus = () => {
    return visitExpenseReport?.submission?.status;
  };

  return {
    alert,
    authUser,
    entityAccessControl,
    authWalletAccess,
    expenseReports,
    processing,
    toolState,
    getQuery,
    updatePagination,
    queryHandlers,
    updateDataTable,
    handleDelete,
    warningWithConfirmMessage,
    visitingExpenseReport,
    visitExpenseReport,
    getSubmissionStatus,
    createExpenseReport,
    updateExpenseReport,
    submitExpenseReport,
    approveExpenseReport,
    rejectExpenseReport,
    isManagementByMe,
    editMode,
    toggleEditMode,
    addAccommodation,
    updateAccommodation,
    deleteAccommodation,
    handleTableButton,
    handleAddTravel,
    handleUpdateTravel,
    handleDeleteTravel,
    deleteTravelAttachment,
    deleteExpenseAttachment,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    fetchReports,
    reloadExpenseReport,
  };
}
