const { userRef } = require("../../../schemaTemplates/references/user.ref");
const submission = {
  status: {
    type: String,
    enum: ["Draft", "Pending", "Ongoing", "Approved", "Rejected"],
    default: "Draft",
  },
  submissionDate: {
    type: Date,
  },
  decisionDate: {
    type: Date,
  },
  decisionMaker: {
    ...userRef,
  },
  lineManagers: [
    {
      ...userRef,
      required: true,
    },
  ],
};
module.exports = { submission };
