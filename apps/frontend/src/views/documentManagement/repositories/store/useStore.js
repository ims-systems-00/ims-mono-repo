import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { useHistory } from "react-router-dom";
import * as documentManagementApi from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import filters from "../filters/filters";
import USER_ACTIONS from "./actions";

export default function useStore(initializers) {
  let notify = React.useContext(NotificationContext);
  let [repositories, setRepositories] = React.useState([]);
  let { popUpAlerts, alert, warningWithConfirmMessage } = useAlerts();
  let [deletedRepositories, setDeletedRepositories] = React.useState([]);
  let [overview, setOverview] = React.useState(null);
  let history = useHistory();
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_OVERVIEW },
    { action: USER_ACTIONS.LOAD_REPOSITORIES, status: true, hasMore: true },
    {
      action: USER_ACTIONS.LOAD_DELETED_REPOSITORIES,
      status: true,
      hasMore: true,
    },
    { action: USER_ACTIONS.CREATE_REPOSITORY },
    { action: USER_ACTIONS.SOFT_DELETE_REPOSITORY },
    { action: USER_ACTIONS.HARD_DELETE_REPOSITORY },
    { action: USER_ACTIONS.RESTORE_REPOSITORY },
  ]);

  let {
    query: tableQuery,
    toolState,
    getQuery: getTableQuery,
    updatePagination,
    ...queryHandlers
  } = useQuery({
    required: {},
    filter: filters.find((item) => item.default),
  });

  let {
    query: deletedTableQuery,
    toolState: deletedToolState,
    getQuery: getDeletedTableQuery,
    updatePagination: deletedUpdatePagination,
    ...deletedQueryHandlers
  } = useQuery({
    required: {
      value: {
        deleteMarker: { status: true },
      },
    },
  });

  const fetchRepositories = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_REPOSITORIES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagementApi.getRepositories({
        query: `${qStr}`,
      });
      setRepositories(data.repositories);
      updatePagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_REPOSITORIES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_REPOSITORIES]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("useRepository", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  const fetchDeletedRepositories = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_DELETED_REPOSITORIES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagementApi.getRepositories({
        query: `${qStr}`,
      });
      setDeletedRepositories(data.repositories);
      deletedUpdatePagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_DELETED_REPOSITORIES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_DELETED_REPOSITORIES]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("RepositoryForm", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  React.useEffect(() => {
    fetchRepositories(getTableQuery());
  }, [tableQuery]);

  React.useEffect(() => {
    fetchDeletedRepositories(getDeletedTableQuery());
  }, [deletedTableQuery]);

  async function loadOverview() {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagementApi.getRepositoriesOverview();
      setOverview(data.overview);
      dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("RepositoryForm", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  }
  React.useEffect(() => {
    loadOverview();
  }, []);

  async function createRepository(payload) {
    try {
      let { data } = await documentManagementApi.createRepository(payload);
      history.push(`/admin/document-repositories/${data?.repository?._id}`);
      setRepositories((prevRepo) => [data.repository, ...prevRepo]);
      notify("Repository created successfully", "success");
    } catch (err) {
      imsLogger(err, err.message);
      notify(
        err.message || "Server error occured. Please try again later.",
        "danger",
      );
    }
  }

  async function handleHardDelete(deleteRepoId) {
    try {
      dispatch({
        [USER_ACTIONS.HARD_DELETE_REPOSITORY]: {
          status: true,
          error: false,
          id: deleteRepoId,
        },
      });
      let { data } =
        await documentManagementApi.hardDeleteRepository(deleteRepoId);
      setDeletedRepositories((prevRepos) =>
        prevRepos.filter((repo) => repo._id !== deleteRepoId),
      );
      popUpAlerts(
        `Repository ${data?.repository?.reference} deleted successfully.`,
        {
          icon: "",
        },
      );
      notify("Repository deleted successfully", "success");
      dispatch({
        [USER_ACTIONS.HARD_DELETE_REPOSITORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.HARD_DELETE_REPOSITORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DocumentTable", ex);
      notify("Document could not be deleted", "danger");
    }
  }
  async function handleRestore(restoreRepoId) {
    try {
      dispatch({
        [USER_ACTIONS.RESTORE_REPOSITORY]: {
          status: true,
          error: false,
          id: restoreRepoId,
        },
      });
      let { data } =
        await documentManagementApi.restoreRepository(restoreRepoId);
      setDeletedRepositories((prevRepos) =>
        prevRepos.filter((repo) => repo._id !== restoreRepoId),
      );
      setRepositories((prevRepos) => [data.repository, ...prevRepos]);
      popUpAlerts(
        `Repository ${data?.repository?.reference} restored successfully.`,
        {
          icon: "",
        },
      );
      notify("Repository restored successfully", "success");
      dispatch({
        [USER_ACTIONS.RESTORE_REPOSITORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.RESTORE_REPOSITORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DocumentTable", ex);
      notify("Document could not be restored", "danger");
    }
  }

  async function handleDelete(deleteRepoId) {
    try {
      dispatch({
        [USER_ACTIONS.SOFT_DELETE_REPOSITORY]: {
          status: true,
          error: false,
          id: deleteRepoId,
        },
      });
      const { data } =
        await documentManagementApi.softDeleteRepository(deleteRepoId);
      setRepositories((prevRepos) =>
        prevRepos.filter((repo) => repo._id !== deleteRepoId),
      );
      setDeletedRepositories((prevRepos) => [data.repository, ...prevRepos]);
      popUpAlerts(
        `Repository ${data?.repository?.reference} moved to recycle bin successfully.`,
        {
          icon: "",
        },
      );
      notify("Repository moved to bin successfully", "success");
      dispatch({
        [USER_ACTIONS.SOFT_DELETE_REPOSITORY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.SOFT_DELETE_REPOSITORY]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("DocumentTable", ex);
      notify("Document could not be deleted", "danger");
    }
  }

  const isLoadingOverview = () => {
    return processing[USER_ACTIONS.LOAD_OVERVIEW].status;
  };
  const isFetchingTable = () => {
    return processing[USER_ACTIONS.LOAD_REPOSITORIES].status;
  };
  const isFetchingDeletedRepositories = () => {
    return processing[USER_ACTIONS.LOAD_DELETED_REPOSITORIES].status;
  };

  return {
    fetchRepositories,
    overview,
    repositories,
    toolState,
    queryHandlers,
    processing,
    dispatch,
    alert,
    warningWithConfirmMessage,
    createRepository,
    fetchDeletedRepositories,
    deletedRepositories,
    deletedQueryHandlers,
    deletedToolState,
    handleRestore,
    handleHardDelete,
    handleDelete,
    isLoadingOverview,
    isFetchingTable,
    isFetchingDeletedRepositories,
  };
}
