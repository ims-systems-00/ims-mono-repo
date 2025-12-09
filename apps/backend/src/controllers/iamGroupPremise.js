const { sendMail } = require("../email/sendMail");
// const IamGroupPremiseModel = require("../models/mongodb/system/ourIms/iamGroupPremise");
const { imsPaginationFormated, Filters } = require("../services/utility");
const { trimQuery } = require("../validations/utils");
const { IamPolicy } = require("../services/iamPolicy");
const GroupPremisesService = require("../services/iamGroupPremise");
const { StatusCodes } = require("http-status-codes");

exports.createIamGroupPremise = async (req, res, next) => {
  let IamGroupPremiseManager = new GroupPremisesService(req.accessControl);
  try {
    let groupPremise = await IamGroupPremiseManager.createIamGroupPremise({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Group Premise has been created.", iamGroupPremise: groupPremise });
  } catch (error) {
    next(error);
  }
};
exports.updateIamGroupPremise = async (req, res, next) => {
  let IamGroupPremiseManager = new GroupPremisesService(req.accessControl);
  try {
    let { name, groups, location, address } = req.body;
    let { id } = req.params;
    // let updatedPremise = await IamGroupPremise.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $set: {
    //       groups,
    //       name,
    //       location,
    //       address,
    //     },
    //   },
    //   { new: true }
    // );
    // updatedPremise = await IamGroupPremise.populatePremise(updatedPremise);
    let updatedGroupPremises =
      await IamGroupPremiseManager.updateIamGroupPremise(id, req.body);
    res.status(200).json({
      message: "Group premise updated successfully",
      iamGroupPremise: updatedGroupPremises,
    });
  } catch (error) {
    next(error);
  }
};
exports.getIamGroupPremises = async (req, res, next) => {
  let IamGroupPremiseManager = new GroupPremisesService(req.accessControl);
  try {
    let { groupPolicy, session, user } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page, limit: size, sort };
    let filters = new Filters(req, {
      searchFields: ["reference", "name", "address", "location"],
    })
      .build()
      .query();
    let query = { ...filters };
    // let iamGroupPremises = [];
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (iamPolicy.validateGlobalAccess(groupPolicy)) {
    //   query = { ...query };
    // } else {
    //   query = { ...query, groups: session.current.group };
    // }
    // const pagination = await IamGroupPremise.paginate(query, options);
    // iamGroupPremises = pagination.docs;
    // iamGroupPremises = await Promise.all(
    //   iamGroupPremises.map((premise) =>
    //     IamGroupPremise.populatePremise(premise)
    //   )
    // );
    let results = await IamGroupPremiseManager.listGroupPremisesByOrg(query, options);
    res.status(200).json({
      message: "Bulk groups retrived successfully",
      pagination: results.pagination,
      iamGroupPremises: results.iamGroupPremises,
    });
  } catch (error) {
    next(error);
  }
};
exports.getIamGroupPremise = async (req, res, next) => {
  let IamGroupPremiseManager = new GroupPremisesService(req.accessControl);
  try {
    let { id } = req.params;
    let iamGroupPremise = await IamGroupPremiseManager.getIamGroupPremise(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Group retrived successfully", iamGroupPremise });
  } catch (error) {
    next(error);
  }
};
exports.deleteIamGroupPremise = async (req, res, next) => {
  let IamGroupPremiseManager = new GroupPremisesService(req.accessControl);
  try {
    let { id } = req.params;
    let iamGroupPremise = await IamGroupPremiseManager.deleteIamGroupPremise(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Group deleted successfully", iamGroupPremise });
  } catch (error) {
    next(error);
  }
};
exports.attachGroup = async (req, res, next) => {
  let IamGroupPremiseManager = new GroupPremisesService(req.accessControl);
  try {
    let { id } = req.params;
    // let { group } = req.body;
    // let iamGroupPremise = await IamGroupPremise.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $push: {
    //       groups: { group },
    //     },
    //   },
    //   { new: true }
    // );
    let iamGroupPremise = await IamGroupPremiseManager.attachGroup(id,req.body)
    res
      .status(200)
      .json({ message: "Group added successfully", iamGroupPremise });
  } catch (error) {
    next(error);
  }
};
