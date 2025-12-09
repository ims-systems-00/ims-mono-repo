const Joi = require("../../lib/validation");

exports.objectId = Joi.string().length(24);
