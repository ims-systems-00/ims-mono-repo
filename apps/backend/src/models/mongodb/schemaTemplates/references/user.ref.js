const mongoose = require("mongoose");
const userRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
};
module.exports = {
  userRef,
};
