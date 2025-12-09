const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const {
  CC_GHG_INCLUSION_ASSESSMENT,
} = require("../../models/mongodb/system/cc/ccEnum");

const createCcLocation = Joi.object({

  locationRef: Joi.string().required().allow("", null).label("locationRef"),
  addressInMap: Joi.string().optional().allow("", null).label("addressInMap"),
  addressBuilding: Joi.string()
    .optional()
    .allow("", null)
    .label("addressBuilding"),
  addressStreet: Joi.string().optional().allow("", null).label("addressStreet"),
  addressCity: Joi.string().optional().allow("", null).label("addressCity"),
  addressPostCode: Joi.string()
    .optional()
    .allow("", null)
    .label("addressPostCode"),
  addressStateProvince: Joi.string()
    .optional()
    .allow("", null)
    .label("addressStateProvince"),
  addressCountry: Joi.string()
    .optional()
    .allow("", null)
    .label("addressCountry"),
  descriptionOfActivities: Joi.string()
    .optional()
    .allow("", null)
    .label("descriptionOfActivities"),

  ghgAssessmentInclusion: Joi.string()
    .valid(...Object.values(CC_GHG_INCLUSION_ASSESSMENT))
    .optional()
    .label("ghgAssessmentInclusion"),

  comment: Joi.string().optional().allow("", null).label("comment"),
});

const updateCcLocation = Joi.object({
  locationRef: Joi.string().optional().allow("", null).label("locationRef"),

  addressInMap: Joi.string().optional().allow("", null).label("addressInMap"),
  addressBuilding: Joi.string()
    .optional()
    .allow("", null)
    .label("addressBuilding"),
  addressStreet: Joi.string().optional().allow("", null).label("addressStreet"),
  addressCity: Joi.string().optional().allow("", null).label("addressCity"),
  addressPostCode: Joi.string()
    .optional()
    .allow("", null)
    .label("addressPostCode"),

  addressCountry: Joi.string()
    .optional()
    .allow("", null)
    .label("addressCountry"),
  addressStateProvince: Joi.string()
    .optional()
    .allow("", null)
    .label("addressStateProvince"),

  descriptionOfActivities: Joi.string()
    .allow("", null)
    .optional()
    .label("descriptionOfActivities"),

  ghgAssessmentInclusion: Joi.string()
    .valid(...Object.values(CC_GHG_INCLUSION_ASSESSMENT))
    .optional()
    .label("ghgAssessmentInclusion"),

  comment: Joi.string().optional().allow("", null).label("comment"),
});

module.exports = {
  createCcLocation,
  updateCcLocation,
};
