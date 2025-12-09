// Packages
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
// Models
const User = require("../users&auth/user");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { sourceLinkPlugin } = require("../00_plugins/sourceLinkPlugin");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const analyserTemplate = {
  dataDisplay: String,
  context: String,
  reportStructure: [
    {
      name: String,
      description: String,
      prompt: String,
      response: String,
    },
  ],
};

const Schema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.Mixed,
      enum: [analyserTemplate],
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
    },
  },
  { timestamps: true }
);
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  Schema.plugin(
    sourceLinkPlugin([
      moduleTypes.tasks,
      moduleTypes.risks,
      moduleTypes.incidents,
      moduleTypes.audits,
      moduleTypes.cips,
      moduleTypes.customers,
      moduleTypes.documenttrees,
      moduleTypes.expensereports,
      moduleTypes.managementreviews,
      moduleTypes.kpiobjectives,
      moduleTypes.suppliers,
    ])
  );
  Schema.plugin(orgDataPlugin);
  Schema.statics.populateAiResponse = function (airesponse) {
    return airesponse.populate([
      {
        path: "created.by",
        model: User(connection),
        select: "name email profileImageSrc",
      },
    ]);
  };
  mongoosePaginate(Schema);
  return mongoose.model("aiResponses", Schema);
};
module.exports.Schema = Schema;
