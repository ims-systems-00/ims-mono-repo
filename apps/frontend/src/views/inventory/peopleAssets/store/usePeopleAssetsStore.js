import useProcessingControl from "@/hooks/useProcessingControl";
import USER_ACTIONS from "../actions";
import { imsLogger } from "@/services/loggerService";
import React from "react";
import NotificationContext from "@/contexts/notificationContext";
import useQuery from "@/hooks/useQuery";
import * as peopleAssetsApi from "@/services/inventoryServices";
import useAlerts from "@/hooks/useAlerts";

export default function usePeopleAssetsStore(config) {
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  const notify = React.useContext(NotificationContext);
  let id = config.match && config.match.params.id;
  let pathname = config.match.url;
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  let [peopleAssets, setPeopleAssets] = React.useState([]);
  let [people, setPeople] = React.useState(null);
  const visitPeople = (people) => {
    setPeople(people);
  };

  let PeopleQueryTools = useQuery();

  const addToTable = (people) =>
    setPeopleAssets((prevPeoples) => [people, ...prevPeoples]);

  const fetchPeoples = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_PEOPLES]: {
          status: true,
          error: false,
          id: null,
        },
      });

      let { data } = await peopleAssetsApi.getPeopleAssets({
        query: `${qStr}`,
      });
      setPeopleAssets((prevData) => [...data.peopleAssets]);
      PeopleQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_PEOPLES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("People", ex);
      _dispatch({
        [USER_ACTIONS.LOAD_PEOPLES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  React.useEffect(() => {
    (async function () {
      await fetchPeoples(PeopleQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [PeopleQueryTools.query]);

  let refreshPeopleAsset = (people) => {
    setPeople(people);
    config.onUpdate && config.onUpdate(people);
  };
  async function fetchPeople() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_PEOPLE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await peopleAssetsApi.getPeopleAsset(id);
      setPeople(data.peopleAsset);
      _dispatch({
        [USER_ACTIONS.LOAD_PEOPLE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PeopleAssetDetail", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_PEOPLE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  React.useEffect(() => {
    if (id) {
      fetchPeople();
    }
  }, [id]);

  const createPeople = async (people) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_PEOPLE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await peopleAssetsApi.createPeopleAsset(people);
      notify("Asset created Successfully", "success");
      addToTable && addToTable(data.peopleAsset);
      visitPeople(data.peopleAsset);
      _dispatch({
        [USER_ACTIONS.CREATE_PEOPLE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PeopleAssetForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.CREATE_PEOPLE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const updatePeople = async (id, people) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_PEOPLE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await peopleAssetsApi.updatePeopleAsset(id, people);
      refreshPeopleAsset && refreshPeopleAsset(data.peopleAsset);
      visitPeople(data.peopleAsset);
      notify("Asset updated Successfully", "success");
      _dispatch({
        [USER_ACTIONS.UPDATE_PEOPLE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PeopleAssetForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
      _dispatch({
        [USER_ACTIONS.UPDATE_PEOPLE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  let updateDataTable = (updatedPeople) => {
    _dispatch({
      [USER_ACTIONS.UPDATE_PEOPLE]: {
        status: true,
        error: false,
        id: null,
      },
    });

    setPeopleAssets((prevPeoples) =>
      prevPeoples.map((people) =>
        people._id === updatedPeople._id ? updatedPeople : people
      )
    );
    _dispatch({
      [USER_ACTIONS.UPDATE_PEOPLE]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };
  let handlePeopleDelete = async (data) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_PEOPLE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await peopleAssetsApi.deletePeopleAsset(data._id);
      setPeopleAssets((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== data._id)
      );
      successAlert("Asset deleted successfully");
      notify("People asset deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_PEOPLE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("PeopleTable", ex);
      notify("Could not delete asset", "danger");
      _dispatch({
        [USER_ACTIONS.DELETE_PEOPLE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  return {
    peopleAssets,
    people,
    visitPeople,
    processing,
    createPeople,
    updatePeople,
    fetchPeoples,
    PeopleQueryTools,
    pathname,
    updateDataTable,
    handlePeopleDelete,
    alert,
    warningWithConfirmMessage,
    successAlert,
    modalFilter,
    toggleModalFilter,
  };
}
