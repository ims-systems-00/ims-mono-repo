import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React, { useContext, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import * as tagsApi from "../../../services/tagsAndCategories";
import USER_ACTIONS from "./actions";
import filters from "./filters";

export default function useStore(config) {
  let id = config.match && config.match.params.id;
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const [tagsAndCategories, setTagsAndCategories] = useState([]);
  const [visitingTagAndCategory, setVisitingTagAndCategory] = useState(null);

  let notify = useContext(NotificationContext);

  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  const visitTagsCategory = (tag) => {
    setVisitingTagAndCategory(tag);
  };
  const initiateAllData = () => {
    fetchTag();
  };

  const fullReset = () => {
    setVisitingTagAndCategory(null);
  };
  const reloadTag = () => {
    fullReset();
    initiateAllData();
  };
  let {
    query,
    toolState,
    getQuery,
    handleSearch,
    updatePagination,
    ...queryHandlers
  } = useQuery({
    filter: filters.find((item) => item.default),
    required: config.applicableModules
      ? {
          value: {
            applicableModules: config.applicableModules,
          },
        }
      : {},
  });

  function searchTags(keywords) {
    handleSearch({ value: { clientSearch: keywords } });
  }

  const addToTable = (tag) =>
    setTagsAndCategories((prevTags) => [...tag, ...prevTags]);

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.UPDATE_TAG_AND_CATEGORY]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setTagsAndCategories((prevTags) =>
      prevTags.map((tag) => (tag._id === updatedData._id ? updatedData : tag))
    );
    _dispatch({
      [USER_ACTIONS.UPDATE_TAG_AND_CATEGORY]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };
  const fetchTags = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LIST_TAG_AND_CATEGORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await tagsApi.listTagsAndCategories({
        query: `${qStr}`,
      });
      setTagsAndCategories(data.tagsAndCategories);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LIST_TAG_AND_CATEGORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LIST_TAG_AND_CATEGORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("tags", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  async function fetchTag() {
    try {
      _dispatch({
        [USER_ACTIONS.GET_TAG_AND_CATEGORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await tagsApi.getTagsAndCategory(
        visitingTagAndCategory?._id || id
      );
      visitTagsCategory(data.tagAndCategory);
      _dispatch({
        [USER_ACTIONS.GET_TAG_AND_CATEGORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.GET_TAG_AND_CATEGORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("tags", ex, ex.response);
    }
  }

  React.useEffect(() => {
    fetchTags(getQuery());
  }, [query]);

  React.useEffect(() => {
    if (id) initiateAllData();
  }, [id]);

  async function createTagsAndCategories(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_TAG_AND_CATEGORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await tagsApi.createTagsAndCategories(payload);
      setTagsAndCategories((prevTags) => [data.tagAndCategory, ...prevTags]);
      visitTagsCategory(data.tagAndCategory);
      notify("New tag added.", "success");
      _dispatch({
        [USER_ACTIONS.CREATE_TAG_AND_CATEGORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      notify("Failed to add category", "danger");
      _dispatch({
        [USER_ACTIONS.CREATE_TAG_AND_CATEGORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  async function updateTagsAndCategories(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_TAG_AND_CATEGORY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await tagsApi.updateTagsAndCategories(
        visitingTagAndCategory?._id,
        payload
      );
      visitTagsCategory(data.tagAndCategory);
      notify("Tag updated successfully.", "success");
      _dispatch({
        [USER_ACTIONS.UPDATE_TAG_AND_CATEGORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      notify("Failed to update category", "danger");
      _dispatch({
        [USER_ACTIONS.UPDATE_TAG_AND_CATEGORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  const deleteTagAndCategory = async (tag) => {
    const tagId = tag?._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_TAG_AND_CATEGORY]: {
          status: true,
          error: false,
          id: tagId,
        },
      });
      let { data } = await tagsApi.deleteTagsAndCategory(tagId);
      setTagsAndCategories((prevTags) =>
        prevTags.filter((tag) => tag._id !== data.tagAndCategory._id)
      );
      notify("Tag deleted successfully", "success");
      successAlert("Tag deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_TAG_AND_CATEGORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_TAG_AND_CATEGORY]: {
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

  return {
    tagsAndCategories,
    query,
    processing,
    toolState,
    getQuery,
    updatePagination,
    queryHandlers,
    fetchTags,
    visitTagsCategory,
    visitingTagAndCategory,
    createTagsAndCategories,
    updateTagsAndCategories,
    deleteTagAndCategory,
    searchTags,
  };
}
