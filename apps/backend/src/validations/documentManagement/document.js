const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const Joi = require("../../lib/validation");
const attachmentValidation = require("../templates/attachments");

const sharedParts = {
  storageInfo: attachmentValidation.required().label("storage information"),
  owners: Joi.array()
    .max(5)
    .items(Joi.string().optional().label("Owners"))
    .required(),
  authorisation: Joi.array()
    .items(Joi.string().optional().label("User id"))
    .max(5)
    .required(),
};
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const documentValidationSchema = Joi.object({
  ...sharedParts,
  applicableModules: Joi.array()
    .items(
      Joi.string().valid(
        moduleTypes.risks,
        moduleTypes.incidents,
        moduleTypes.audits,
        moduleTypes.cips,
        moduleTypes.managementreviews,
        moduleTypes.compliancecontrols,
        moduleTypes.suppliers,
        moduleTypes.expensereports
      )
    )
    .optional()
    .label("applicable modules"),
  complianceTools: Joi.array()
    .items(
      Joi.string().valid(
        IMS_SERVICES.DSPTNHS,
        IMS_SERVICES.ISO27001,
        IMS_SERVICES.ISO27001_2022,
        IMS_SERVICES.ISO27001_2022_ANNEX_A,
        IMS_SERVICES.ISO27002,
        IMS_SERVICES.ISO9001,
        IMS_SERVICES.ISO45001,
        IMS_SERVICES.ISO20000,
        IMS_SERVICES.CQC,
        IMS_SERVICES.BS9997,
        IMS_SERVICES.ISO14001,
        IMS_SERVICES.CRM,
        IMS_SERVICES.ISO15686_5,
        IMS_SERVICES.ESG_ENVIRONMENTAL,
        IMS_SERVICES.ESG_GOVERNANCE,
        IMS_SERVICES.ESG_SOCIAL
      )
    )
    .optional()
    .label("compliance tools"),
  purpose: Joi.string()
    .valid(
      "Process",
      "Standard operating procedure",
      "Policy",
      "Document",
      "Legal",
      "Miscellaneous"
    )
    .required()
    .label("purpose"),
})
  .required()
  .label("document details");
const schema = Joi.object({
  parentNode: Joi.string().required().allow(null),
  data: Joi.alternatives(
    Joi.array().items(documentValidationSchema).min(1),
    documentValidationSchema
  ),
})
  .required()
  .label("node details");
const createFileNode = schema;

const addVersion = Joi.object({
  parentNode: Joi.string().required().allow(null),
  data: Joi.alternatives(
    Joi.array()
      .items(
        Joi.object({
          ...sharedParts,
        })
      )
      .min(1),
    Joi.object({
      ...sharedParts,
    })
  ),
});
const shareFileNode = Joi.object({
  emails: Joi.array()
    .min(1)
    .max(50)
    .items(Joi.string().label("Email"))
    .label("Emails"),
  message: Joi.string().optional().label("Message"),
})
  .required()
  .label("node details");
module.exports = {
  createFileNode,
  addVersion,
  shareFileNode,
};
