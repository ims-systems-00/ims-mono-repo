const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

/**
 * wp => parentWP => linkedWP
 * wp.find({ childWP: 4 }) => [ (4,1), (4,2), (4,3) ] // find all the parents of a specefic child
 * wp.find({ parentWP: 1 }) => [ (1,4), (1,5), (1,6) ] // find all the subs/childs of a specefic parent
 *implement ui frontend[1] => design the ui[4]
 *implement ui frontend[1] => code the design system[5]
 *implement ui frontend[1] => prototype in figma[6]
 *finalise demo with client[2] => design the ui[4]
 *polish api response[3] => design the ui[4]
 *
 */
const Schema = new mongoose.Schema(
  {
    parentWorkPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsprojectworkpackages",
      default: null,
    },
    childWorkPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsprojectworkpackages",
      default: null,
    },
    blockingWorkPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsprojectworkpackages",
      default: null,
    },
    waitingWorkPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsprojectworkpackages",
      default: null,
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
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  return mongoose.model("imsprojectworkpackagerelationships", Schema);
};
module.exports.Schema = Schema;
