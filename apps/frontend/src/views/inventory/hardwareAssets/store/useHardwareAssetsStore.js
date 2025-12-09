import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useQuery from "@/hooks/useQuery";
import React from "react";

import useProcessingControl from "@/hooks/useProcessingControl";
import * as hardwareAssetsApi from "@/services/inventoryServices";
import { imsLogger } from "@/services/loggerService";
import { listTagsAndCategories } from "@/services/tagsAndCategories";
import USER_ACTIONS from "../actions";

export default function useHardwareAssetsStore(config) {
  let id =
    (config.match && config.match.params.id) ||
    (config.view && config.view._id);
  let pathname = config.match.url;
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let [hardwareAssets, setHardwareAssets] = React.useState([]);
  let [hardware, setHardware] = React.useState(null);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  const visitHardware = (hardware) => {
    setHardware(hardware);
  };
  let HardwareQueryTools = useQuery();
  const addToTable = (asset) =>
    setHardwareAssets((prevAssets) => [asset, ...prevAssets]);
  const fetchHardwares = async (qStr) => {
    try {
      // setProcessing({ action: "load-hardware", id: null });
      _dispatch({
        [USER_ACTIONS.LOAD_HARDWARES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await hardwareAssetsApi.getHardwareAssets({
        query: `${qStr}`,
      });
      setHardwareAssets((prevData) => [...data.hardwareAssets]);
      HardwareQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_HARDWARES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Hardware", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_HARDWARES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let updateDataTable = (updatedHardware) => {
    // setProcessing({ action: "update", id: updatedHardware._id });
    _dispatch({
      [USER_ACTIONS.UPDATE_HARDWARE]: {
        status: true,
        error: false,
        id: updatedHardware._id,
      },
    });
    setHardwareAssets((prevHardwareAsset) =>
      prevHardwareAsset.map((hardware) =>
        hardware._id === updatedHardware._id ? updatedHardware : hardware
      )
    );
    // setProcessing({ action: null, id: null });
    _dispatch({
      [USER_ACTIONS.UPDATE_HARDWARE]: {
        status: false,
        error: false,
        id: updatedHardware._id,
      },
    });
  };

  let handleDelete = async (data) => {
    // setProcessing({ action: "delete", id: data._id });
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_HARDWARE]: {
          status: true,
          error: false,
          id: data._id,
        },
      });

      await hardwareAssetsApi.deleteHardwareAsset(data._id);
      setHardwareAssets((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== data._id)
      );
      successAlert("Asset deleted successfully");
      notify("Hardware asset deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_HARDWARE]: {
          status: false,
          error: false,
          id: data._id,
        },
      });
    } catch (ex) {
      imsLogger("HardwareTable", ex);
      notify("Could not delete asset", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_HARDWARE]: {
          status: false,
          error: true,
          id: data._id,
        },
      });
    }
    // setProcessing({ action: null, id: null });
  };

  async function fetchHardware() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_HARDWARE]: {
          status: true,
          error: false,
          id: null,
        },
      });

      let { data } = await hardwareAssetsApi.getHardwareAsset(id);
      setHardware(data.hardwareAsset);
      // setProcessing({ action: null, id: null, error: false });
      _dispatch({
        [USER_ACTIONS.LOAD_HARDWARE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      // setProcessing({ action: null, id: null, error: true });
      imsLogger("HardwareAssetDetail", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_HARDWARE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  const createHardwareAsset = async (hardware) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_HARDWARE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await hardwareAssetsApi.createHardwareAsset(hardware);
      notify("Asset created successfully", "success");
      addToTable && addToTable(data.hardwareAsset);
      visitHardware && visitHardware(data.hardwareAsset);
      _dispatch({
        [USER_ACTIONS.CREATE_HARDWARE]: {
          status: false,
          error: false,
          id: null,
        },
      });
      return data;
    } catch (ex) {
      imsLogger("HardwareAssetForm", ex.response, ex);
      _dispatch({
        [USER_ACTIONS.CREATE_HARDWARE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const updateHardwareAsset = async (hardwareId, hardware) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_HARDWARE]: {
          status: true,
          error: false,
          id: hardwareId,
        },
      });
      let { data } = await hardwareAssetsApi.updateHardwareAsset(
        hardwareId,
        hardware
      );
      notify("Asset updated successfully", "success");
      visitHardware(data.hardwareAsset);
      _dispatch({
        [USER_ACTIONS.UPDATE_HARDWARE]: {
          status: false,
          error: false,
          id: hardwareId,
        },
      });
      return data;
    } catch (ex) {
      imsLogger("HardwareAssetForm", ex.response, ex);
      _dispatch({
        [USER_ACTIONS.UPDATE_HARDWARE]: {
          status: false,
          error: true,
          id: hardwareId,
        },
      });
    }
  };

  React.useEffect(() => {
    if (hardware?._id || id) {
      fetchHardware();
    }
  }, [id]);

  React.useEffect(() => {
    (async function () {
      await fetchHardwares(HardwareQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [HardwareQueryTools.query]);

  return {
    hardwareAssets,
    HardwareQueryTools,
    addToTable,
    updateDataTable,
    handleDelete,
    alert,
    warningWithConfirmMessage,
    fetchHardware,
    fetchHardwares,
    hardware,
    visitHardware,
    processing,
    createHardwareAsset,
    updateHardwareAsset,
    pathname,
    modalFilter,
    toggleModalFilter,
  };
}
