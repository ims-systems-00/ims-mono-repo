// Packages
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const {
  fileMetaInfo,
} = require("../../../../helpers/validations/fileMetaInfo");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = new mongoose.Schema(
  {
    moduleType: {
      type: String,
      enum: [
        moduleTypes.cips,
        moduleTypes.documentrepositories,
        moduleTypes.incidents,
        moduleTypes.risks,
        moduleTypes.tasks,
        moduleTypes.cqcsignificantevents,
        moduleTypes.cqcdetails,
        moduleTypes.controlstatuses,
        moduleTypes.customers,
        moduleTypes.expensereports,
        moduleTypes.leaves,
        moduleTypes.documenttrees,
        moduleTypes.cccalculations,
        moduleTypes.imsprojects,
        moduleTypes.imsprojectworkpackages,
      ],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "moduleType",
    },
    fileMetaInfo: fileMetaInfo,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = () => {
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(softDeletePlugin);
  return mongoose.model("attachments", Schema);
};
module.exports.Schema = Schema;
