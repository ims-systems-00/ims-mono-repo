const Joi = require("joi");
const { fileMetaInfo } = require("../helpers/validations/fileMetaInfo");
const objectIdJoi = require("../helpers/validations/customObjectIdValidator");
const commonOrganizationTemplate = {
  name: Joi.string().required().label("Name"),
  officeEmail: Joi.string().max(50).email().required().label("Office Email"),
  addressCity: Joi.string().required().label("Address City"),
  addressStreet: Joi.string().required().label("Address Street"),
  addressBuilding: Joi.string().required().label("Address Building"),
  addressPostCode: Joi.string().required().label("Address Post Code"),
  addressStateProvince: Joi.string().required().label("Address State Province"),
  countryName: Joi.string().label("Country Name"),
  countryAbbr: Joi.string().required().label("Country Abbreviation"),
  countryCurrency: Joi.string().required().label("Country Currency"),
  countryPhonecode: Joi.number()
    .integer()
    .required()
    .label("Country Phone Code"),
};
const createOrganizationSchema = Joi.object({
  ...commonOrganizationTemplate,
  contactNumber: Joi.string().label("Contact Number"),
  sizeOfOrg: Joi.number().integer().required().label("Size of Organization"),
  industry: Joi.string().required().label("Industry"),

  logometadata: fileMetaInfo.allow(null),
  referralSource: objectIdJoi.objectId.required().label("Referral Source"),
});
const updateOrganizationSchema = Joi.object({
  ...commonOrganizationTemplate,
  bankDetails: Joi.object({
    name: Joi.string().required(),
    accountNo: Joi.number().required().allow(null, ""),
    sortCode: Joi.number().required().allow(null, ""),
  })
    .optional()
    .label("Bank Details"),
  companyNumber: Joi.number().label("companyNumber"),
  contactEmail: Joi.string().max(50).email().optional().label("contactEmail"),
  contactName: Joi.string().optional().label("contactName"),
  contactPosition: Joi.string().optional().label("contactPosition"),
  vatNumber: Joi.string().label("Vat Number"),
  typeOfBusiness: Joi.string().label("Type of Business"),
  millageCostForUsers: Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().required(),
  }).optional(),
});

module.exports = {
  createOrganizationSchema,
  updateOrganizationSchema,
};
