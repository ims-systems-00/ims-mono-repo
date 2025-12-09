/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
/**
 * Models
 */

const Schema = mongoose.Schema(
  {
    businessFunctions: {
      type: Number,
      default: 0,
    },
    complianceFunctions: {
      type: Number,
      default: 0,
    },
    numberOfStaffs: {
      type: Number,
      default: 0,
    },
    staffRemote: {
      type: Number,
      default: 0,
    },
    premises: {
      type: Number,
      default: 0,
    },
    organizationalState: {
      type: String,
    },
    organizationalConfidence: {
      type: Number,
    },
    criticalArea: {
      type: String,
    },
    lastManagementReviewDate: {
      type: Date,
    },
    nextManagementReviewDate: {
      type: Date,
    },
    riskOverTheYear: {
      hardware: {
        risks: [Number],
        months: [String],
      },
      software: {
        risks: [Number],
        months: [String],
      },
      people: {
        risks: [Number],
        months: [String],
      },
      premises: {
        risks: [Number],
        months: [String],
      },
      organizational: {
        risks: [Number],
        months: [String],
      },
      clinical: {
        risks: [Number],
        months: [String],
      },
    },
    risksByStatus: {
      open: {
        risks: [Number],
        months: [String],
      },
      mitigated: {
        risks: [Number],
        months: [String],
      },
      accepted: {
        risks: [Number],
        months: [String],
      },
      escalated: {
        risks: [Number],
        months: [String],
      },
    },
    businessFunctionsHavingMostRisks: {
      risks: [Number],
      businessFunctionNames: [String],
    },
    finance: {
      costs: [Number],
      areas: [String],
    },
    inventory: {
      amounts: [Number],
      areas: [String],
    },
    nonConformities: {
      amount: [Number],
      businessFunctionNames: [String],
    },
    audits: {
      completed: { type: Number, default: 0 },
      inCompleted: { type: Number, default: 0 },
    },
    businessFunctionsWithMostOpportunities: {
      amount: [Number],
      businessFunctionNames: [String],
    },
    businessFunctionsWithMostImprovements: {
      amount: [Number],
      businessFunctionNames: [String],
    },
    businessFunctionsWithMostIncidents: {
      total: [Number],
      resolved: [Number],
      businessFunctionNames: [String],
    },
    incidents: {
      total: { type: Number, default: 0 },
      resolved: { type: Number, default: 0 },
      p1AvgResolutionTime: {
        time: { type: String, default: 0 },
        alert: { type: Boolean, default: false },
      },
      p2AvgResolutionTime: {
        time: { type: String, default: 0 },
        alert: { type: Boolean, default: false },
      },
      p3AvgResolutionTime: {
        time: { type: String, default: 0 },
        alert: { type: Boolean, default: false },
      },
      p4AvgResolutionTime: {
        time: { type: String, default: 0 },
        alert: { type: Boolean, default: false },
      },
    },
    supplier: {
      contractValue: {
        total: { type: Number, default: 0 },
      },
    },
    supplierCompliance: {
      compliant: { type: Number, default: 0 },
      inCompliant: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    supplierIncidents: {
      open: { type: Number, default: 0 },
      resolved: { type: Number, default: 0 },
    },
    compliance: {
      iso27001: { type: Number, default: 0 },
      iso27001_2022: { type: Number, default: 0 },
      iso27001_2022_annex_a: { type: Number, default: 0 },
      iso27002: { type: Number, default: 0 },
      iso9001: { type: Number, default: 0 },
      iso45001: { type: Number, default: 0 },
      iso14001: { type: Number, default: 0 },
      dsptNhs: { type: Number, default: 0 },
      iso20000: { type: Number, default: 0 },
      bs9997: { type: Number, default: 0 },
      iso15686_5: { type: Number, default: 0 },
      esgEnvironmental: { type: Number, default: 0 },
      esgSocial: { type: Number, default: 0 },
      esgGovernance: { type: Number, default: 0 },
    },
    cqc: {
      compliance: {
        overall: [
          {
            percentage: { type: Number, default: 0 },
            rating: { type: String },
            siteName: {
              shortName: String,
              fullName: String,
            },
          },
        ],
      },
      significantEvents: {
        total: [Number],
        signedOff: [Number],
        businessFunctionNames: [
          {
            shortName: String,
            fullName: String,
          },
        ],
      },
      whistleBlows: {
        total: [Number],
        signedOff: [Number],
        businessFunctionNames: [
          {
            shortName: String,
            fullName: String,
          },
        ],
      },
      complaints: {
        total: [Number],
        signedOff: [Number],
        businessFunctionNames: [
          {
            shortName: String,
            fullName: String,
          },
        ],
      },
      safeGuardings: {
        total: [Number],
        signedOff: [Number],
        businessFunctionNames: [
          {
            shortName: String,
            fullName: String,
          },
        ],
      },
    },
    crm: {
      customers: {
        stages: [String],
        counts: [Number],
      },
      contractValue: {
        stages: [String],
        amounts: [Number],
      },
      invoiceThisMonth: {
        status: [String],
        counts: [Number],
      },
      invoiceAmountThisMonth: {
        status: [String],
        amounts: [Number],
      },
      mostValuedLiveCustomer: {
        name: String,
        value: {
          type: Number,
          default: 0,
        },
      },
      totalLiveContractValue: {
        name: String,
        value: {
          type: Number,
          default: 0,
        },
      },
      averageContractValue: {
        name: String,
        value: {
          type: Number,
          default: 0,
        },
      },
      lessValuedLiveCustomer: {
        name: String,
        value: {
          type: Number,
          default: 0,
        },
      },
      activeCampaign: {
        type: Number,
        default: 0,
      },
      closedCampaign: {
        type: Number,
        default: 0,
      },
      monthlyCampaign: [Object],
      interactions: {
        weekly: {
          customersEngaged: {
            type: Number,
            defaul: 0,
          },
          totalInteractions: {
            type: Number,
            defaul: 0,
          },
          topCustomersEngaged: [Object],
        },
        monthly: {
          customersEngaged: {
            type: Number,
            defaul: 0,
          },
          totalInteractions: {
            type: Number,
            defaul: 0,
          },
          topCustomersEngaged: [Object],
        },
        last12Month: [Object],
      },
    },
    digitalMaturityMatrix: {
      riskManagement: {
        label: {
          type: String,
          default: "Risk management",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
      incidentManagement: {
        label: {
          type: String,
          default: "Incident management",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
      supplierManagement: {
        label: {
          type: String,
          default: "Supplier management",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
      documentManagement: {
        label: {
          type: String,
          default: "Document management",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
      cip: {
        label: {
          type: String,
          default: "CIP",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
      audits: {
        label: {
          type: String,
          default: "Audits",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
      inventory: {
        label: {
          type: String,
          default: "Inventory",
        },
        point: {
          type: Number,
          default: 2,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
    },
    systemDate: {
      start: { type: Date },
      end: { type: Date },
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
  Schema.plugin(autoIncreament.plugin, { model: "dashboards", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `DB-${this.ID}`;
    next();
  });
  Schema.statics.populateDashBoard = function (dashboard) {
      return dashboard
        .populate([
          {
            path: "organization",
            model: require("../organization/organization")(connection),
            select: "name",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("dashboards", Schema);
};
module.exports.Schema = Schema;
