import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React, { useContext, useState } from "react";
import {
  createActivity as _createActivity,
  deleteActivity as _deleteActivity,
  getActivities as _getActivities,
  updateActivity as _updateActivity,
} from "@/services/activityService";
import USER_ACTIONS from "../actions";

export default function useActivityStore(config) {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const selectActivity = (activity) => {
    setSelectedActivity(activity);
  };
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  let {
    query,
    toolState,
    getQuery,
    updatePagination,
    handlePagination,
    handleRequired,
  } = useQuery({
    required: {
      value: { moduleType: config.moduleType, module: config.moduleId },
    },
  });
  const notify = useContext(NotificationContext);
  async function _loadActivities(qstr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_ACTIVITIES]: {
          status: true,
          error: false,
          hasMore: false,
        },
      });
      const { data } = await _getActivities({
        query: `${qstr}`,
      });
      if (data.pagination?.currentPage === 1) {
        setActivities(data.activities);
      } else setActivities((prevData) => [...prevData, ...data.activities]);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_ACTIVITIES]: {
          status: false,
          error: false,
          hasMore: data.pagination.hasNextPage,
        },
      });
    } catch (error) {
      _dispatch({
        [USER_ACTIONS.LOAD_ACTIVITIES]: {
          status: false,
          error: true,
          hasMore: false,
        },
      });
      notify("Failed to load activities", "danger");
    }
  }
  const viewMoreActivity = () => {
    handlePagination({ page: toolState.pagination.nextPage });
  };
  React.useEffect(() => {
    _loadActivities(getQuery());
  }, [query]);
  React.useEffect(() => {
    handleRequired &&
      handleRequired({
        value: { moduleType: config?.moduleType, module: config?.moduleId },
      });
  }, [config.moduleType, config.moduleId]);
  async function deleteActivity(id) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ACTIVITY]: {
          action: "delete-activity",
          id: id,
        },
      });
      await _deleteActivity(id);
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity._id !== id)
      );
      _dispatch({
        [USER_ACTIONS.DELETE_ACTIVITY]: {
          action: null,
          id: null,
        },
      });
      notify("Comment deleted successfully", "success");
    } catch (error) {
      _dispatch({
        [USER_ACTIONS.DELETE_ACTIVITY]: {
          action: null,
          id: null,
        },
      });
      notify("Failed to delete comment", "danger");
    }
  }
  async function createActivity(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_ACTIVITY]: {
          action: "create-activity",
          id: null,
        },
      });
      const { data } = await _createActivity({
        ...payload,
        moduleType: config.moduleType,
        moduleId: config.moduleId,
        metaInfo: config.metaInfo,
      });
      setActivities((prevActivities) => [data.activity, ...prevActivities]);
      _dispatch({
        [USER_ACTIONS.CREATE_ACTIVITY]: {
          action: null,
          id: null,
        },
      });
      notify("Comment added successfully", "success");
    } catch (error) {
      _dispatch({
        [USER_ACTIONS.CREATE_ACTIVITY]: {
          action: null,
          id: null,
        },
      });
      notify("Failed to add comment", "danger");
    }
  }
  async function updateActivity(payload) {
    if (selectedActivity) {
      try {
        _dispatch({
          [USER_ACTIONS.UPDATE_ACTIVITY]: {
            action: "update-activity",
            id: selectedActivity._id,
          },
        });
        const { data } = await _updateActivity(selectedActivity._id, payload);
        setActivities((prevActivities) =>
          prevActivities.map((activity) => {
            if (activity._id === data.activity._id) {
              return data.activity;
            }
            return activity;
          })
        );
        _dispatch({
          [USER_ACTIONS.UPDATE_ACTIVITY]: {
            action: null,
            id: null,
          },
        });
        notify("Comment updated successfully", "success");
      } catch (error) {
        _dispatch({
          [USER_ACTIONS.UPDATE_ACTIVITY]: {
            action: null,
            id: null,
          },
        });
        notify("Failed to update comment", "danger");
      }
    }
  }
  return {
    activities,
    processing,
    selectedActivity,
    readOnly: config?.readOnly,
    deleteActivity,
    createActivity,
    updateActivity,
    viewMoreActivity,
    selectActivity,
  };
}
