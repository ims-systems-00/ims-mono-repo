const { Filters } = require("../services/utility");
const { IamPolicy } = require("../services/iamPolicy");
const InvoiceService = require("../services/invoice");
const FileHandlerService = require("../services/fileHandler");
exports.createInvoice = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let validation = { isValid: true, messages: [] };
    if (!validation.isValid)
      return res.status(400).json({ message: "Invalid input" });
    let invoice = await invoiceService.createInvoice({
      ...req.body,
      organization: req.accessControl.user.organisationId,
    });
    return res
      .status(200)
      .json({ message: "Invoice has been created.", invoice });
  } catch (error) {
    next(error);
  }
};
exports.getInvoices = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let { session, groupPolicy } = req.accessControl;
    let { page, size, sort } = req.query;
    let filter = new Filters(req, { searchFields: ["reference"] })
      .build()
      .query();
    const options = { page, limit: size, sort };
    let query = { ...filter };
    let queryResult = await invoiceService.getInvoicesByOrg(query, options);
    return res.status(200).json({
      message: "Invoice retrived successfully.",
      invoices: queryResult.invoices,
      pagination: queryResult.pagination,
    });
  } catch (error) {
    next(error);
  }
};
exports.getInvoice = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let { id } = req.params;
    let invoice = await invoiceService.getInvoice(id);
    return res
      .status(200)
      .json({ message: "Invoice retrived successfully.", invoice });
  } catch (error) {
    next(error);
  }
};
exports.updateInvoice = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let { id } = req.params;
    req.body.updatedBy = req.accessControl.user._id;
    let invoice = await invoiceService.updateInvoice(id, req.body);
    return res
      .status(200)
      .json({ message: "Invoice updated successfully.", invoice });
  } catch (error) {
    next(error);
  }
};
exports.deleteInvoice = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let { id } = req.params;
    let invoice = await invoiceService.deleteInvoice(id);
    return res
      .status(200)
      .json({ message: "Invoice deleted successfully.", invoice });
  } catch (error) {
    next(error);
  }
};
exports.payment = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let { id } = req.params;
    let data = { updatedBy: req.accessControl.user._id };
    let invoice = await invoiceService.payment(id, data);
    return res
      .status(200)
      .json({ message: "Invoice payment successfully.", invoice });
  } catch (error) {
    next(error);
  }
};
exports.downloadInvoice = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  let fileManager = new FileHandlerService(req.accessControl);
  try {
    let { id } = req.params;
    let invoice = await invoiceService.downloadInvoice(id);
    res.contentType("application/pdf");
    res.on("finish", function () {
      fileManager.removeTemporary(invoice.document);
    });
    return res.status(200).send(invoice.data);
  } catch (error) {
    next(error);
  }
};
exports.sendInvoice = async (req, res, next) => {
  let invoiceService = new InvoiceService(req.accessControl);
  try {
    let { id } = req.params;
    let data = { updatedBy: req.accessControl.user._id };
    let invoice = await invoiceService.sendInvoice(id, data);
    return res
      .status(200)
      .json({ message: "Invoice sent successfully.", invoice });
  } catch (error) {
    console.log("in",error)
    next(error);
  }
};
