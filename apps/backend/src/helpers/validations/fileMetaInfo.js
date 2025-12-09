const Joi = require("joi");
module.exports = {
  fileMetaInfo: Joi.object({
    Name: Joi.string().required(),
    Key: Joi.string().required(),
    key: Joi.string().required(),
    Bucket: Joi.string().required(),
  }),
};
