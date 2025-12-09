/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const User = require("../users&auth/user");
const IamGroup = require("../ourIms/iamGroup");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { screens } = require("../../schemaTemplates/utils/screens");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    referenceType: {
      type: String,
      enum: [
        moduleTypes._,
        moduleTypes.tasks,
        moduleTypes.leaves,
        moduleTypes.risks,
        moduleTypes.documentrepositories,
        moduleTypes.cqcsafeguardings,
        moduleTypes.customers,
        moduleTypes.managementreviews,
        moduleTypes.licenserequests,
        moduleTypes.cqcwhistleblows,
        moduleTypes.invoices,
        moduleTypes.activities,
        moduleTypes.cqcsignificantevents,
        moduleTypes.audits,
        moduleTypes.suppliers,
        moduleTypes.incidents,
        moduleTypes.kpiobjectives,
        moduleTypes.cips,
        moduleTypes.groups,
        moduleTypes.complaints,
        moduleTypes.expensereports,
        moduleTypes.documenttrees,
        moduleTypes.notifications,
        moduleTypes.cqcoverviews,
        moduleTypes.imsprojects,
      ],
    },
    referenceModule: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceType",
    },
    sent: {
      status: {
        type: String,
        enum: ["sent", "unsent"],
        default: "unsent",
      },
      on: { type: Date },
    },
    icon: {
      type: String,
      default: `${process.env.ASSETS_BASE_URL}/images/system/notification/notification-default.png`,
    },
    read: {
      status: {
        type: String,
        enum: ["read", "unread"],
        default: "unread",
      },
      on: { type: Date },
    },
    title: {
      type: String,
    },
    msg: {
      type: String,
    },
    isOrganizational: {
      type: Boolean,
      default: false,
    },
    popUp: {
      status: {
        type: String,
        enum: ["read", "unread"],
        default: "read",
      },
      on: { type: Date },
    },
    params: {
      type: Object,
    },
    screenIdentifier: {
      type: String,
      enum: Object.values(screens),
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
        default: Date.now,
      },
    },
    reference: {
      default: "",
      type: String,
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
  Schema.statics.populateNotification = function (notification) {
    return notification.populate([
      { path: "group", model: IamGroup(connection), select: "name email" },
      {
        path: "user",
        model: User(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "created.by",
        model: User(connection),
        select: "name email profileImageSrc",
      },
    ]);
  };

  Schema.statics.triggerToSendNotification = (notification) => notification;
  // webSocket.getSocket().to(notification.user._id.toString()).emit('new-notification', notification)

  mongoosePaginate(Schema);
  return mongoose.model("notifications", Schema);
};
module.exports.Schema = Schema;
