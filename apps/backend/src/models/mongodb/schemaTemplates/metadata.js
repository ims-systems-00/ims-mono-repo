const { createInfo } = require("./actionLog");
const title = {
  type: String,
  required: true,
};
const name = {
  type: String,
  required: true,
};
const description = {
  type: String,
};
const titledMetaInfo = {
  title,
  description,
  ...createInfo,
};
const namedMetaInfo = {
  name,
  description,
  ...createInfo,
};
const metaInfo = {
  description,
  ...createInfo,
};
module.exports = {
  title,
  name,
  description,
  namedMetaInfo,
  titledMetaInfo,
  metaInfo,
};
