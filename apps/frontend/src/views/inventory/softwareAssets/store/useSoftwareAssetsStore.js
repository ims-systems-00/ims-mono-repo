import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import * as softwareAssetApi from "@/services/inventoryServices";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "../actions";

export default function useSoftwareAssetsStore(config) {
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();

  let id =
    (config.match && config.match.params.id) ||
    (config.view && config.view._id);
  let pathname = config.match.url;
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  let [softwareAssets, setSoftwareAssets] = React.useState([]);
  let [software, setSoftware] = React.useState(null);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };

  const visitSoftware = (visit) => {
    setSoftware(visit);
  };
  let SoftwareQueryTools = useQuery();
  const addToTable = (asset) =>
    setSoftwareAssets((prevAssets) => [asset, ...prevAssets]);

  const fetchSoftwares = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SOFTWARES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await softwareAssetApi.getSoftwareAssets({
        query: `${qStr}`,
      });
      setSoftwareAssets(data.softwareAssets);
      SoftwareQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_SOFTWARES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Software", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_SOFTWARES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  React.useEffect(() => {
    (async function () {
      await fetchSoftwares(SoftwareQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [SoftwareQueryTools.query]);

  const createSoftwareAsset = async (software) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_SOFTWARE]: {
          status: true,
          error: false,
          id: null,
        },
      });

      let { data } = await softwareAssetApi.createSoftwareAsset(software);
      notify("Asset created successfully", "success");
      addToTable && addToTable(data.softwareAsset);
      visitSoftware(data.softwareAsset);
      _dispatch({
        [USER_ACTIONS.CREATE_SOFTWARE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("SoftwareAssetForm", ex.response, ex);
      notify(" Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.CREATE_SOFTWARE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const updateSoftwareAsset = async (softwareId, software) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_SOFTWARE]: {
          status: true,
          error: false,
          id: null,
        },
      });

      let { data } = await softwareAssetApi.updateSoftwareAsset(
        softwareId,
        software
      );
      notify("Asset updated successfully", "success");
      refreshSoftwareAsset && refreshSoftwareAsset(data.softwareAsset);
      visitSoftware(data.softwareAsset);
      _dispatch({
        [USER_ACTIONS.UPDATE_SOFTWARE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("SoftwareAssetForm", ex.response, ex);
      notify(" Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.UPDATE_SOFTWARE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let refreshSoftwareAsset = (software) => {
    setSoftware(software);
    config.onUpdate && config.onUpdate(software);
  };

  async function fetchSoftware() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SOFTWARE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await softwareAssetApi.getSoftwareAsset(id);
      setSoftware(data.softwareAsset);
      _dispatch({
        [USER_ACTIONS.LOAD_SOFTWARE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_SOFTWARE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SoftwareAssetDetail", ex, ex.response);
    }
  }
  React.useEffect(() => {
    if (id) {
      fetchSoftware();
    }
  }, [id]);

  let handleAddSoftwareDoc = async (softwareId, software) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_SOFTWARE_DOC]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await softwareAssetApi.addSoftwareDoc(
        softwareId,
        software
      );
      notify("Software Document added successfully ", "success");
      refreshSoftwareAsset(data.softwareAsset);
      visitSoftware(data.softwareAsset);
      _dispatch({
        [USER_ACTIONS.ADD_SOFTWARE_DOC]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("SoftwareDocForm", ex.response || ex);
      notify("Operation failed. Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.ADD_SOFTWARE_DOC]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let handleAddSoftwareKey = async (softwareId, software) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_SOFTWARE_KEY]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await softwareAssetApi.addSoftwareKeys(
        softwareId,
        software
      );
      notify("Software Keys added successfully ", "success");
      refreshSoftwareAsset(data.softwareAsset);
      visitSoftware(data.softwareAsset);
      _dispatch({
        [USER_ACTIONS.ADD_SOFTWARE_KEY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("SoftwareKeyForm", ex.response || ex);
      notify("Operation failed. Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.ADD_SOFTWARE_KEY]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let handleDeleteKey = async (softwareId, softwareKeyId) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE_KEY]: {
          status: true,
          error: false,
          id: softwareKeyId,
        },
      });
      let { data } = await softwareAssetApi.deleteSoftwareKeys(
        softwareId,
        softwareKeyId
      );
      refreshSoftwareAsset(data.softwareAsset);
      visitSoftware(data.softwareAsset);
      notify("Software Key deleted successfully ", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE_KEY]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("SoftwareKeys", ex.response || ex);
      notify("Operation failed.Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE_KEY]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let updateDataTable = (updatedSoftware) => {
    _dispatch({
      [USER_ACTIONS.UPDATE_SOFTWARE]: {
        status: true,
        error: false,
        id: updatedSoftware._id,
      },
    });

    setSoftwareAssets((prevSoftwares) =>
      prevSoftwares.map((software) =>
        software._id === updatedSoftware._id ? updatedSoftware : software
      )
    );
    _dispatch({
      [USER_ACTIONS.UPDATE_SOFTWARE]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  let handleSoftwareDelete = async (softwareId) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE]: {
          status: true,
          error: false,
          id: softwareId,
        },
      });

      await softwareAssetApi.deleteSoftwareAsset(softwareId);
      setSoftwareAssets((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== softwareId)
      );
      successAlert("Asset deleted successfully");
      notify("Software asset deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("SoftwareTable", ex);
      notify("Could not delete asset", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };
  async function handleDeleteSoftwareDoc(softwareId, attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE_DOC]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await softwareAssetApi.deleteSoftwareDoc(
        softwareId,
        attachment._id
      );
      await deleteFileFromS3(attachment.key);
      refreshSoftwareAsset(data.softwareAsset);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE_DOC]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Documents", ex.response || ex);
      notify("Could not delete the document", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_SOFTWARE_DOC]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
    // setProcessing({ action: null, id: null });
  }

  return {
    id,
    pathname,
    software,
    softwareAssets,
    visitSoftware,
    fetchSoftwares,
    createSoftwareAsset,
    updateSoftwareAsset,
    handleAddSoftwareDoc,
    handleAddSoftwareKey,
    handleDeleteKey,
    updateDataTable,
    handleSoftwareDelete,
    SoftwareQueryTools,
    alert,
    notify,
    warningWithConfirmMessage,
    successAlert,
    processing,
    handleDeleteSoftwareDoc,
    modalFilter,
    toggleModalFilter,
  };
}
