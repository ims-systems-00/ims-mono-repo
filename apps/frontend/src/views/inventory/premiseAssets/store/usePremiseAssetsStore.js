import useProcessingControl from "@/hooks/useProcessingControl";
import USER_ACTIONS from "../actions";
import React from "react";
import NotificationContext from "@/contexts/notificationContext";
import useQuery from "@/hooks/useQuery";
import * as premiseAssetApi from "@/services/inventoryServices";
import { imsLogger } from "@/services/loggerService";
import useAlerts from "@/hooks/useAlerts";

export default function usePremiseAssetsStore(config) {
  let id = config.match && config.match.params.id;
  let pathname = config.match.url;
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  let [premisesAssets, setPremisesAssets] = React.useState([]);
  let [premise, setPremise] = React.useState(null);
  let visitPremise = (premise) => {
    setPremise(premise);
  };
  let PremiseQueryTools = useQuery();

  const addToTable = (premise) =>
    setPremisesAssets((prevPremises) => [premise, ...prevPremises]);

  const fetchPremises = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_PREMISES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await premiseAssetApi.getPremiseAssets({
        query: `${qStr}`,
      });
      setPremisesAssets((prevData) => [...data.premiseAssets]);
      PremiseQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_PREMISES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Premises", ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_PREMISES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const refreshPremiseAsset = (premise) => {
    setPremise(premise);
    config.onUpdate && config.onUpdate(premise);
  };

  async function fetchPremise() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_PREMISE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await premiseAssetApi.getPremiseAsset(id);
      visitPremise(data.premiseAsset);
      _dispatch({
        [USER_ACTIONS.LOAD_PREMISE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PremiseDetails", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_PREMISE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  const createPremiseAsset = async (premise) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_PREMISE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await premiseAssetApi.createPremiseAsset(premise);
      notify("Asset created successfully", "success");
      addToTable && addToTable(data.premiseAsset);
      visitPremise(data.premiseAsset);
      _dispatch({
        [USER_ACTIONS.CREATE_PREMISE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PremiseForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.CREATE_PREMISE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const updatePremiseAsset = async (id, premise) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_PREMISE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await premiseAssetApi.updatePremiseAsset(id, premise);
      notify("Asset updated successfully", "success");
      refreshPremiseAsset && refreshPremiseAsset(data.premiseAsset);
      visitPremise(data.premiseAsset);
      _dispatch({
        [USER_ACTIONS.UPDATE_PREMISE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PremiseForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.UPDATE_PREMISE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let updateDataTable = (updatedPremise) => {
    _dispatch({
      [USER_ACTIONS.UPDATE_PREMISE]: {
        status: true,
        error: false,
        id: updatedPremise._id,
      },
    });
    setPremisesAssets((prevPremises) =>
      prevPremises.map((premise) =>
        premise._id === updatedPremise._id ? updatedPremise : premise
      )
    );
    _dispatch({
      [USER_ACTIONS.UPDATE_PREMISE]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  async function handlePremiseDelete(data) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_PREMISE]: {
          status: true,
          error: false,
          id: data._id,
        },
      });
      await premiseAssetApi.deletePremiseAsset(data._id);
      setPremisesAssets((prevPremises) =>
        prevPremises.filter((premise) => premise._id !== data._id)
      );
      successAlert("Asset deleted successfully");
      notify("Premise deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_PREMISE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PremisesTable", ex);
      notify("Could not delete asset", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_PREMISE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  React.useEffect(() => {
    if (id) {
      fetchPremise();
    }
  }, [id]);

  React.useEffect(() => {
    (async function () {
      await fetchPremises(PremiseQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [PremiseQueryTools.query]);

  return {
    id,
    pathname,
    premisesAssets,
    premise,
    visitPremise,
    fetchPremises,
    PremiseQueryTools,
    createPremiseAsset,
    updatePremiseAsset,
    updateDataTable,
    handlePremiseDelete,
    processing,
    alert,
    warningWithConfirmMessage,
    successAlert,
    refreshPremiseAsset,
    notify,
    modalFilter,
    toggleModalFilter,
  };
}
