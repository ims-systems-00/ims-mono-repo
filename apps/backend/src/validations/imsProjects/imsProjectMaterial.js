const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  name: Joi.string().required().label("title"),
  description: Joi.string().optional().default("").label("description"),
  type: Joi.string().optional().label("Type"),
  color: Joi.string().optional().label("Color"),
  length: Joi.string().optional().label("Length"),
  model: Joi.string().optional().label("Model"),
  address: Joi.string().optional().label("Address"),
  lat: Joi.number().optional().label("Latitude"),
  lng: Joi.number().optional().label("Longitude"),
  building: Joi.string().optional().label("Building"),
  block: Joi.string().optional().label("Block"),
  level: Joi.string().optional().label("Level"),
  manufacturer: Joi.string().optional().label("Manufacturer"),
  supplier: Joi.string().optional().label("Supplier"),
};

const createImsProjectMaterial = Joi.object({
  ...schema,
  imsProjectId: objectIdJoi.objectId.label("imsProjectId"),
});

const updateiMSProjectMaterial = Joi.object({
  ...schema,
});

module.exports = {
  createImsProjectMaterial,
  updateiMSProjectMaterial,
};
