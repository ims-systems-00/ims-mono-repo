const Joi = require("../../lib/validation");

// Schema for a single signature location
const signatureLocationSchema = Joi.object({
  startX: Joi.number().min(0).max(1).label("Start x"),
  startY: Joi.number().min(0).max(1).label("Start y"),
  pageNumber: Joi.number().min(1).label("Page number"),
}).label("signature location");

const internalSchema = Joi.object({
  users: Joi.array().min(1).items(Joi.string().label("User id")).label("Users"),
  message: Joi.string().optional().allow(null, "").label("Message"),
  // Multiple signature locations (required)
  signatureLocations: Joi.array()
    .min(1)
    .items(signatureLocationSchema)
    .required()
    .label("Signature locations"),
}).label("user signature");

const externalSchema = Joi.object({
  emails: Joi.array().min(1).items(Joi.string().label("Email")).label("Emails"),
  message: Joi.string().optional().allow(null, "").label("Message"),
  // Multiple signature locations (required)
  signatureLocations: Joi.array()
    .min(1)
    .items(signatureLocationSchema)
    .required()
    .label("Signature locations"),
}).label("user signature");
const removeSchema = Joi.object({
  signatures: Joi.array()
    .min(1)
    .items(Joi.string().label("Email"))
    .label("Users"),
}).label("user signature");
const statusSchema = Joi.object({
  status: Joi.string().required().valid("Signed", "Reviewd").label("Status"),
  signature: Joi.string().required().label("Signature"),
  name: Joi.string().required().label("Name"),
  organisation: Joi.string().required().label("Organisation"),
  jobTitle: Joi.string().required().label("Job title"),
  font: Joi.string().required().label("Name"),
  // Optional: Allow updating signature locations during signing
  signatureLocations: Joi.array()
    .items(signatureLocationSchema)
    .optional()
    .label("Signature locations"),
}).label("signature status");

const resendSignatureSchema = Joi.object({
  signatureIds: Joi.array()
    .required()
    .items(Joi.string().label("Singnature id"))
    .label("Status"),
}).label("signature status");
module.exports = {
  addInternalSignatures: internalSchema,
  addExternalSignatures: externalSchema,
  removeSignatures: removeSchema,
  handleStatus: statusSchema,
  resendSignatures: resendSignatureSchema,
};
