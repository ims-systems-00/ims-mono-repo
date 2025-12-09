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
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    groupName: {
      type: String,
      default: "Business function name",
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
      default: "Safe",
    },
    organizationalConfidence: {
      type: Number,
      default: 0,
    },
    criticalArea: {
      type: String,
      default: "No area",
    },
    lastManagementReviewDate: {
      type: Date,
      default: null,
    },
    nextManagementReviewDate: {
      type: Date,
      default: null,
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
    risksOverview: {
      totalRisksInThisSystemDates: {
        type: Number,
        default: 0,
      },
      totalOpenedRisksInThisMonth: {
        type: Number,
        default: 0,
      },
      totalMitigatedRisksInThisMonth: {
        type: Number,
        default: 0,
      },
      totalEscalatedRisksInThisMonth: {
        type: Number,
        default: 0,
      },
      totalAcceptedRisksInThisMonth: {
        type: Number,
        default: 0,
      },
    },
    finance: {
      costs: [Number],
      areas: [String],
    },
    inventory: {
      amounts: [Number],
      areas: [String],
    },
    audits: {
      completed: { type: Number, default: 0 },
      inCompleted: { type: Number, default: 0 },
      findings: {
        data: [Number],
        areas: [String],
      },
    },
    incidentsByStatus: {
      open: {
        incidents: [Number],
        months: [String],
      },
      resolved: {
        incidents: [Number],
        months: [String],
      },
      escalated: {
        incidents: [Number],
        months: [String],
      },
    },
    incidents: {
      total: { type: Number, default: 0 },
      resolved: { type: Number, default: 0 },
      p1AvgResolutionTime: {
        time: { type: String, default: "Not set" },
        alert: { type: Boolean, default: false },
      },
      p2AvgResolutionTime: {
        time: { type: String, default: "Not set" },
        alert: { type: Boolean, default: false },
      },
      p3AvgResolutionTime: {
        time: { type: String, default: "Not set" },
        alert: { type: Boolean, default: false },
      },
      p4AvgResolutionTime: {
        time: { type: String, default: "Not set" },
        alert: { type: Boolean, default: false },
      },
    },
    improvementsByStatus: {
      open: {
        improvements: [Number],
        months: [String],
      },
      implemented: {
        improvements: [Number],
        months: [String],
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
      iso27002: { type: Number, default: 0 },
      iso27001_2022: { type: Number, default: 0 },
      iso27001_2022_annex_a: { type: Number, default: 0 },
      iso9001: { type: Number, default: 0 },
      iso45001: { type: Number, default: 0 },
      iso14001: { type: Number, default: 0 },
      iso20000: { type: Number, default: 0 },
      dsptNhs: { type: Number, default: 0 },
      bs9997: { type: Number, default: 0 },
      iso15686_5: { type: Number, default: 0 },
      esgEnvironmental: { type: Number, default: 0 },
      esgSocial: { type: Number, default: 0 },
      esgGovernance: { type: Number, default: 0 },
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
        value: Number,
      },
      totalLiveContractValue: {
        name: String,
        value: Number,
      },
      averageContractValue: {
        name: String,
        value: Number,
      },
      lessValuedLiveCustomer: {
        name: String,
        value: Number,
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
    supplier: {
      contractValue: {
        total: { type: Number, default: 0 },
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
      start: { type: Date, default: null },
      end: { type: Date, default: null },
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
  Schema.plugin(orgDataPlugin)
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "groupdashboards",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `GDB-${this.ID}`;
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
  return mongoose.model("groupdashboards", Schema);
};
module.exports.Schema = Schema;
