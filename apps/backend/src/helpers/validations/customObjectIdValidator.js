const Joi = require("joi");
const mongoose = require("mongoose");

module.exports = {
  objectId: Joi.string()
    .custom((value, helpers) => {
      if (value === null) {
        return value;
      }
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid ObjectId");
      }
      return value;
    })
    .allow(null),
};
