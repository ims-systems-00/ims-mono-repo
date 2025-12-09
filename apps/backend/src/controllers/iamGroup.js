const IamGroupModel = require("../models/mongodb/system/ourIms/iamGroup");
const LicenseManagementService = require("../services/licenseManager");
const { trimQuery } = require("../validations/utils");
const { Filters } = require("../services/utility");
const GroupDepsService = require("../services/groups_deps");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

exports.authCreatePermission = async (req, res, next) => {
  try {
    let license = new LicenseManagementService(
      req.accessControl.user.organizationId
    );
    if (await license.authorizeBusinessUnitUsagePermissionInOrg()) {
      return next();
    }
    return res.status(400).json({
      message:
        "You don't have enough licenses to create a business unit, please request for more licenses via license management.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createIamGroup = async (req, res, next) => {
  let iamGroupManager = new GroupDepsService(req.accessControl);
  try {
    let iamGroup = await iamGroupManager.createIamGroup({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res.status(200).json({ message: "Group has been created.", iamGroup });
  } catch (error) {
    next(error);
  }
};
exports.useLicense = async (req, res, next) => {
  try {
    throw new APIError(
      ReasonPhrases.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      "Use license middle ware is depricated."
    );
  } catch (err) {
    next(err);
  }
};
exports.updateIamGroupDescription = async (req, res, next) => {
  let iamGroupManager = new GroupDepsService(req.accessControl);
  try {
    let { name, operatingLocation, standards, responsibility } = req.body;
    let { id } = req.params;
    // let updatedIamGroup = await IamGroup.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $set: {
    //       name,
    //       "details.operatingLocation": operatingLocation,
    //       "details.standards": standards,
    //       responsibility,
    //     },
    //   },
    //   { new: true }
    // );
    // updatedIamGroup = await IamGroup.populateIamGroup(updatedIamGroup);
    let updatedIamGroup = await iamGroupManager.updateIamGroupDescription(id, {
      ...req.body,
    });
    res.status(200).json({
      message: "Group description updated successfully",
      iamGroup: updatedIamGroup,
    });
  } catch (error) {
    next(error);
  }
};
exports.getIamGroups = async (req, res, next) => {
  let iamGroupManager = new GroupDepsService(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    const options = { page, limit: size, sort: { name: 1 } };
    let filter = new Filters(req, {
      searchFields: [
        "reference",
        "name",
        "responsibility",
        "details.operatingLocation",
        "details.standards",
      ],
    })
      .build()
      .query();
    let query = { ...filter };
    let iamGroups = [];
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (iamPolicy.validateGlobalAccess(groupPolicy)) {
    //   query = {
    //     ...query,
    //     name: { $ne: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION },
    //   };
    // } else {
    //   query = { ...query, _id: session.current.group };
    // }
    // const pagination = await IamGroup.paginate(query, options);
    // iamGroups = pagination.docs;
    // iamGroups = await Promise.all(
    //   iamGroups.map((group) => IamGroup.populateIamGroup(group))
    // );
    let results = await iamGroupManager.listGroupByOrg(query, options);
    res.status(200).json({
      message: "Bulk groups retrived successfully",
      pagination: results.pagination,
      iamGroups: results.iamGroups,
    });
  } catch (error) {
    next(error);
  }
};
exports.getIamGroup = async (req, res, next) => {
  let iamGroupManager = new GroupDepsService(req.accessControl);
  try {
    let { id } = req.params;
    let iamGroup = await iamGroupManager.getIamGroup(id);
    res.status(200).json({ message: "Group retrived successfully", iamGroup });
  } catch (error) {
    next(error);
  }
};
exports.deleteIamGroup = async (req, res, next) => {
  let iamGroupManager = new GroupDepsService(req.accessControl);
  try {
    let { id } = req.params;
    let iamGroup = await iamGroupManager.deleteIamGroup(id);
    res.status(200).json({ message: "Group deleted successfully", iamGroup });
  } catch (error) {
    next(error);
  }
};
exports.attachPolicy = async (req, res, next) => {
  let IamGroup = IamGroupModel(req.accessControl);
  try {
    let { id } = req.params;
    let { policyId } = req.body;
    let iamGroup = await IamGroup.findOneAndUpdate(
      { _id: id },
      {
        $set: { policy: policyId },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Group policy attached successfully", iamGroup });
  } catch (error) {
    next(error);
  }
};
exports.allocateUserLicense = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { auditorAmount, basicAmount, hosAmount, action } = req.body;
    let sign = action === "Allocate" ? 1 : -1;
    let license = new LicenseManagementService(
      req.accessControl.user.organizationId
    );
    let iamGroup = await license.allocateLicenseInGroup(
      { auditorAmount, basicAmount, hosAmount },
      id,
      sign
    );
    res
      .status(200)
      .json({ message: "License allocated successfully", iamGroup });
  } catch (err) {
    next(err);
  }
};
exports.assignComplianceToolKit = async (req, res, next) => {
  let IamGroup = IamGroupModel(req.accessControl);
  let licenseManager = new LicenseManagementService(
    req.accessControl.user.organizationId
  );
  try {
    let { tools } = req.body;
    let { id } = req.params;
    if (
      await Promise.all(tools.map((tool) => licenseManager.haveToolKit(tool)))
    ) {
      let iamGroup = await IamGroup.findOneAndUpdate(
        { _id: id },
        {
          $set: { "userLicenses.complianceTools": tools },
        },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Compliance tool assigned successfully", iamGroup });
      await licenseManager.complianceToolUserslicenseLookUp(id);
    } else
      res.status(400).json({ message: "No toolkit license in organization" });
  } catch (err) {
    next(err);
  }
};
