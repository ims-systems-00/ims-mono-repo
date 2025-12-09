import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import React, { useState } from "react";
import USER_ACTIONS from "../actions";
import useQuery from "@/hooks/useQuery";
import filters from "../filters";
import * as customerAPi from "@/services/customerService";
import { imsLogger } from "@/services/loggerService";
import useAlerts from "@/hooks/useAlerts";
import useCache from "@/hooks/useCache";

export default function useStore(config) {
  const id = config.match && config.match.params.id;
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let [customers, setCustomers] = useState([]);
  let [visitingCustomer, setVisitingCustomer] = useState(null);
  let [dataSet, setDataSet] = useState(null);
  let [overview, setOverview] = useState(null);
  let [customerMappedData, setCustomerMappedData] = React.useState(null);
  let [customerOverview, setCustomerOverview] = React.useState(null);
  let [popAction, setPopAction] = React.useState(null);
  const { cacheData } = useCache();
  const [modalFilter, setModalFilter] = React.useState(false);
  const toggleModalFilter = () => {
    setModalFilter(!modalFilter);
  };
  const closeModalFilter = () => {
    setModalFilter(false);
  };

  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let handlePopAction = (action) => {
    setPopAction(action);
  };
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const visitCustomer = (customer) => {
    setVisitingCustomer(customer);
    if (customer?._id) fetchCustomerOverview(customer?._id);
  };

  let CustomerQueryTools = useQuery({
    filter: filters.find((item) => item.default),
  });

  const addToTable = (customer) =>
    setCustomers((prevCustomers) => [customer, ...prevCustomers]);

  const fetchCustomers = async (qstr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_CUSTOMERS]: { status: true, error: false, id: null },
      });
      let { data } = await customerAPi.getCustomers({
        query: `${qstr}`,
      });
      setCustomers(data.customers);
      CustomerQueryTools.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_CUSTOMERS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_CUSTOMERS]: { status: false, error: true, id: null },
      });
      imsLogger(ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };
  const loadMyOverview = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_MY_OVERVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await customerAPi.getMyCustomerOverview();
      setOverview(data.overview);
      let mapedData = customerAPi.mapToMyCustomerOverview(data.overview);
      setDataSet(mapedData);
      _dispatch({
        [USER_ACTIONS.LOAD_MY_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch {
      _dispatch({
        [USER_ACTIONS.LOAD_MY_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const fetchCustomer = async () => {
    _dispatch({
      [USER_ACTIONS.LOAD_CUSTOMER]: { status: true, error: false, id: null },
    });
    try {
      let { data } = await customerAPi.getCustomer(id);
      visitCustomer(data.customer);
      _dispatch({
        [USER_ACTIONS.LOAD_CUSTOMER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_CUSTOMER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  };

  const fetchCustomerOverview = async (customerId) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: { status: true, error: false, id: null },
      });
      let { data } = await customerAPi.getCustomerOverview(customerId);
      setCustomerOverview(data.overview);
      let mapedData = customerAPi.mapToCustomerOverview(data.overview);
      setCustomerMappedData(mapedData);
      _dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  };

  React.useEffect(() => {
    (async function () {
      await fetchCustomers(CustomerQueryTools.getQuery());
      await loadMyOverview();
      closeModalFilter();
    })();
  }, [CustomerQueryTools.query]);

  React.useEffect(() => {
    fetchCustomer();
  }, [id]);

  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_CUSTOMER]: {
        status: true,
        error: false,
        id: null,
      },
    });
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === updatedData._id ? updatedData : customer
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_CUSTOMER]: {
        status: false,
        error: false,
        id: null,
      },
    });
  };

  const deleteCustomer = async (customer) => {
    const customerId = customer._id;
    try {
      _dispatch({
        [USER_ACTIONS.REMOVE_CUSTOMER]: {
          status: true,
          error: false,
          id: customerId,
        },
      });
      await customerAPi.deleteCustomer(customerId);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );
      notify("Customer deleted successfully", "success");
      successAlert("Customer deleted successfully");
      _dispatch({
        [USER_ACTIONS.REMOVE_CUSTOMER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.REMOVE_CUSTOMER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Incidents", ex.response || ex);
      notify(ex.response?.data?.message, "danger");
    }
  };

  const createCustomer = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_CUSTOMER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await customerAPi.createCustomer(payload);
      // cacheData();
      addToTable(data.customer);
      visitCustomer(data.customer);
      notify("Customer created successfully", "success");
      _dispatch({
        [USER_ACTIONS.ADD_CUSTOMER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      notify("Unknown server issue occurred", "danger");
      imsLogger(ex.response || ex);
      _dispatch({
        [USER_ACTIONS.ADD_CUSTOMER]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };

  const updateCustomer = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_CUSTOMER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await customerAPi.updateCustomer(
        visitingCustomer._id,
        payload
      );
      visitCustomer(data.customer);
      updateDataTable(data.customer);
      notify("Customer updated successfully", "success");
      cacheData();
      _dispatch({
        [USER_ACTIONS.AMEND_CUSTOMER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_CUSTOMER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Unknown server issue occurred", "danger");
      imsLogger(ex.response || ex);
    }
  };

  return {
    customers,
    processing,
    CustomerQueryTools,
    visitCustomer,
    visitingCustomer,
    popAction,
    handlePopAction,
    deleteCustomer,
    createCustomer,
    updateCustomer,
    customerMappedData,
    customerOverview,
    overview,
    dataSet,
    fetchCustomers,
    modalFilter,
    toggleModalFilter,
    dispatch: _dispatch,
  };
}
