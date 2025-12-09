/**
 * Packages
 */
const mongoose = require("mongoose");
const byAndOn = {
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  on: {
    type: Date,
    default: Date.now,
  },
};
const createInfo = { created: { ...byAndOn } };
const updateInfo = { updated: { ...byAndOn } };
const modifyInfo = { modified: { ...byAndOn } };
exports.byAndOn = byAndOn;
exports.createInfo = createInfo;
exports.updateInfo = updateInfo;
exports.modifyInfo = modifyInfo;
