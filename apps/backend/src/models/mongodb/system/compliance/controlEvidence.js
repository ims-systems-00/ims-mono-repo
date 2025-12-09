
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const IamGroup = require("../ourIms/iamGroup");
const UserModel = require("../users&auth/user");
const ControlstatusModel = require("./controlStatus");
const RiskModel = require("../riskManagement/risk");
const IncidentModel = require("../incidentManagement/incident");
const CipModel = require("../cip/cip");
const DocumentTreeModel = require("../documentManagement/documentTree");

const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const { attachment } = require("../../schemaTemplates/attachment");

const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      default: null,
    },
    evidenceType: {
      type: String,
      enum: ["raw-file", "text-content", "risk-management", "incident-management", "cip", "document-management"],
      required: true,
    },
    relatedRisk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "risks",
    },
    relatedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "incidents",
    },
    relatedCip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cips",
    },
    relatedDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documenttrees",
    },
    controlStatusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "controlstatuses",
      required: true,
    },
    fileStorage: attachment,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
  Schema.plugin(orgDataPlugin);
  Schema.statics.populateControl = function (control) {
    return control.populate([
      { path: "group", model: IamGroup(connection), select: "name" },
      {
        path: "updatedBy",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      { path: "controlStatusId", model: ControlstatusModel(connection) },
      { path: "relatedRisk", model: RiskModel(connection) },
      { path: "relatedIncident", model: IncidentModel(connection) },
      { path: "relatedCip", model: CipModel(connection) },
      { path: "relatedDocument", model: DocumentTreeModel(connection) },
    ]);
  };
  mongoosePaginate(Schema);
  return mongoose.model("controlevidence", Schema);
};
