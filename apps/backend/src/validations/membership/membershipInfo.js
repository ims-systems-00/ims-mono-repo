const Joi = require("joi");
const {
  ROLES,
  WORK_LOCATION_TYPE,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");

const membershipBaseStructure = {
  invitedUserId: Joi.string().required().label("Invited User Id"),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .label("Role"),
};

const createMembershipData = Joi.object({
  ...membershipBaseStructure,
});

const updateMembershipRole = Joi.object({
  role: membershipBaseStructure.role,
});

const updateMembershipData = Joi.object({
  workLocationType: Joi.string()
    .valid(...Object.values(WORK_LOCATION_TYPE))
    .required()
    .label("workLocationType"),
  jobTitle: Joi.any().label("jobTitle"),
  salary: Joi.any().label("salary"),
  lineManagers: Joi.array().label("lineManagers"),
  leaveDaysEntitledTo: Joi.number().optional().label("leaveDaysEntitledTo"),
  workShift: Joi.any().label("workShift"),
  country: Joi.object({
    name: Joi.string().optional().allow("").label("name"),
    code: Joi.string().optional().allow("").label("code"),
  }).label("country"),
});

module.exports = {
  createMembershipData,
  updateMembershipData,
  updateMembershipRole,
};
