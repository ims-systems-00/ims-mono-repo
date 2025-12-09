const { asynchronously, imsPaginationFormated } = require("./utility");
const UserModel = require("../models/mongodb/system/users&auth/user");
const CustomerModel = require("../models/mongodb/system/crm/customer");
const InvoiceModel = require("../models/mongodb/system/crm/invoice");
const IncidentModel = require("../models/mongodb/system/incidentManagement/incident");
const mongoose = require("mongoose");
const FileHandlerService = require("./fileHandler");
const LicenseManagementService = require("./licenseManager");
const { IamPolicy } = require("./iamPolicy");
const { basicRoleScopedFilter } = require("../queries");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const Trigger = require("../services/triggers");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { mainChannel } = require("../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../eventsV2/topicsName");
class CRMService {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
    this.Incident = IncidentModel(connection);
    this.Invoice = InvoiceModel(connection);
    this.Customer = CustomerModel(connection);
    this.trigger = new Trigger(connection);
  }
  async initiateCRM() {
    let iamPolicy = new IamPolicy(this.connection);
    let licenseManager = new LicenseManagementService(
      this.connection.user.organizationId
    );
    let [grantError] = await asynchronously(
      licenseManager.authorizeToolKitGrantPermission(IMS_SERVICES.CRM)
    );
    if (grantError) return [grantError, null];
    let [policyError] = await asynchronously(
      iamPolicy.initializeComlianceToolAccess(IMS_SERVICES.CRM)
    );
    if (policyError) return [policyError, null];
    let [licenseError] = await asynchronously(
      licenseManager.utilizeComplianceToolLicenseInOrg(IMS_SERVICES.CRM)
    );
    if (licenseError) return [licenseError, null];
    return [null, { initation: "Crm initiated" }];
  }
  async createCustomer(data) {
    let createCustomer = this.Customer.create({
      organization: this.connection.user.organizationId,
      group: data.group,
      tagsAndCategories: data.tagsAndCategories,
      status: data.status,
      name: data.name,
      "logo.storageInfo": data.logo,
      "logo.src":
        data.logo?.Key &&
        process.env.PUBLIC_RESOURCE_BASE_URL + "/" + data.logo?.Key,
      companyNumber: data.companyNumber,
      address: data.address,
      accountManager: data.accountManager,
      accountNumber: data.accountNumber,
      stage: data.stage,
      probability: data.probability,
      primaryContact: data.primaryContact,
      primaryEmail: data.primaryEmail,
      phoneNumber: data.phoneNumber,
      secondaryContact: data.secondaryContact,
      secondaryEmail: data.secondaryEmail,
      buildingName: data.buildingName,
      streetName: data.streetName,
      postCode: data.postCode,
      town: data.town,
      source: data.source,
      contractValue: data.contractValue,
      serviceProvision: data.serviceProvision,
      contractStartDate: data.contractStartDate,
      contractEndDate: data.contractEndDate,
      reviewDate: data.reviewDate,
      reasonForLoss: data.reasonForLoss,
      slaFiles: data.slaFiles,
      otherFiles: data.otherFiles,
      attachments: data.attachments,
      notes: data.notes,
      created: { by: data.createdBy, on: Date.now() },
    });
    let customer = await createCustomer;
    return this.Customer.populateCustomer(customer);
  }
  async getCustomers(query, options) {
    let pagination = await this.Customer.paginate(query, options);
    let customers = pagination.docs;
    let populatedCcustomers = await Promise.all(
      customers.map((customer) => this.Customer.populateCustomer(customer))
    );
    return {
      customers: populatedCcustomers,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async getCustomersByOrg(query, options) {
    let pagination = await this.Customer.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let customers = pagination.docs;
    customers = await Promise.all(
      customers.map((customer) => this.Customer.populateCustomer(customer))
    );
    return {
      customers,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async getCustomer(id) {
    let fileManager = new FileHandlerService(this.connection);
    let customer = await this.Customer.findOne({ _id: id });
    if (!customer)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No crm was found with the id."
      );
    let { Bucket, Key, key, VersionId } = customer.logo.storageInfo;
    if (!Bucket) return this.Customer.populateCustomer(customer);
    let url = "";
    let updatedCustomer = await this.Customer.findOneAndUpdate(
      { _id: id },
      {
        $set: { "logo.signedUrl": url },
      },
      { new: true }
    );
    return this.Customer.populateCustomer(updatedCustomer);
  }
  async updateCustomer(id, data) {
    let oldCustomer = await this.getCustomer(id);
    let updatedCustomer = await this.Customer.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          group: data.group || null,
          tagsAndCategories: data.tagsAndCategories,
          name: data.name,
          "logo.storageInfo": data.logo,
          "logo.src":
            data.logo?.Key &&
            process.env.PUBLIC_RESOURCE_BASE_URL + "/" + data.logo?.Key,
          status: data.status,
          companyNumber: data.companyNumber,
          accountManager: data.accountManager,
          accountNumber: data.accountNumber,
          stage: data.stage,
          probability: data.probability,
          reasonForLoss: data.reasonForLoss,
          source: data.source,
          primaryContact: data.primaryContact,
          primaryEmail: data.primaryEmail,
          phoneNumber: data.phoneNumber,
          secondaryContact: data.secondaryContact,
          secondaryEmail: data.secondaryEmail,
          buildingName: data.buildingName,
          streetName: data.streetName,
          postCode: data.postCode,
          town: data.town,
          contractValue: data.contractValue,
          serviceProvision: data.serviceProvision,
          contractStartDate: data.contractStartDate,
          contractEndDate: data.contractEndDate,
          reviewDate: data.reviewDate,
          notes: data.notes,
          updated: {
            by: data.updatedBy,
            on: Date.now(),
          },
        },
        $push: {
          attachments: data.attachments,
        },
      },
      { new: true }
    );

    updatedCustomer = await this.Customer.populateCustomer(updatedCustomer);

    if (oldCustomer.stage.toString() !== updatedCustomer.stage.toString()) {
      mainChannel.topic(SERVER_EVENTS_BUS.CUSTOMER_STAGE_CHANGED_EVENT).emit({
        accessControl: this.connection,
        customer: updatedCustomer,
        oldCustomer: oldCustomer,
      });
    }
    if (oldCustomer.status.toString() !== updatedCustomer.status.toString()) {
      mainChannel.topic(SERVER_EVENTS_BUS.CUSTOMER_STATUS_CHANGED_EVENT).emit({
        accessControl: this.connection,
        customer: updatedCustomer,
        oldCustomer: oldCustomer,
      });
    }
    if (
      (oldCustomer.accountManager &&
        oldCustomer.accountManager._id.toString()) !==
      (updatedCustomer.accountManager &&
        updatedCustomer.accountManager._id.toString())
    ) {
      mainChannel
        .topic(SERVER_EVENTS_BUS.CUSTOMER_NEW_ACCOUNT_MANAGER_EVENT)
        .emit({
          accessControl: this.connection,
          customer: updatedCustomer,
          oldCustomer: oldCustomer,
        });
    }
    return updatedCustomer;
  }
  async deleteCustomer(id) {
    let customer = await this.getCustomer(id);
    await this.Customer.deleteOne({ _id: id });
    return customer;
  }
  async deleteAttchments(id, attachment_id) {
    let customer = await this.Customer.findOneAndUpdate(
      { _id: id },
      {
        $pull: { attachments: { _id: attachment_id } },
      },
      { new: true }
    );

    return this.Customer.populateCustomer(customer);
  }
  async getOverview(id) {
    let getTotalInvoices = this.Invoice.countDocuments({ customer: id });
    let getTotalIncidents = this.Incident.aggregate([
      {
        $match: {
          moduleType: "customers",
          module: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: { status: "$resolved.status" },
          count: { $sum: 1 },
        },
      },
    ]);
    let getTotalInvoiceAmount = this.Invoice.aggregate([
      {
        $match: { customer: new mongoose.Types.ObjectId(id) },
      },
      {
        $group: {
          _id: { status: "$status" },
          calculations: { $sum: "$calculations.total" },
          count: { $sum: 1 },
        },
      },
    ]);
    let analytics = await Promise.all([
      getTotalInvoices,
      getTotalIncidents,
      getTotalInvoiceAmount,
    ]);
    return {
      totalInvoices: analytics[0],
      totalIncidents: analytics[1],
      totalInvoiceAmount: analytics[2],
    };
  }
}
module.exports = CRMService;
