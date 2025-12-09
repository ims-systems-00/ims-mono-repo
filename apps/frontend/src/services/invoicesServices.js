import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/invoices`;

export function getInvoices({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}

// this is the api for creating invoice
export function CreateInvoice(invoice) {
  return http.post(`${apiEndPoint}/`, {
    group: invoice.group,
    customer: invoice.customer,
    due: new Date(moment(`${invoice.due}`, "DD/MM/YYYY hh:mm a")),
    totalAmount: invoice.calculations.total,
    discount: invoice.calculations.discount,
    vatFigure: invoice.calculations.vatFigure,
    entries: invoice.entries.map((entry) => ({
      item: entry.item,
      unitPrice: entry.unitPrice,
      units: entry.units,
      vatRate: entry.vatRate,
      vatFigure: entry.vatFigure,
      subTotal: entry.subTotal,
    })),
    emails: invoice.emails.filter((emailInfo) => emailInfo.email),
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateInvoice(invoiceId, invoice) {
  return http.put(`${apiEndPoint}/${invoiceId}`, {
    due: new Date(moment(`${invoice.due}`, "DD/MM/YYYY hh:mm a")),
    totalAmount: invoice.calculations.total,
    discount: invoice.calculations.discount,
    vatFigure: invoice.calculations.vatFigure,
    emails: invoice.emails.filter((emailInfo) => emailInfo.email),
    entries: invoice.entries.map((entry) => ({
      item: entry.item,
      unitPrice: entry.unitPrice,
      units: entry.units,
      vatRate: entry.vatRate,
      vatFigure: entry.vatFigure,
      subTotal: entry.subTotal,
    })),
  });
}

export function sendInvoice(invoiceId) {
  return http.put(`${apiEndPoint}/${invoiceId}/emails`);
}
export function paymentRecieved(invoiceId) {
  return http.put(`${apiEndPoint}/${invoiceId}/payments`);
}
export function downloadInvoice(invoiceId) {
  return http.get(`${apiEndPoint}/${invoiceId}/downloads`, {
    responseType: "arraybuffer",
  });
}

export function getInvoice(invoiceId) {
  return http.get(`${apiEndPoint}/${invoiceId}`);
}

export function deleteInvoice(invoiceId) {
  return http.delete(`${apiEndPoint}/${invoiceId}`);
}

export function mapToInvoiceModel(invoice) {
  return {
    data: {
      group: invoice.group,
      customer: invoice.customer && invoice.customer._id,
      due: moment(invoice.due).format("DD/MM/YYYY"),
      calculations: {
        total: invoice.calculations.total,
        discount: invoice.calculations.discount,
      },
      emails: [],
      entries: invoice.entries,
    },
    errors: {},
  };
}

export function mapToSendInvoiceModel(customer) {
  return {
    data: {
      name: customer.primaryContact,
      email: customer.email,
    },
    errors: {},
  };
}
