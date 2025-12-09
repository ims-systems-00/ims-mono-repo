const { modifyInfo } = require("./actionLog");
exports.attachment = {
  Name: {
    type: String,
  },
  key: {
    type: String,
  },
  Key: {
    type: String,
  },
  Bucket: {
    type: String,
  },
  ...modifyInfo,
};
