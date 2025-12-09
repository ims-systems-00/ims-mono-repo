/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
/**
 * Models
 */
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const {
  CC_REPORTING_METHODS,
  CC_ORGANISATIONAL_BOUNDARIES,
  CC_ALLOWED_NET_ZERO_TARGET_YEARS,
  CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
  CC_EMISSION_SCOPES,
  CC_EMISSION_SCOPE_NAMES,
  CC_EMISSION_SCOPE_1_CATEGORY_NAMES,
  CC_EMISSION_SCOPE_2_CATEGORY_NAMES,
  CC_EMISSION_SCOPE_3_CATEGORY_NAMES,
  CC_RELEVANCE,
} = require("./ccEnum");
const { MONTHS } = require("../../schemaTemplates/references/typesAndEnums");

function _buildDefaultReportingBoundaryFromCategories(config) {
  let boundary = [];
  let categoryNames = null;
  switch (config.scope) {
    case `${CC_EMISSION_SCOPES.SCOPE_1}`:
      categoryNames = CC_EMISSION_SCOPE_1_CATEGORY_NAMES;
      break;
    case `${CC_EMISSION_SCOPES.SCOPE_2}`:
      categoryNames = CC_EMISSION_SCOPE_2_CATEGORY_NAMES;
      break;
    case `${CC_EMISSION_SCOPES.SCOPE_3}`:
      categoryNames = CC_EMISSION_SCOPE_3_CATEGORY_NAMES;
      break;
  }
  Object.values(categoryNames).forEach((cat) => {
    boundary.push({
      scope: config.scope,
      scopeName: config.scopeName,
      category: cat,
      relevance: CC_RELEVANCE.RELEVANT_CALCULATED,
    });
  });
  return boundary;
}

const Schema = new mongoose.Schema(
  {
    /** use for date list construction */
    reportingStartDate: {
      type: Date, // can not be older than 01/01/2020
    },
    /** auto set property */
    emissionFactorDBYearCountFactor: {
      type: Number,
      enum: [0, 1],
    },
    reportingYears: [
      {
        year: {
          type: Number,
          enum: [CC_ALLOWED_NET_ZERO_REPORTING_YEARS],
        },
        turnOver: {
          type: Number,
          default: 0,
        },
        employeeCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    //automated
    reportingMonths: [String],
    baseReportingYear: {
      type: Number,
      enum: [CC_ALLOWED_NET_ZERO_REPORTING_YEARS],
    },
    currentReportingYear: {
      type: Number,
      enum: [CC_ALLOWED_NET_ZERO_REPORTING_YEARS],
    },
    primaryReportingMethod: {
      type: String,
      default: CC_REPORTING_METHODS.MARKET_BASED,
      enum: Object.values(CC_REPORTING_METHODS),
    },
    organisationalBoundary: {
      type: String,
      default: CC_ORGANISATIONAL_BOUNDARIES.OPERATIONAL_CONTROL,
      enum: Object.values(CC_ORGANISATIONAL_BOUNDARIES),
    },
    reportingBoundaries: {
      type: [
        {
          scope: String,
          scopeName: String,
          category: String,
          relevance: {
            type: String,
            enum: Object.values(CC_RELEVANCE),
          },
        },
      ],
      default: [
        ..._buildDefaultReportingBoundaryFromCategories({
          scope: CC_EMISSION_SCOPES.SCOPE_1,
          scopeName: CC_EMISSION_SCOPE_NAMES.SCOPE_1_NAME,
        }),
        ..._buildDefaultReportingBoundaryFromCategories({
          scope: CC_EMISSION_SCOPES.SCOPE_2,
          scopeName: CC_EMISSION_SCOPE_NAMES.SCOPE_2_NAME,
        }),
        ..._buildDefaultReportingBoundaryFromCategories({
          scope: CC_EMISSION_SCOPES.SCOPE_3,
          scopeName: CC_EMISSION_SCOPE_NAMES.SCOPE_3_NAME,
        }),
      ],
    },
    netZeroTargtYear: {
      type: Number,
      enum: [CC_ALLOWED_NET_ZERO_TARGET_YEARS],
    },
    netZeroReductionPercentageAmbition: {
      type: Number,
      min: [1, "Net zero reduction ambition cannot be less than 1%"],
      max: [100, "Net zero reduction ambition cannot be greater than 100%"],
    },
  },
  { timestamps: true }
);

function generateMonthAbbreviations(currentMonthIndex) {
  const monthAbbreviations = [];
  // Loop through the months starting from the current month
  for (let i = currentMonthIndex; i < MONTHS.length; i++) {
    monthAbbreviations.push(MONTHS[i]); // Push the month abbreviation into the array
  }
  // Loop through the remaining months from the beginning of the year to the current month
  for (let i = 0; i < currentMonthIndex; i++) {
    monthAbbreviations.push(MONTHS[i]); // Push the month abbreviation into the array
  }
  return monthAbbreviations;
}

module.exports = (connection) => {
  Schema.plugin(orgDataPlugin);
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  mongoosePaginate(Schema);
  Schema.pre("save", function () {
    const reportingStartDate = new Date(this.reportingStartDate);
    if (reportingStartDate.getMonth() <= 5)
      this.emissionFactorDBYearCountFactor = 1;
    else this.emissionFactorDBYearCountFactor = 0;
    this.reportingMonths = generateMonthAbbreviations(
      reportingStartDate.getMonth()
    );
    if (!this.reportingYears || !this.reportingYears.length) {
      this.reportingYears = CC_ALLOWED_NET_ZERO_REPORTING_YEARS.map((year) => ({
        year,
      }));
    }
  });
  Schema.pre("findOneAndUpdate", function () {
    let update = this.getUpdate();
    if (update.$set.reportingStartDate) {
      let reportingStartDate = new Date(update.$set.reportingStartDate);
      if (reportingStartDate.getMonth() <= 5)
        update.$set.emissionFactorDBYearCountFactor = 1;
      else update.$set.emissionFactorDBYearCountFactor = 0;
      update.$set.reportingMonths = generateMonthAbbreviations(
        reportingStartDate.getMonth()
      );
      this.setUpdate(update);
    }
  });
  return mongoose.model("ccparameters", Schema);
};
module.exports.Schema = Schema;
