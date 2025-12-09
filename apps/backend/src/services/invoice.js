const { asynchronously, imsPaginationFormated } = require("./utility");
const UserModel = require("../models/mongodb/system/users&auth/user");
const InvoiceModel = require("../models/mongodb/system/crm/invoice");
const OrganizationModel = require("../models/mongodb/system/organization/organization");
const { sendMail } = require("../email/sendMail");
const { puppeteerPdf: pdfMaker } = require("../controllers/utils/pdfMaker");
const FileHandlerService = require("./fileHandler");
const OrganisationService = require("./organisation");
const Trigger = require("../services/triggers");

const moment = require("moment");
const fs = require("fs");
const PaymentService = require("./payments");
const CRMService = require("./crm");
const { basicRoleScopedFilter } = require("../queries");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { mainChannel } = require("../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../eventsV2/topicsName");
class InvoiceService extends CRMService {
  constructor(connection) {
    super(connection);
    this.connection = connection;
    this.User = UserModel(connection);
    this.Invoice = InvoiceModel(connection);
    this.Organization = OrganizationModel(connection);
    this.trigger = new Trigger(connection);
  }
  async createInvoice(data) {
    let customer = await this.getCustomer(data.customer);
    let invoice = await this.Invoice.create({
      organization: this.connection.user.organizationId,
      group: data.group,
      customer: data.customer,
      due: data.due,
      accountManager: customer.accountManager._id,
      entries: data.entries,
      emails: data.emails,
      "calculations.total": data.totalAmount,
      "calculations.vatFigure": data.vatFigure,
      "calculations.discount": data.discount,
      created: { by: data.createdBy, on: Date.now() },
    });
    let populatedInvoice = await this.Invoice.populateInvoice(invoice);
    populatedInvoice.customer = customer;

    mainChannel.topic(SERVER_EVENTS_BUS.NEW_INVOICE_EVENT).emit({
      accessControl: this.connection,
      invoice: populatedInvoice,
    });
    // this.trigger.sendNotification("newInvoiceEvent", populatedInvoice);
    return populatedInvoice;
  }
  async getInvoicesByOrg(query, options) {
    let pagination = await this.Invoice.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let invoices = pagination.docs;
    let populatedInvoices = await Promise.all(
      invoices.map((invoice) => this.Invoice.populateInvoice(invoice))
    );
    return {
      invoices: populatedInvoices,
      pagination: imsPaginationFormated(pagination),
    };
  }

  async getInvoices(query, options) {
    let pagination = await this.Invoice.paginate(query, options);
    let invoices = pagination.docs;
    let populatedInvoices = await Promise.all(
      invoices.map((invoice) => this.Invoice.populateInvoice(invoice))
    );
    return {
      invoices: populatedInvoices,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async getInvoice(id) {
    let customerService = new CRMService(this.connection);
    let invoice = await this.Invoice.findOne({ _id: id });
    if (!invoice)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No invoice was found with the id."
      );
    let customer = await customerService.getCustomer(invoice.customer);
    let populatedInvoice = await this.Invoice.populateInvoice(invoice);
    populatedInvoice.customer = customer;
    return populatedInvoice;
  }
  async updateInvoice(id, data) {
    let customerService = new CRMService(this.connection);
    let invoice = await this.Invoice.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          due: data.due,
          entries: data.entries,
          emails: data.emails,
          "calculations.total": data.totalAmount,
          "calculations.discount": data.discount,
          "calculations.vatFigure": data.vatFigure,
        },
      },
      { new: true }
    );
    let customer = await customerService.getCustomer(invoice.customer);
    let populatedInvoice = await this.Invoice.populateInvoice(invoice);
    populatedInvoice.customer = customer;
    return populatedInvoice;
  }
  async payment(id, data) {
    let invoice = await this.Invoice.findOne({ _id: id });
    if (!invoice || invoice.status !== "Sent")
      return [{ message: "Payment is not allowed." }, null];
    let updatedInvoice = await this.Invoice.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: "Paid",
          updated: { by: data.updatedBy, on: Date.now() },
        },
      },
      { new: true }
    );
    let customer = await this.getCustomer(invoice.customer);
    let populatedInvoice = await this.Invoice.populateInvoice(updatedInvoice);
    populatedInvoice.customer = customer;
    mainChannel.topic(SERVER_EVENTS_BUS.INVOICE_PAYMENT_COMPLETE_EVENT).emit({
      accessControl: this.connection,
      invoice: populatedInvoice,
    });
    // this.trigger.sendNotification(
    //   "invoicePaymentCompleteEvent",
    //   populatedInvoice
    // );
    return populatedInvoice;
  }
  async sendInvoice(id, data) {
    let customerService = new CRMService(this.connection);
    let organisationService = new OrganisationService(this.connection);
    let organization = await organisationService.getOrganisation(
      this.connection.user.organizationId
    );
    let invoice = await this.Invoice.findOneAndUpdate(
      { _id: id },
      {
        updated: { by: data.updatedBy, on: Date.now() },
      },
      { new: true }
    );
    if (!invoice) return [{ message: "Invoice not found." }, null];
    let customer = await customerService.getCustomer(invoice.customer);
    let populatedInvoice = await this.Invoice.populateInvoice(invoice);
    populatedInvoice.customer = customer;
    let date = new Date();
    let fileManager = new FileHandlerService(this.connection);
    let report = await require("../helpers/template").createTemplate({
      view: "invoice.ejs",
      templateOptions: {
        organization,
        invoice: populatedInvoice,
        moment,
      },
    });
    let fileName = `Invoice#00${
      populatedInvoice.ID
    }-${date.toDateString()}.pdf`;
    let document = {
      html: report,
      fileName,
      data: {},
      path: `./temp/${fileName}`,
      type: "",
    };
    let pdf = await pdfMaker(document, {
      format: "A4",
      orientation: "portrait",
      border: "5mm",
    });

    let files = [document];
    let paymentLink = `https://localhost.com/auth/payments/`;
    const emailsToBeSent = [
      {
        name: customer.primaryContact,
        email: customer.primaryEmail,
      },
    ];
    if (customer.secondaryEmail)
      emailsToBeSent.push({
        name: customer.secondaryContact,
        email: customer.secondaryEmail,
      });
    await Promise.all(
      emailsToBeSent.map((person) =>
        sendMail("customer-invoice", person.email, {
          name: person.name,
          senderName: populatedInvoice.created.by.name,
          invoiceId: invoice.ID,
          organization,
          paymentLink,
          attachments: files.map((file) => ({
            filename: file.fileName,
            path: file.path,
          })),
        })
      )
    );
    // this.trigger.sendNotification("sendInvoiceEvent", populatedInvoice);
    mainChannel.topic(SERVER_EVENTS_BUS.SEND_INVOICE_EVENT).emit({
      accessControl: this.connection,
      invoice: populatedInvoice,
    });
    files.map((file) => fileManager.removeTemporary(file));
    let updatedInvoice = await this.Invoice.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Sent", emails: emailsToBeSent } },
      { new: true }
    );
    return this.Invoice.populateInvoice(updatedInvoice);
  }
  async downloadInvoice(id, data) {
    let customerService = new CRMService(this.connection);
    let organisationService = new OrganisationService(this.connection);
    let organization = await organisationService.getOrganisation(
      this.connection.user.organizationId
    );
    let invoice = await this.Invoice.findOne({ _id: id });
    if (!invoice) return [{ message: "Invoice not found." }, null];
    let customer = await customerService.getCustomer(invoice.customer);
    let populatedInvoice = await this.Invoice.populateInvoice(invoice);
    populatedInvoice.customer = customer;
    let date = new Date();
    let fileManager = new FileHandlerService(this.connection);
    let report = await require("../helpers/template").createTemplate({
      view: "invoice.ejs",
      templateOptions: {
        organization,
        invoice: populatedInvoice,
        moment,
      },
    });
    let fileName = `Invoice#00${
      populatedInvoice.ID
    }-${date.toDateString()}.pdf`;
    let document = {
      html: report,
      fileName,
      data: {},
      path: `./temp/${fileName}`,
      type: "",
    };
    let pdf = await pdfMaker(document, {
      format: "A4",
      orientation: "portrait",
      border: "5mm",
    });
    var data = fs.readFileSync(document.path);
    return { data, document };
  }
  async deleteInvoice(id) {
    let invoice = await this.getInvoice(id);
    if (invoice) {
      await this.Invoice.deleteOne({ _id: id });
      return invoice;
    }
  }
}
module.exports = InvoiceService;
