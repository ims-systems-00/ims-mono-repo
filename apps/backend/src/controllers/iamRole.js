const { sendMail } = require("../email/sendMail");
const IamRoleModel = require("../models/mongodb/system/ourIms/iamRole");
const { IamPolicy } = require("../services/iamPolicy");

exports.createIamRole = async (req, res, next) => {
  let IamRole = IamRoleModel(req.accessControl);
  try {
    let { type, name, policy, organizationId } = req.body;
    let createdIamRole = new IamRole({
      organization: req.accessControl.organisationId,
      organizationId,
      name,
      type,
      policy,
    });
    createdIamRole = await createdIamRole.save();
    createdIamRole = await IamRole.populateIamRole(createdIamRole);
    res
      .status(201)
      .json({ message: "Role created successfully", iamRole: createdIamRole });
  } catch (error) {
    next(error)
  }
};
exports.updateIamRole = async (req, res, next) => {
  let IamRole = IamRoleModel(req.accessControl);
  try {
    let { type, name, policy } = req.body;
    let { id } = req.params;
    let updatedIamRole = await IamRole.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          type,
          policy,
        },
      },
      { new: true }
    );
    updatedIamRole = await IamRole.populateIamRole(updatedIamRole);
    res
      .status(200)
      .json({ message: "Role updated successfully", iamRole: updatedIamRole });
  } catch (error) {
    next(error)
  }
};
exports.getIamRoles = async (req, res, next) => {
  let IamRole = IamRoleModel(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let iamRoles = [];
    let iamPolicy = new IamPolicy(req.accessControl);
    if (iamPolicy.validateGlobalAccess(groupPolicy)) {
      iamRoles = await IamRole.find({});
    } else {
      iamRoles = await IamRole.find({});
    }
    iamRoles = await Promise.all(
      iamRoles.map((role) => (role = IamRole.populateIamRole(role)))
    );
    res
      .status(200)
      .json({ message: "Bulk roles retrived successfully", iamRoles });
  } catch (error) {
    next(error)
  }
};
exports.getIamRole = async (req, res, next) => {
  let IamRole = IamRoleModel(req.accessControl);
  try {
    let { id } = req.params;
    let iamRole = await IamRole.findOne({ _id: id });
    iamRole = await IamRole.populateIamRole(iamRole);

    res.status(200).json({ message: "Role retrived successfully", iamRole });
  } catch (error) {
    next(error)
  }
};
exports.deleteIamRole = async (req, res, next) => {
  let IamRole = IamRoleModel(req.accessControl);
  try {
    let { id } = req.params;
    let iamRole = await IamRole.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Role deleted successfully", iamRole });
  } catch (error) {
    next(error)
  }
};
