import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import * as supplierApi from "@/services/supplierManagementServices";
import USER_ACTIONS from "../actions";

export default function useStore(config) {
  const id = config.match && config.match.params.id;
  let notify = React.useContext(NotificationContext);
  let [suppliers, setSuppliers] = React.useState([]);
  let [visitingSupplier, setVisitingSupplier] = React.useState(null);
  let [popAction, setPopAction] = React.useState(null);
  let { successAlert } = useAlerts();
  let [editMode, setEditMode] = React.useState(false);
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
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

  const visitSupplier = (supplier) => {
    setVisitingSupplier(supplier);
  };

  const initiateAllData = () => {
    fetchSupplier();
  };

  const fullReset = () => {
    setVisitingSupplier(null);
  };
  const reloadSupplier = () => {
    fullReset();
    initiateAllData();
  };

  let SupplierQueryTools = useQuery({});

  const addToTable = (supplier) =>
    setSuppliers((prevSuppliers) => [supplier, ...prevSuppliers]);

  const fetchSuppliers = async (qstr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIERS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await supplierApi.getSuppliers({
        query: `${qstr}`,
      });
      setSuppliers(data.suppliers);
      SupplierQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIERS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIERS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SupplierManagement", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  async function fetchSupplier() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let [loadSupplier, loadSupplierIncidents] = await Promise.all([
        supplierApi.getSupplier(visitingSupplier?._id || id),
        supplierApi.getSupplierIncidents(visitingSupplier?._id || id),
      ]);
      visitSupplier(loadSupplier.data.supplier);
      //   setSupplierIncidents(loadSupplierIncidents.data.incidents);
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_SUPPLIER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SupplierDetail", ex, ex.response);
    }
  }

  React.useEffect(() => {
    (async function () {
      await fetchSuppliers(SupplierQueryTools.getQuery());
      closeModalFilter();
    })();
  }, [SupplierQueryTools.query]);

  React.useEffect(() => {
    initiateAllData();
  }, [id]);

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_SUPPLIER]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier._id === updatedData._id ? updatedData : supplier
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_SUPPLIER]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  const deleteSupplier = async (supplier) => {
    let supplierId = supplier._id;
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_SUPPLIER]: {
          status: true,
          error: false,
          id: supplierId,
        },
      });
      let { data } = await supplierApi.deleteSupplier(supplierId);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier._id !== supplierId)
      );
      notify("Supplier  deleted successfully", "success");
      successAlert("Supplier deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_SUPPLIER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_SUPPLIER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Supplier", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
    }
  };

  const createSupplier = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_SUPPLIER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await supplierApi.createSupplier(payload);
      notify("Supplier created successfully ", "success");
      addToTable && addToTable(data.supplier);
      visitSupplier(data.supplier);
      _dispatch({
        [USER_ACTIONS.CREATE_SUPPLIER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.CREATE_SUPPLIER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger("Supplier", ex.response || ex);
    }
  };

  const updateSupplier = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_SUPPLIER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await supplierApi.updateSupplier(
        visitingSupplier._id,
        payload
      );
      notify("Supplier updated successfully ", "success");
      updateDataTable(data.supplier);
      visitSupplier(data.supplier);
      _dispatch({
        [USER_ACTIONS.AMEND_SUPPLIER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_SUPPLIER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server error occurred", "danger");
      imsLogger("Supplier", ex.response || ex);
    }
  };

  async function deleteContract(attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_CONTRACT]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await supplierApi.deleteContract(
        visitingSupplier._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitSupplier(data.supplier);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_ATTACHMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("supplier", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  async function deleteSLAs(attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_SLAS]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await supplierApi.deleteSla(
        visitingSupplier._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitSupplier(data.supplier);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_SLAS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_SLAS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("supplier", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  async function deleteOnboarding(attachment) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_ONBOARDING]: {
          status: true,
          error: false,
          id: attachment._id,
        },
      });
      let { data } = await supplierApi.deleteOnBoardingFile(
        visitingSupplier._id,
        attachment._id
      );
      await deleteFileFromS3(attachment.key || attachment.Key);
      visitSupplier(data.supplier);
      notify("Document deleted successfully", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_ONBOARDING]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_ONBOARDING]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("supplier", ex.response || ex);
      notify("Document delete failed. Unknown server error occurred", "danger");
    }
  }

  const deleteKpi = async (kpi) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_KPI]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await supplierApi.deleteKpiObjective(
        visitingSupplier._id,
        kpi._id
      );
      visitSupplier(data.supplier);
      notify("Kpi deleted successfully ", "success");
      _dispatch({
        [USER_ACTIONS.DELETE_KPI]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_KPI]: {
          status: false,
          error: true,
          id: null,
        },
      });

      notify("Unknown error occurred", "danger");
      imsLogger("Supplier", ex.response || ex);
    }
  };

  const addKpi = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_KPI]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await supplierApi.addKpiObjective(
        visitingSupplier._id,
        payload
      );
      visitSupplier(data.supplier);
      notify("Kpi deleted successfully ", "success");
      _dispatch({
        [USER_ACTIONS.ADD_KPI]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.ADD_KPI]: {
          status: false,
          error: true,
          id: null,
        },
      });

      notify("Unknown error occurred", "danger");
      imsLogger("Supplier", ex.response || ex);
    }
  };

  return {
    suppliers,
    processing,
    SupplierQueryTools,
    fetchSuppliers,
    visitingSupplier,
    popAction,
    handlePopAction,
    deleteSupplier,
    createSupplier,
    updateSupplier,
    visitSupplier,
    deleteContract,
    deleteSLAs,
    deleteOnboarding,
    editMode,
    toggleEditMode,
    deleteKpi,
    addKpi,
    reloadSupplier,
    modalFilter,
    toggleModalFilter,
  };
}
