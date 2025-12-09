const { attachment } = require("../../../schemaTemplates/attachment");
const storageInfoAndSrc = {
  storageInfo: attachment,
  src: {
    type: String,
    default: "",
  },
};

module.exports = {
  storageInfoAndSrc,
};
