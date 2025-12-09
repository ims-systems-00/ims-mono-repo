/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { attachment } = require("../../schemaTemplates/attachment");
/**
 * Models
 */
const UserModel = require("../users&auth/user");
const DocumentRepositoryModel = require("./documentRepository");
const DocumentTreeModel = require("./documentTree");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Internal", "External"],
    },
    message: {
      type: String,
      default: "",
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documentrepositories",
    },
    node: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documenttrees",
    },
    user: {
      externalEmail: {
        type: String,
        default: "",
      },
      internalRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Signed"],
      default: "Pending",
    },
    data: {
      signature: {
        type: String,
        default: "",
      },
      font: {
        type: String,
        default: "dobkin-script",
      },
      signatureLocations: [
        {
          startX: {
            type: Number,
            default: 0.1,
          },
          startY: {
            type: Number,
            default: 0.85,
          },
          pageNumber: {
            type: Number,
            default: 1,
          },
        },
      ],
      name: {
        type: String,
        default: "",
      },
      organisation: {
        type: String,
        default: "",
      },
      jobTitle: {
        type: String,
        default: "",
      },
      signedCopy: attachment,
    },
    securityToken: {
      type: String,
      default: "",
    },
    lastOpenedAt: {
      type: Date,
    },
    signedAt: {
      type: Date,
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
  Schema.statics.populateDocumentReview = function (document) {
    return document.populate([
      {
        path: "user.internalRef",
        model: UserModel(connection),
        select: "name",
      },
      {
        path: "repository",
        model: DocumentRepositoryModel(connection),
        select: "name",
      },
      {
        path: "node",
        model: DocumentTreeModel(connection),
        select: "name",
      },
    ]);
  };
  mongoosePaginate(Schema);
  return mongoose.model("documentsignatures", Schema);
};
module.exports.Schema = Schema;
