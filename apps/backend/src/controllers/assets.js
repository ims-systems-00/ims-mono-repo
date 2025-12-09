// let HardwareAssetModel = require("../models/mongodb/system/inventory/hardwareAsset");
// let SoftwareAssetModel = require("../models/mongodb/system/inventory/softwareAsset");
// let InformationAssetModel = require("../models/mongodb/system/inventory/informationAsset");
// let PeopleAssetModel = require("../models/mongodb/system/inventory/peopleAsset");
// let PremiseAssetModel = require("../models/mongodb/system/inventory/premiseAsset");
const { IamPolicy } = require("../services/iamPolicy");
const { trimQuery } = require("../validations/utils");
const { imsPaginationFormated, Filters } = require("../services/utility");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const AssetsService = require("../services/assets");
const { StatusCodes } = require("http-status-codes");

exports.createHardwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let hardwareAsset = await assetManager.createHardwareAsset({
      ...req.body,
      organization: req.accessControl.user.organisationId,
      createdBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Success", hardwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.editHardwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let hardwareAsset = await assetManager.editHardwareAsset(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Success", hardwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.getHardwareAssets = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    let hardwareAssets = [];
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filter = new Filters(req, {
      searchFields: ["name", "tag", "reference"],
    })
      .build()
      .query();
    let query = { ...filter };
    const result = await assetManager.getHardwareAssetsByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Success",
      pagination: result.pagination,
      hardwareAssets: result.hardwareAssets,
    });
  } catch (err) {
    next(err);
  }
};
exports.getHardwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let hardwareAsset = await assetManager.getHardwareAsset(id);
    res.status(StatusCodes.OK).json({ message: "Success", hardwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.removeHardwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let hardwareAsset = await assetManager.removeHardwareAsset(id);
    res.status(StatusCodes.OK).json({ message: "Success", hardwareAsset });
  } catch (err) {
    next(err);
  }
};

exports.createSoftwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let softwareAsset = await assetManager.createSoftwareAsset({
      ...req.body,
      organization: req.accessControl.user.organisationId,
      createdBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Success", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.getSoftwareAssets = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filter = new Filters(req, { searchFields: ["name", "reference"] })
      .build()
      .query();
    let query = { ...filter };
    const result = await assetManager.getSoftwareAssetsByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Spftware assets retrived successfully",
      pagination: result.pagination,
      softwareAssets: result.softwareAssets,
    });
  } catch (err) {
    next(err);
  }
};
exports.getSoftwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let softwareAsset = await assetManager.getSoftwareAsset(id);
    res.status(StatusCodes.OK).json({ message: "Success", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.editSoftwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let softwareAsset = await assetManager.editSoftwareAsset(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Success", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.addSoftwareKey = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { key } = req.body;
    let { id } = req.params;
    let softwareAsset = await assetManager.addSoftwareKey(id, { key });
    res
      .status(StatusCodes.OK)
      .json({ message: "Key added successfully", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.removeSoftwareKey = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    const { id } = req.params;
    const { key_id } = req.params;
    let softwareAsset = await assetManager.removeSoftwareKey(id, key_id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Key removed successfully", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.addSoftwareDocument = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let { docs } = req.body;
    let softwareAsset = await assetManager.addSoftwareDocument(id, { docs });
    res.status(StatusCodes.OK).json({ message: "Success", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.removeSoftwareDocument = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id, doc_id } = req.params;
    let softwareAsset = await assetManager.removeSoftwareDocument(id, doc_id);
    res.status(StatusCodes.OK).json({ message: "Success", softwareAsset });
  } catch (err) {
    next(err);
  }
};
exports.removeSoftwareAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let softwareAsset = await assetManager.removeSoftwareAsset(id);
    res.status(200).json({ message: "Success", softwareAsset });
  } catch (err) {
    next(err);
  }
};

exports.createInformationAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let informationAsset = await assetManager.createInformationAsset({
      ...req.body,
      organization: req.accessControl.user.organisationId,
      createdBy: req.accessControl.user,
    });
    res.status(200).json({ message: "Success", informationAsset });
  } catch (err) {
    next(err);
  }
};
exports.editInformationAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  const { id } = req.params;
  try {
    let informationAsset = await assetManager.editInformationAsset(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(200).json({ message: "Success", informationAsset });
  } catch (err) {
    next(err);
  }
};
exports.getInformationAssets = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filter = new Filters(req, {
      searchFields: [
        "title",
        "informationInventory",
        "reference",
        "storageLocation",
        "format",
        "link",
      ],
    })
      .build()
      .query();
    let query = { ...filter };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    const result = await assetManager.getInformationAssetsByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Information asset retrival success",
      pagination: result.pagination,
      informationAssets: result.informationAssets,
    });
  } catch (err) {
    next(err);
  }
};
exports.getInformationAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let informationAsset = await assetManager.getInformationAsset(id);
    res.status(200).json({ message: "Success", informationAsset });
  } catch (err) {
    next(err);
  }
};
exports.removeInformationAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let informationAsset = await assetManager.removeInformationAsset(id);
    res.status(200).json({ message: "Success", informationAsset });
  } catch (err) {
    next(err);
  }
};

exports.createPeopleAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let peopleAsset = await assetManager.createPeopleAsset({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res.status(200).json({ message: "Success", peopleAsset });
  } catch (err) {
    next(err);
  }
};
exports.getPeopleAssets = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    let peopleAssets = [];
    let filter = new Filters(req, {
      searchFields: ["name", "reference", "role", "responsibility", "skill"],
    })
      .build()
      .query();
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let query = { ...filter };
    const result = await assetManager.getPeopleAssetsByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Assets retrived successfully.",
      pagination: result.pagination,
      peopleAssets: result.peopleAssets,
    });
  } catch (err) {
    next(err);
  }
};
exports.getPeopleAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let peopleAsset = await assetManager.getPeopleAsset(id);
    res.status(200).json({ message: "Success", peopleAsset });
  } catch (err) {
    next(err);
  }
};
exports.removePeopleAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let peopleAsset = await assetManager.removePeopleAsset(id);
    res.status(200).json({ message: "Success", peopleAsset });
  } catch (err) {
    next(err);
  }
};
exports.editPeopleAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let peopleAsset = await assetManager.editPeopleAsset(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(200).json({ message: "Success", peopleAsset });
  } catch (err) {
    next(err);
  }
};

exports.createPremiseAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let premiseAsset = await assetManager.createPremiseAsset({
      ...req.body,
      organization: req.accessControl.user.organisationId,
      createdBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Success", premiseAsset });
  } catch (err) {
    next(err);
  }
};
exports.getPremiseAssets = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, size, sort } = trimQuery(req.query);
    let filter = new Filters(req, {
      searchFields: ["name", "location", "reference", "address"],
    })
      .build()
      .query();
    let premiseAssets = [];
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let query = { ...filter };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    const result = await assetManager.getPremiseAssetsByOrg(query, options);
    res.json({
      message: "Premises retrived succssfully",
      pagination: result.pagination,
      premiseAssets: result.premiseAssets,
    });
  } catch (err) {
    next(err);
  }
};
exports.getPremiseAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let premiseAsset = await assetManager.getPremiseAsset(id);
    res.status(StatusCodes.OK).json({ message: "Success", premiseAsset });
  } catch (err) {
    next(err);
  }
};
exports.editPremiseAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let premiseAsset = await assetManager.editPremiseAsset(id, { ...req.body });
    res.status(StatusCodes.OK).json({ message: "Success", premiseAsset });
  } catch (err) {
    next(err);
  }
};
exports.removePremiseAsset = async (req, res, next) => {
  let assetManager = new AssetsService(req.accessControl);
  try {
    let { id } = req.params;
    let premiseAsset = await assetManager.removePremiseAsset(id);
    res.status(StatusCodes.OK).json({ message: "Success", premiseAsset });
  } catch (err) {
    next(err);
  }
};
