const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { basicRoleScopedFilter } = require("../../queries");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
class SupplierManagementService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createSupplier(data) {
    let supplier = new this.Supplier({
      organization: this.connection.user.organizationId,
      group: data.group,
      name: data.name,
      buyer: data.buyer,
      contractValue: data.contractValue,
      accountManager: data.accountManager,
      slaFiles: data.slaFiles,
      contractFiles: data.contractFiles,
      onBoardingFiles: data.onBoardingFiles,
      accountNumber: data.accountNumber,
      email: data.email,
      serviceProvision: data.serviceProvision,
      contractStartDate: data.contractStartDate,
      contractEndDate: data.contractEndDate,
      reviewDate: data.reviewDate,
      created: {
        by: data.createdBy._id,
        on: Date.now(),
      },
    });
    await supplier.save();
    if (supplier.slaFiles.length || supplier.contractFiles.length) {
      this.trigger.sendNotification("compliantSupplierEvent", supplier);
      supplier = await this.Supplier.findOneAndUpdate(
        { _id: supplier._id },
        {
          $set: { isCompliant: true },
        },
        { new: true }
      );
    }
    supplier = await this.Supplier.populateSupplier(supplier);
    // this.trigger.sendNotification("newSupplierBuyerEvent", supplier);
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_SUPPLIER_BUYER_EVENT).emit({
      accessControl: this.connection,
      supplier,
    });
    this.Supplier.createCalenderEvent(supplier);
    return supplier;
  }
  async listSuppliersByOrg(query, options) {
    let pagination = await this.Supplier.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let suppliers = pagination.docs;
    suppliers = await Promise.all(
      suppliers.map((supplier) => this.Supplier.populateSupplier(supplier))
    );
    return { suppliers, pagination: this.imsPaginationFormated(pagination) };
  }
  async getSupplier(query) {
    let supplier = await this.Supplier.findOne(query);
    if (!supplier)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No supplier was found with the query."
      );
    return this.Supplier.populateSupplier(supplier);
  }

  async editSupplier(id, data) {
    let preSupplier = await this.getSupplier({ _id: id });
    let { slaFiles, contractFiles, onBoardingFiles, buyer } = data;
    const mutations = { ...data };

    delete mutations["slaFiles"];
    delete mutations["contractFiles"];
    delete mutations["onBoardingFiles"];

    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...mutations,
        },
        $push: {
          slaFiles: slaFiles ? slaFiles : [],
          contractFiles: contractFiles ? contractFiles : [],
          onBoardingFiles: onBoardingFiles ? onBoardingFiles : [],
        },
      },
      { new: true }
    );

    if (supplier.slaFiles.length || supplier.contractFiles.length) {
      supplier = await this.Supplier.findOneAndUpdate(
        { _id: id },
        {
          $set: { isCompliant: true },
        },
        { new: true }
      );

      mainChannel.topic(SERVER_EVENTS_BUS.COMPLIANT_SUPPLIER_EVENT).emit({
        accessControl: this.connection,
        supplier,
      });
      // this.trigger.sendNotification("compliantSupplierEvent", supplier);
    }

    supplier = await this.Supplier.populateSupplier(supplier);
    if (preSupplier?.buyer?.toString() !== buyer?.toString())
      mainChannel.topic(SERVER_EVENTS_BUS.NEW_SUPPLIER_BUYER_EVENT).emit({
        accessControl: this.connection,
        supplier,
      });

    // this.trigger.sendNotification("newSupplierBuyerEvent", supplier);

    this.Supplier.updateCalenderEvent(supplier);

    return supplier;
  }

  async removeSupplier(query) {
    let supplier = await this.getSupplier(query);
    await this.Supplier.deleteOne(query);
    return supplier;
  }

  async addSlas(id, data) {
    let preSupplier = await this.getSupplier({ _id: id });
    let { slaFile } = data;
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          slaFiles: slaFile,
        },
        $set: { isCompliant: true },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }

  async removeSlas(id, sla_id) {
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          slaFiles: { _id: sla_id },
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    if (!supplier.slaFiles.length && !supplier.contractFiles.length) {
      supplier = await this.Supplier.findOneAndUpdate(
        { _id: id },
        {
          $set: { isCompliant: false },
        },
        { new: true }
      );
    }
    return supplier;
  }

  async addContract(id, data) {
    let { contractFile } = data;
    let supplier = await Supplier.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          contractFiles: contractFile,
        },
        $set: { isCompliant: true },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }

  async removeContract(id, contract_id) {
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          contractFiles: { _id: contract_id },
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    if (!supplier.slaFiles.length && !supplier.contractFiles.length) {
      supplier = await this.Supplier.findOneAndUpdate(
        { _id: id },
        {
          $set: { isCompliant: false },
        },
        { new: true }
      );
    }
    return supplier;
  }

  async addOnBoardingFile(id, data) {
    let { onBoardingFile } = data;
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          onBoardingFiles: onBoardingFile,
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }

  async removeOnBoardingFile(id, onboarding_file_id) {
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          onBoardingFiles: { _id: onboarding_file_id },
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }

  async createIncident(id, data) {
    let {
      title,
      description,
      methodOfNotification,
      priority,
      resolution,
      createdBy,
    } = data;
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          incidents: {
            title,
            description,
            methodOfNotification,
            priority,
            resolution,
            created: {
              by: createdBy,
              on: Date.now(),
            },
          },
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    // if (priority === "P1") this.Supplier.p1IncidentSupplierEvent(supplier);
    if (priority === "P1") {
      mainChannel.topic(SERVER_EVENTS_BUS.P1_INCIDENT_SUPPLIER_EVENT).emit({
        accessControl: this.connection,
        supplier,
      });
    }
    return supplier;
  }

  async getIncidents(id) {
    let supplier = await this.Supplier.findById(id);
    supplier = await this.Supplier.populateSupplier(supplier);
  }

  async getIncident(id, incident_id) {
    let data = await this.Supplier.findOne({
      _id: id,
    }).select({ incidents: { $elemMatch: { _id: incident_id } } });
    data = await this.Supplier.populateSupplier(data);
    return data;
  }

  async editIncident(id, data) {
    let {
      title,
      description,
      methodOfNotification,
      priority,
      resolution,
      resolveStatus,
      updatedBy,
    } = data;
    let supplier = await this.Supplier.findOneAndUpdate(
      { "incidents._id": id },
      {
        $set: {
          "incidents.$.title": title,
          "incidents.$.description": description,
          "incidents.$.methodOfNotification": methodOfNotification,
          "incidents.$.priority": priority,
          "incidents.$.resolution": resolution,
          "incidents.$.resolved": {
            status: resolveStatus,
            on: resolveStatus ? Date.now() : null,
            by: resolveStatus ? updatedBy : null,
          },
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }

  async removeSupplierIncident(id, incident_id) {
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $pull: { incidents: { _id: incident_id } },
      },
      { new: true }
    );
    return supplier;
  }

  async resolveIncident(id, data) {
    let { resolution, resolvedBy } = data;
    let supplier = await this.Supplier.findById(id);
    const index = supplier.incidents
      .map((incident) => incident._id)
      .indexOf(req.params.incident_id);
    let resolved = {
      status: true,
      by: resolvedBy,
      on: Date.now(),
    };
    supplier.incidents[index].resolution = resolution;
    supplier.incidents[index].resolved = resolved;
    await supplier.save();
    supplier = await this.Supplier.populateSupplier(supplier);
    let incident = supplier.incidents[index];
    return incident;
  }

  async addKpiObjectives(id, kpiObjective) {
    await this.getSupplier({ _id: id });
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          kpiObjectives: kpiObjective,
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }

  async removeKpiObjectives(id, kpi_obective_id) {
    await this.getSupplier({ _id: id });
    let supplier = await this.Supplier.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          kpiObjectives: { _id: kpi_obective_id },
        },
      },
      { new: true }
    );
    supplier = await this.Supplier.populateSupplier(supplier);
    return supplier;
  }
}

exports.SupplierManagementService = SupplierManagementService;
