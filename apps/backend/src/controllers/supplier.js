const SupplierModel = require("../models/mongodb/system/supplierManagement/supplier");
const { trimQuery } = require("../validations/utils");
const { StatusCodes } = require("http-status-codes");
const { Filters } = require("../services/utility");
const { SupplierManagementService } = require("../services/supplier");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

exports.createSupplier = async (req, res, next) => {
  let supplierManager = new SupplierManagementService(req.accessControl);
  try {
    let supplier = await supplierManager.createSupplier({
      ...req.body,
      createdBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Supplier has been created.", supplier });
  } catch (err) {
    next(err);
  }
};
exports.getSuppliers = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { page, sort, size } = trimQuery(req.query);
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["reference", "name", "email", "serviceProvision"],
    })
      .build()
      .query();
    let query = { ...filter };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    // const pagination = await Supplier.paginate(query, options);
    // suppliers = pagination.docs;
    // suppliers = await Promise.all(
    //   suppliers.map((supplier) => Supplier.populateSupplier(supplier))
    // );
    // let getTotalSupplierContract = await Supplier.aggregate([
    //   {
    //     $group: {
    //       _id: { group: "total" },
    //       contractValue: { $sum: "$contractValue" },
    //     },
    //   },
    // ]);
    const result = await supplierManagement.listSuppliersByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Suppliers retrival success",
      pagination: result.pagination,
      suppliers: result.suppliers,
    });
  } catch (err) {
    next(err);
  }
};
exports.getSupplier = async (req, res, next) => {
  let supplierManager = new SupplierManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let supplier = await supplierManager.getSupplier({ _id: id });
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.editSupplier = async (req, res, next) => {
  let supplierManager = new SupplierManagementService(req.accessControl);
  let { id } = req.params;
  try {
    let supplier = await supplierManager.editSupplier(id, { ...req.body });
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.removeSupplier = async (req, res, next) => {
  let supplierManager = new SupplierManagementService(req.accessControl);
  let { id } = req.params;
  try {
    let supplier = await supplierManager.removeSupplier({ _id: id });
    res.status(200).json({ message: "Deleted successfully", supplier });
  } catch (err) {
    next(err);
  }
};
exports.addSlas = async (req, res, next) => {
  let supplierManager = new SupplierManagementService(req.accessControl);
  let { id } = req.params;
  try {
    let supplier = await supplierManager.addSlas(id, { ...req.query });
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.removeSlas = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  let { id, sla_id } = req.params;
  try {
    let supplier = await supplierManagement.removeSlas(id, sla_id);
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.addContract = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  let { id } = req.params;
  try {
    let supplier = await supplierManagement.addContract(id, { ...req.body });
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.removeContract = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id, contract_id } = req.params;
    let supplier = await supplierManagement.removeContract(id, contract_id);
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.addOnBoardingFile = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let supplier = await supplierManagement.addOnBoardingFile(id, {
      ...req.body,
    });
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.removeOnBoardingFile = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id, onboarding_file_id } = req.params;
    let supplier = supplierManagement.removeOnBoardingFile(
      id,
      onboarding_file_id
    );
    res.status(200).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.createIncident = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let supplier = supplierManagement.createIncident(id, { ...req.body });
    res.status(200).json({
      message: "Success",
      incident: supplier.incidents[supplier.incidents.length - 1],
    });
  } catch (err) {
    next(err);
  }
};
exports.getIncidents = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let supplier = supplierManagement.getIncident(id);
    res.status(200).json({ message: "Success", incidents: supplier.incidents });
  } catch (err) {
    next(err);
  }
};
exports.getIncident = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id, incident_id } = req.params;
    let data = supplierManagement.getIncident(id, incident_id);
    res.status(200).json({ message: "Success", incident: data.incidents[0] });
  } catch (err) {
    next(err);
  }
};
exports.editIncident = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { incident_id } = req.params;
    let supplier = supplierManagement.editIncident(incident_id, {
      ...req.body,
    });
    res.status(StatusCodes.OK).json({
      message: "Success",
      incident: supplier.incidents.find(
        (i) => i._id.toString() === incident_id
      ),
    });
  } catch (err) {
    next(err);
  }
};
exports.removeSupplierIncident = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id, incident_id } = req.params;
    let supplier = supplierManagement.removeSupplierIncident(id, incident_id);
    res.status(StatusCodes.OK).json({ message: "Success", supplier });
  } catch (err) {
    next(err);
  }
};
exports.resolveIncident = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let incident = await supplierManagement.resolveIncident(id, {
      ...req.body,
    });
    res.status(StatusCodes.OK).json({ message: "Success", incident });
  } catch (err) {
    next(err);
  }
};
exports.addKpiObjectives = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let { kpiObjective } = req.body;
    let supplier = await supplierManagement.addKpiObjectives(id, kpiObjective);
    res
      .status(StatusCodes.OK)
      .json({ message: "Successfully added kpi", supplier });
  } catch (err) {
    next(err);
  }
};
exports.removeKpiObjectives = async (req, res, next) => {
  let supplierManagement = new SupplierManagementService(req.accessControl);
  try {
    let { id, kpi_obective_id } = req.params;
    let supplier = await supplierManagement.removeKpiObjectives(
      id,
      kpi_obective_id
    );
    res.status(200).json({ message: "Successfully removed kpi", supplier });
  } catch (err) {
    next(err);
  }
};
