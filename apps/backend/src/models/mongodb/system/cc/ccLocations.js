/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const mongoose = require("mongoose");
/**
 * Models
 */
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const { CC_GHG_INCLUSION_ASSESSMENT } = require("./ccEnum");
const { getGeoLocationFromAddress } = require("../../../../config/goeCoder");
const Schema = new mongoose.Schema(
  {
    locationRef: {
      type: String,
    },
    addressInMap: {
      type: String,
    },
    addressBuilding: {
      type: String,
    },
    addressStreet: {
      type: String,
    },
    addressCity: {
      type: String,
    },
    addressPostCode: {
      type: String,
    },
    addressStateProvince: {
      type: String,
    },
    addressCountry: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    descriptionOfActivities: {
      type: String,
    },
    ghgAssessmentInclusion: {
      type: String,
      required: true,
      enum: Object.values(CC_GHG_INCLUSION_ASSESSMENT),
    },
    comment: {
      type: String,
    },
    reference: {
      default: "",
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, { model: "cclocations", field: "ID" });
  Schema.plugin(orgDataPlugin);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(softDeletePlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `LOC-${this.ID}`;
    if (this.addressInMap) {
      let results = await getGeoLocationFromAddress(this.addressInMap);
      this.lat = results[0]?.latitude || 0;
      this.lng = results[0]?.longitude || 0;
    }
    next();
  });
  Schema.pre("findOneAndUpdate", async function (next) {
    if (this._update.$set.addressInMap) {
      console.log("update geocode");
      let newAddress = this._update.$set.addressInMap;
      let results = await getGeoLocationFromAddress(newAddress);
      this._update.$set.lat = results[0]?.latitude || 0;
      this._update.$set.lng = results[0]?.longitude || 0;
    }
    next();
  });
  mongoosePaginate(Schema);
  return mongoose.model("cclocations", Schema);
};
module.exports.Schema = Schema;
