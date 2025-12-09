/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");
const { factorSchema } = require("./schemaTemplates/factorSchema");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
/**
 * Models
 */
const factorManager = require("./plugins/factorManager");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const { CC_EMISSION_CATEGORY_NAMES } = require("./ccEnum");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");

const Schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: Object.values(CC_EMISSION_CATEGORY_NAMES),
    },
    ...factorSchema,
  },
  { timestamps: true }
);

module.exports = () => {
  autoIncreament.initialize();
  Schema.plugin(autoIncreament.plugin, {
    model: "cccustomfactors",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `CF-${this.ID}`;
    console.log(this.reference,)
    next();
  });
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(softDeletePlugin);
  Schema.plugin(factorManager);
  return mongoose.model("cccustomfactors", Schema);
};
module.exports.Schema = Schema;
