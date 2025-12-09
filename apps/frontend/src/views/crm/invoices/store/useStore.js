import useProcessingControl from "@/hooks/useProcessingControl";
import USER_ACTIONS from "../actions";
import * as invoiceApi from "@/services/invoicesServices";
import React from "react";
import useQuery from "@/hooks/useQuery";
import filters from "../filters";
import { imsLogger } from "@/services/loggerService";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import { asynchronously } from "@/utils/asynchronous";
import { downloader } from "@/services/utils/downloader";
import { getOrganization } from "@/services/organizationService";
import { useApplication } from "@/stores/applicationStore";

export default function useStore(config) {
  const customer = config?.customer ? config.customer : null;
  // const customerId = config?.customer? config.customer._id : null
  let id = config?.match?.params.id;
  let notify = React.useContext(NotificationContext);
  let [invoices, setInvoices] = React.useState([]);
  let [visitingInvoice, setVisitingInvoice] = React.useState(null);
  let [mapInvoice, setMapInvoice] = React.useState(null);
  let { tokenPair } = useApplication();
  const [organisationInfo, setOrganistionInfo] = React.useState(null);
  let [refreshTable, setRefreshTable] = React.useState(false);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  let { successAlert } = useAlerts();

  const addToTable = (invoice) =>
    setInvoices((prevInvoices) => [invoice, ...prevInvoices]);
  let updateDataTable = (updatedData) => {
    _dispatch({
      [USER_ACTIONS.AMEND_INVOICE]: { status: true, error: false, id: null },
    });
    setInvoices((prevInvoice) =>
      prevInvoice.map((invoice) =>
        invoice._id === updatedData._id ? updatedData : invoice
      )
    );
    _dispatch({
      [USER_ACTIONS.AMEND_INVOICE]: { status: false, error: false, id: null },
    });
  };

  const visitInvoice = (invoice) => {
    setVisitingInvoice(invoice);
  };

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: { value: { customer: customer?._id } },
      filter: filters.find((item) => item.default),
    });

  const loadInvoices = async (qstr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_INVOICES]: { status: true, error: false, id: null },
      });
      let { data } = await invoiceApi.getInvoices({
        query: `${qstr}`,
      });
      setInvoices(data.invoices);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_INVOICES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_INVOICES]: { status: false, error: true, id: null },
      });
      imsLogger(ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  async function fetchInvoice() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_INVOICE]: { status: true, error: false, id: null },
      });
      let { data } = await invoiceApi.getInvoice(id);
      let mapedInvoice = invoiceApi.mapToInvoiceModel(data.invoice);
      setMapInvoice(mapedInvoice);
      setVisitingInvoice(data.invoice);
      _dispatch({
        [USER_ACTIONS.LOAD_INVOICE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_INVOICE]: { status: false, error: true, id: null },
      });
    }
  }
  React.useEffect(() => {
    if (id) {
      fetchInvoice();
    } else {
      loadInvoices(getQuery());
    }
  }, [id, query]);

  React.useEffect(() => {
    async function fetchOrganisation() {
      try {
        let { data } = await getOrganization(
          tokenPair?.accessTokenData?.user?.organizationId
        );
        setOrganistionInfo(data.organization);
      } catch (ex) {
        imsLogger("IncidentDetail", ex, ex.response);
      }
    }
    fetchOrganisation();
  }, []);

  let deleteInvoice = async (data) => {
    let invoiceId = data._id;
    try {
      _dispatch({
        [USER_ACTIONS.REMOVE_INVOICE]: {
          status: true,
          error: false,
          id: invoiceId,
        },
      });
      let { data } = await invoiceApi.deleteInvoice(invoiceId);
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
      notify("Invoice deleted successfully", "success");
      successAlert("Invoice deleted successfully");
      _dispatch({
        [USER_ACTIONS.REMOVE_INVOICE]: {
          status: true,
          error: false,
          id: invoiceId,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.REMOVE_INVOICE]: {
          status: false,
          error: false,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Invoice delete failed. Unknown server error occurred", "danger");
    }
  };

  const createInvoice = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_INVOICE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await invoiceApi.CreateInvoice(payload);
      notify("Invoice created successfully", "success");
      addToTable && addToTable(data.invoice);
      setRefreshTable(true);
      _dispatch({
        [USER_ACTIONS.ADD_INVOICE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err || err.message);
      _dispatch({
        [USER_ACTIONS.ADD_INVOICE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    }
  };
  async function updateInvoice(payload) {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_INVOICE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await invoiceApi.updateInvoice(
        visitingInvoice._id,
        payload
      );
      notify("Invoice updated successfully", "success");
      visitInvoice(data.invoice);
      updateDataTable(data.invoice);
      _dispatch({
        [USER_ACTIONS.AMEND_INVOICE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.AMEND_INVOICE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    }
  }

  async function resendInvoice() {
    _dispatch({
      [USER_ACTIONS.RESEND_INVOICE]: {
        status: true,
        error: false,
        id: null,
      },
    });
    const [resendError, { data }] = await asynchronously(
      invoiceApi.sendInvoice(visitingInvoice._id)
    );
    visitInvoice(data.invoice);
    if (resendError) notify("Invoice resend failed", "danger");
    notify("Invoice resend successfully", "success");
    _dispatch({
      [USER_ACTIONS.RESEND_INVOICE]: {
        status: false,
        error: false,
        id: null,
      },
    });
  }

  async function downloadInvoice() {
    _dispatch({
      [USER_ACTIONS.DOWNLOAD_INVOICE]: {
        status: true,
        error: false,
        id: null,
      },
    });
    const [downloadError, downloadResponse] = await asynchronously(
      invoiceApi.downloadInvoice(visitingInvoice._id)
    );
    if (downloadError) notify("Invoice download failed", "danger");
    downloader(`Invoice#00${visitingInvoice.ID}.pdf`, downloadResponse.data);
    notify("Invoice downloaded successfully", "success");
    _dispatch({
      [USER_ACTIONS.DOWNLOAD_INVOICE]: {
        status: false,
        error: false,
        id: null,
      },
    });
  }

  async function payment() {
    _dispatch({
      [USER_ACTIONS.PAYMENT]: {
        status: true,
        error: false,
        id: null,
      },
    });
    const [paymentError, { data }] = await asynchronously(
      invoiceApi.paymentRecieved(visitingInvoice._id)
    );
    notify("This invoice is marked as paid successfully", "success");
    successAlert("Invoice is marked as paid successfully");
    visitInvoice(data.invoice);
    if (paymentError) notify("Could not update invoice", "danger");

    _dispatch({
      [USER_ACTIONS.PAYMENT]: {
        status: false,
        error: false,
        id: null,
      },
    });
  }

  const saveAndSendInvoice = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await invoiceApi.CreateInvoice(payload);
      let senInvoiceResponse = await invoiceApi.sendInvoice(data.invoice._id);
      addToTable && addToTable(senInvoiceResponse.data.invoice);
      setRefreshTable(true);
      notify(
        `Invoice saved and sent to ${senInvoiceResponse.data.invoice.emails.map(
          (email) => email.name
        )}`,
        "success"
      );
      successAlert("Invoice saved and sent successfully");
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred", "danger");
    }
  };

  const updateAndSendInvoice = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await invoiceApi.updateInvoice(
        visitingInvoice._id,
        payload
      );
      let sentResponse = await invoiceApi.sendInvoice(data.invoice._id);
      visitInvoice(sentResponse.data.invoice);
      notify(`Invoice saved and sent to ${payload.email}`, "success");
      successAlert("Invoice saved and sent successfully");
      _dispatch({
        [USER_ACTIONS.UPDATE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.UPDATE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred", "danger");
    }
  };

  return {
    customer,
    visitingInvoice,
    visitInvoice,
    processing,
    invoices,
    query,
    toolState,
    getQuery,
    updatePagination,
    queryHandlers,
    deleteInvoice,
    createInvoice,
    updateInvoice,
    downloadInvoice,
    payment,
    saveAndSendInvoice,
    updateAndSendInvoice,
    resendInvoice,
    organisationInfo,
  };
}
