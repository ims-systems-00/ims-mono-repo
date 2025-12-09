const Joi = require("../lib/validation");

// Base Schema
const baseSchema = {
  group: Joi.string().allow(null).label("Business unit"),
  name: Joi.string().label("Supplier name"),
  accountManager: Joi.string().label("Account manager"),
  accountNumber: Joi.string().label("Account number"),
  buyer: Joi.string().label("Buyer"),
  email: Joi.string().email().label("Email"),
  serviceProvision: Joi.string().label("Service provision"),
  contractValue: Joi.number().label("Contract value"),
  contractStartDate: Joi.string().label("Contract start date"),
  contractEndDate: Joi.string().label("Contract end date"),
  reviewDate: Joi.string().label("Review Date"),
  slaFiles: Joi.array().label("Sla files"),
  contractFiles: Joi.array().label("Contract files"),
  onBoardingFiles: Joi.array().label("Onboarding files"),
  createdBy: Joi.string().label("Created by"),
};

// Create Schema
const createSchema = Joi.object({
  ...baseSchema,
  name: baseSchema.name.required(),
  accountManager: baseSchema.accountManager.required(),
  accountNumber: baseSchema.accountNumber.required(),
  email: baseSchema.email.required(),
  serviceProvision: baseSchema.serviceProvision.required(),
  contractValue: baseSchema.contractValue.required(),
  contractStartDate: baseSchema.contractStartDate.required(),
});

// Update Schema
const updateSchema = Joi.object(
  Object.fromEntries(
    Object.entries(baseSchema).map(([key, value]) => [key, value.optional()])
  )
);

module.exports = {
  create: createSchema,
  update: updateSchema,
};
