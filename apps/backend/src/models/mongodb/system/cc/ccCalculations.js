/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
/**
 * Models
 */
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const {
  CC_DATA_QUALITY_GRADES,
  CC_EMISSION_CATEGORY_NAMES,
  CC_EMISSION_SCOPES,
  CC_EMISSION_SCOPE_NAMES,
  CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
  CC_CALCULATION_METHODS,
} = require("./ccEnum");
const { MONTHS } = require("../../schemaTemplates/references/typesAndEnums");
const Schema = new mongoose.Schema(
  {
    /**
     * managed by ims admins
     */
    scope: {
      type: String,
      required: true,
      enum: Object.values(CC_EMISSION_SCOPES),
    },
    scopeName: {
      type: String,
      required: true,
      enum: Object.values(CC_EMISSION_SCOPE_NAMES),
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(CC_EMISSION_CATEGORY_NAMES),
    },
    /**
     * reporting perios
     */
    reportingYear: {
      type: Number,
      enum: CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
    },
    reportingMonth: {
      type: String,
      enum: ["Annual", ...MONTHS],
    },
    /**
     * activity data
     */
    customFactorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cccustomfactors",
      default: null,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cclocations",
      default: null,
    },
    calculationMethod: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      validate: {
        validator: function (value) {
          if (
            [
              CC_CALCULATION_METHODS.CUSTOM,
              CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
              CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
            ].includes(this.calculationMethod)
          ) {
            return value != null;
          }
          return true;
        },
        message:
          "activity is required when calculationMethod is" +
          CC_CALCULATION_METHODS.CUSTOM +
          "," +
          CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD +
          "," +
          CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
      },
    },
    unit: {
      type: String,
      validate: {
        validator: function (value) {
          if (
            [
              CC_CALCULATION_METHODS.CUSTOM,
              CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
              CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
            ].includes(this.calculationMethod)
          ) {
            return value != null;
          }
          return true;
        },
        message:
          "activity is required when calculationMethod is" +
          CC_CALCULATION_METHODS.CUSTOM +
          "," +
          CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD +
          "," +
          CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
      },
    },
    meterNumber: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    invoiceNumber: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    activityDataGrade: {
      type: String,
      required: true,
      enum: Object.values(CC_DATA_QUALITY_GRADES),
    },
    customReference: {
      default: "",
      type: String,
    },
    reference: {
      default: "",
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * premise(amount * 4)
 * vehicle(amount * 10)
 */

/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "cccalculations",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `EM-${this.ID}`;
    next();
  });
  /**
   * CAUTION: CC-plugins
   * add the plugins for calculations
   * do not allow update on anything in this plugin atributes.
   * these will always be calculated values.
   *
   * order of plugin import matters 'ghgCo2eEmission' always at the top
   * because other plugins optionally become dependent on this plugin calculation.
   *
   */
  Schema.plugin(require("./plugins/calculators/categoryOrder"));
  Schema.plugin(require("./plugins/calculators/emmisionFactorDbYear"));
  Schema.plugin(require("./plugins/calculators/purchasedElectricitySources"));
  Schema.plugin(require("./plugins/calculators/tAndDLosses"));
  Schema.plugin(require("./plugins/calculators/wttTAndD"));
  Schema.plugin(require("./plugins/calculators/wttTandDGeneration"));

  Schema.plugin(require("./plugins/calculators/ghgCo2eEmission"));
  Schema.plugin(require("./plugins/calculators/ghgCo2Emission"));
  Schema.plugin(require("./plugins/calculators/ghgCh4Emission"));
  Schema.plugin(require("./plugins/calculators/energeyNaturalGas"));
  Schema.plugin(require("./plugins/calculators/ghgN2oEmission"));
  Schema.plugin(require("./plugins/calculators/ghgNf3Emission"));
  Schema.plugin(require("./plugins/calculators/ghgHfcEmission"));
  Schema.plugin(require("./plugins/calculators/ghgPfcEmission"));
  Schema.plugin(require("./plugins/calculators/ghgSf6Emission"));
  Schema.plugin(require("./plugins/calculators/ghgBiogenicCo2Emission"));
  Schema.plugin(require("./plugins/calculators/ghgWellToTankCo2eEmission"));
  Schema.plugin(
    require("./plugins/calculators/dataQualityEmissionFactorGrade")
  );
  Schema.plugin(
    require("./plugins/calculators/dataQualityEmissionFactorScore")
  );
  Schema.plugin(
    require("./plugins/calculators/dataQualityEmissionFactorWeightedScore")
  );
  Schema.plugin(require("./plugins/calculators/dataQualityADScore"));
  Schema.plugin(require("./plugins/calculators/dataQualityADWeightedScore"));
  Schema.plugin(require("./plugins/calculators/dataQualityGhg"));
  Schema.plugin(require("./plugins/calculators/emmisionFactorKgCo2ePerUnit"));
  Schema.plugin(require("./plugins/calculators/emmisionFactorNote"));
  Schema.plugin(require("./plugins/calculators/emmisionFactorSource"));
  Schema.plugin(require("./plugins/calculators/secrEnergy"));
  Schema.plugin(require("./plugins/calculators/secrToInclude"));
  Schema.plugin(require("./plugins/calculators/unitId"));

  /** general plugins */
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  return mongoose.model("cccalculations", Schema);
};
module.exports.Schema = Schema;
