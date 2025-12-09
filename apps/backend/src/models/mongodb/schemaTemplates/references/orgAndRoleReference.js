const mongoose = require("mongoose");
const { ROLES } = require("./typesAndEnums");

const orgAndRoleReference = {
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organizations",
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: true,
  },
};

module.exports = {
  orgAndRoleReference,
};
