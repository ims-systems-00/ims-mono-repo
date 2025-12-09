/**
 * Packages
 */
const mongoose = require("mongoose");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment");
/**
 * Models
 */
const UserModel = require("../users&auth/user");
const TaskModel = require("../taskManagement/task");
const CalenderEvents = require("../calender/calenderEvents");
const IamGroupModel = require("../ourIms/iamGroup");
const { attachment } = require("../../schemaTemplates/attachment");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    name: {
      type: String,
      required: true,
    },
    accountManager: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    serviceProvision: {
      type: String,
    },
    contractStartDate: {
      type: Date,
      default: Date.now,
    },
    contractEndDate: {
      type: Date,
    },
    contractFiles: [attachment],
    slaFiles: [attachment],
    kpiObjectives: [
      {
        value: {
          type: String,
        },
      },
    ],
    onBoardingFiles: [attachment],
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    reviewDate: {
      type: Date,
    },
    isCompliant: {
      type: Boolean,
      default: false,
    },
    contractValue: {
      type: Number,
      default: 0,
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
  autoIncreament.initialize(connection);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, { model: "suppliers", field: "ID" });
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.suppliers, [TaskModel(connection)])
  );
  Schema.pre("validate", async function (next) {
    this.reference = `SUP-${this.ID}`;
    next();
  });
  Schema.post("findOneAndDelete", async function (supplier) {
    await CalenderEvents(connection).deleteOne({ systemEventId: supplier._id });
  });
  (Schema.statics.populateSupplier = function (supplier) {
    return supplier.populate([
      { path: "group", model: IamGroupModel(connection), select: "name" },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "buyer",
        model: UserModel(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "contractFiles.modified.by",
        model: UserModel(connection),
        select: "name",
      },
      {
        path: "slaFiles.modified.by",
        model: UserModel(connection),
        select: "name",
      },
      {
        path: "onBoardingFiles.modified.by",
        model: UserModel(connection),
        select: "name",
      },
    ]);
  }),
    (Schema.statics.createCalenderEvent = async function (supplier) {
      let isThere = await CalenderEvents(connection).findOne({
        systemEventId: supplier._id,
      });
      if (!isThere) {
        let groups = await IamGroupModel(connection).find({
          $or: [
            { _id: supplier.group._id },
            { name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION },
          ],
        });
        let attendees = await UserModel(connection).find({
          "accessPolicies.group": { $in: groups.map((group) => group._id) },
        });
        await CalenderEvents(connection).create({
          group: supplier.group,
          systemEventId: supplier._id,
          eventReference: "supplier",
          title: `${supplier.name} supplier review (${supplier.group.name})`,
          description: `${
            supplier.serviceProvision
          }\nContract start date:\n${moment(supplier.contractStartDate).format(
            "D/M/Y"
          )}`,
          start: supplier.reviewDate,
          color: "orange",
          end: supplier.reviewDate,
          attendees: attendees.map((attendee) => attendee._id),
          created: {
            on: Date.now(),
            by: supplier.created.by._id,
          },
        });
      }
    }),
    (Schema.statics.updateCalenderEvent = async function (supplier) {
      let group = await IamGroupModel(connection).findOne(
        { _id: supplier.group },
        "name"
      );
      await CalenderEvents(connection).findOneAndUpdate(
        { systemEventId: supplier._id },
        {
          title: `${supplier.name} supplier review (${group.name})`,
          description: `${
            supplier.serviceProvision
          }\nContract start date:\n${moment(supplier.contractStartDate).format(
            "D/M/Y"
          )}`,
          start: supplier.reviewDate,
          end: supplier.reviewDate,
        },
        { new: true }
      );
    }),
    mongoosePaginate(Schema);
  return mongoose.model("suppliers", Schema);
};
module.exports.Schema = Schema;
