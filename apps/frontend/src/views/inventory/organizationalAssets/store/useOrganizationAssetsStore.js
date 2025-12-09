import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import * as organizationsAssetsApi from "@/services/inventoryServices";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "../actions";

export default function useOrganizationAssetsStore(config) {
  let id = config.match && config.match.params.id;
  let pathname = config.match.url;
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();

  let [organizationsAssets, setOrganizationsAssets] = React.useState([]);
  let [organization, setOrganization] = React.useState(null);
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };
  const visitOrganization = (organization) => {
    setOrganization(organization);
  };

  let OrganizationQueryTools = useQuery();

  const addToTable = (asset) =>
    setOrganizationsAssets((prevAssets) => [asset, ...prevAssets]);

  const fetchOrganizations = async (qStr) => {
    try {
      // setProcessing({ action: "load-information", id: null });
      _dispatch({
        [USER_ACTIONS.LOAD_ORGANIZATIONS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await organizationsAssetsApi.getInformations({
        query: `${qStr}`,
      });
      setOrganizationsAssets((prevData) => [...data.informationAssets]);
      OrganizationQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_ORGANIZATIONS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("Organisation", ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_ORGANIZATIONS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Could not load Assets", "danger");
    }
    // setProcessing({ action: null, id: null });
  };

  let updateDataTable = (updatedInformation) => {
    //  setProcessing({ action: "update", id: updatedInformation._id });
    setOrganizationsAssets((prevInformations) =>
      prevInformations.map((information) =>
        information._id === updatedInformation._id
          ? updatedInformation
          : information
      )
    );
    //  setProcessing({ action: null, id: null });
  };

  let handleDeleteOrganization = async (data) => {
    //  setProcessing({ action: "delete", id: data._id });
    try {
      await organizationsAssetsApi.deleteInformationAsset(data._id);
      setOrganizationsAssets((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== data._id)
      );
      successAlert("Asset deleted successfully");
      notify("Asset deleted successfully", "success");
    } catch (ex) {
      imsLogger("OrganisationTable", ex);
      notify("Could not delete Asset", "danger");
    }
    //  setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    (async function () {
      await fetchOrganizations(OrganizationQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [OrganizationQueryTools.query]);

  let refreshInformationAsset = (information) => {
    setOrganization(information);
    // props.onUpdate && props.onUpdate(information);
  };
  async function fetchOrganization() {
    try {
      let { data } = await organizationsAssetsApi.getInformation(id);
      visitOrganization(data.informationAsset);
      // setProcessing({ action: null, id: null, error: false });
    } catch (ex) {
      // setProcessing({ action: null, id: null, error: true });
      imsLogger("OrganisationAssetDetail", ex, ex.response);
    }
  }
  React.useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  let createOrganization = async (organization) => {
    try {
      // setProcessing({ action: "create", id: null });
      let { data } = await organizationsAssetsApi.createInformation(
        organization
      );
      notify("Asset created successfully", "success");
      addToTable && addToTable(data.informationAsset);
      visitOrganization && visitOrganization(data.informationAsset);
    } catch (ex) {
      imsLogger("OrganisationAssetForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
    // setProcessing({ action: null, id: null });
  };

  let updateOrganization = async (id, organization) => {
    try {
      // setProcessing({ action: "update", id: null });
      let { data } = await organizationsAssetsApi.updateInformation(
        id,
        organization
      );
      refreshInformationAsset && refreshInformationAsset(data.informationAsset);
      visitOrganization && visitOrganization(data.informationAsset);
      notify("Asset updated successfully", "success");
    } catch (ex) {
      imsLogger("OrganisationAssetForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
    // setProcessing({ action: null, id: null });
  };

  return {
    organizationsAssets,
    organization,
    visitOrganization,
    createOrganization,
    updateOrganization,
    handleDeleteOrganization,
    updateDataTable,
    fetchOrganizations,
    OrganizationQueryTools,
    processing,
    pathname,
    alert,
    warningWithConfirmMessage,
    successAlert,
    notify,
    fetchOrganization,
    modalFilter,
    toggleModalFilter,
  };
}
