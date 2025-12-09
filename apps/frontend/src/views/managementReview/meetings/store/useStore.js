import NotificationContext from "@/contexts/notificationContext";
import USER_ACTIONS from "../actions";
import useProcessingControl from "@/hooks/useProcessingControl";
import useAlerts from "@/hooks/useAlerts";
import useQuery from "@/hooks/useQuery";
import filters from "../filters";
import * as ManagementReviewApi from "@/services/managementReviewServices";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { deleteFileFromS3 } from "@/services/fileHandlerService";

export default function useStore(config) {
  let id = config.match && config.match.params.id;
  let notify = React.useContext(NotificationContext);
  let [managementReviews, setManagementReviews] = React.useState([]);
  let [visitingReview, setVisitingReview] = React.useState(null);
  let [popAction, setPopAction] = React.useState(null);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
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
  const visitReview = (review) => {
    setVisitingReview(review);
  };
  const initiateAllData = () => {
    fetchReview();
  };

  const fullReset = () => {
    setVisitingReview(null);
  };
  const reloadReview = () => {
    fullReset();
    initiateAllData();
  };
  let ReviewQueryTools = useQuery({});

  const addToTable = (managementReview) =>
    setManagementReviews((prevManagementReviews) => [
      ...managementReview,
      ...prevManagementReviews,
    ]);

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_REVIEW]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setManagementReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === updatedData._id ? updatedData : review
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_REVIEW]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };
  const fetchReviews = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_REVIEWS]: { status: true, error: false, id: null },
      });
      let { data } = await ManagementReviewApi.getManagementReviews({
        query: `${qStr}`,
      });
      setManagementReviews((prevData) => [...data.managementReviews]);
      ReviewQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_REVIEWS]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_REVIEWS]: { status: false, error: true, id: null },
      });
      imsLogger("ScheduleReview", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  async function fetchReview() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_REVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ManagementReviewApi.getManagementReview(
        visitingReview?._id || id
      );
      visitReview(data.managementReview);
      _dispatch({
        [USER_ACTIONS.LOAD_REVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_REVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ReviewDetail", ex, ex.response);
    }
  }
  React.useEffect(() => {
    (async function () {
      await fetchReviews(ReviewQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [ReviewQueryTools.query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);
  const deleteReview = async (review) => {
    const reviewId = review?._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_REVIEW]: {
          status: true,
          error: false,
          id: reviewId,
        },
      });
      let { data } = await ManagementReviewApi.deleteManagementReview(reviewId);
      setManagementReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== data.managementReview._id)
      );
      notify("Management review deleted successfully", "success");
      successAlert("Management review deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_REVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_REVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Leave request delete failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  const createReview = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_REVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ManagementReviewApi.createManagementReview(payload);
      imsLogger("Management review created successfully ", data);
      notify("Management review created successfully", "success");
      addToTable(data.managementReviews);
      visitReview(data.managementReviews[0]);
      _dispatch({
        [USER_ACTIONS.CREATE_REVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.CREATE_REVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };

  const updateReview = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_REVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ManagementReviewApi.updateManagementReview(
        visitingReview._id,
        payload
      );
      updateDataTable(data.managementReview);
      visitReview(data.managementReview);
      notify("Management review updated successfully ", "success");
      _dispatch({
        [USER_ACTIONS.AMEND_REVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_REVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };

  let completeReview = async (e) => {
    try {
      _dispatch({
        [USER_ACTIONS.COMPLETE_REVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await ManagementReviewApi.completeManagementReview(
        visitingReview._id
      );
      reloadReview();
      notify("Management review completed successfully ", "success");
      _dispatch({
        [USER_ACTIONS.COMPLETE_REVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.COMPLETE_REVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };

  const deleteAgenda = async (attachment) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_AGENDA]: {
          status: true,
          error: false,
          id: attachment?._id,
        },
      });
      let { data } = await ManagementReviewApi.deleteAgenda(
        visitingReview._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitReview(data.managementReview);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_AGENDA]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_AGENDA]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Leave request delete failed.Unknown server error occurred",
        "danger"
      );
    }
  };
  const deleteMinute = async (attachment) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_MINUTE]: {
          status: true,
          error: false,
          id: attachment?._id,
        },
      });
      let { data } = await ManagementReviewApi.deleteMinutes(
        visitingReview._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitReview(data.managementReview);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_MINUTE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_MINUTE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LeavesTable", ex);
      notify(
        "Leave request delete failed.Unknown server error occurred",
        "danger"
      );
    }
  };

  const isCompletedManagementReview = () => {
    return visitingReview?.completed?.status;
  };

  return {
    managementReviews,
    processing,
    ReviewQueryTools,
    deleteReview,
    visitReview,
    visitingReview,
    isCompletedManagementReview,
    createReview,
    updateReview,
    completeReview,
    deleteAgenda,
    deleteMinute,
    fetchReviews,
    reloadReview,
    modalFilter,
    toggleModalFilter,
  };
}
