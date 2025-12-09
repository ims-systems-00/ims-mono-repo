const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator")

const schema = {
  attendees: Joi.array().items(objectIdJoi.objectId).label('Attendees'),
  agenda: Joi.array().items(fileMetaInfo).label("agenda"),
  minutes: Joi.array().items(fileMetaInfo).label('Minutes'),
  title: Joi.string().label('Title'),
  date: Joi.date().label('Date'),
  time: Joi.string().label('Time'),
  privacy: Joi.string().valid('Organisational', 'Business unit').label('Privacy'),

};
const createValidation = Joi.object({
  ...schema,
  group: objectIdJoi.objectId.label("Group"),
  interval: Joi.string().valid('Monthly', 'Quarterly', 'Half yearly', 'Yearly').required().label('Interval'),
});

const updateValidation = Joi.object({
  ...schema,
});


module.exports = {
  createValidation,
  updateValidation,
};
