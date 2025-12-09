const Joi = require("joi");

const partnershipBaseStructure = {
  serviceProvision: Joi.string().required().label("serviceProvision"),
  customerReach: Joi.number().required().label("customerReach"),
  website: Joi.string().required().label("website"),
  standards: Joi.string().required().label("standards"),
  description: Joi.string().required().label("description"),
};

const createPartnershipData = Joi.object({
  ...partnershipBaseStructure,
});

const updatePartnershipData = Joi.object({
  ...partnershipBaseStructure,
});

module.exports = {
  createPartnershipData,
  updatePartnershipData,
};
