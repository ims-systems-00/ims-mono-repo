/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const { attachment } = require("../../schemaTemplates/attachment");
const {
  PAYMENT_METHODS,
  ORGANISATTION_STATUS,
  PAYMENT_STATUS,
} = require("../../schemaTemplates/references/typesAndEnums");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ORGANISATTION_STATUS),
      default: ORGANISATTION_STATUS.ACTIVE,
    },
    industry: {
      type: String,
      default: "Not set",
    },
    sizeOfOrg: {
      type: Number,
      default: 1,
    },
    isPartner: {
      type: Boolean,
      default: false,
    },
    isCustomer: {
      type: Boolean,
      default: false,
    },
    logo: {
      metadata: attachment,
      signedUrl: String,
      src: {
        type: String,
        default:
          "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg",
      },
    },
    logoRectangleMeta: attachment,
    logoRectangleSrc: {
      type: String,
      default: null,
    },
    officeEmail: {
      type: String,
      required: true,
    },
    campaignEmail: {
      type: String,
    },
    contactEmail: {
      type: String,
      default: "Not set",
    },
    contactName: {
      type: String,
      default: "Not set",
    },
    contactPosition: {
      type: String,
      default: "Not Set",
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    addressCity: {
      type: String,
      required: true,
    },
    addressBuilding: {
      type: String,
      required: true,
    },
    addressStreet: {
      type: String,
      required: true,
    },
    addressPostCode: {
      type: String,
      required: true,
    },
    addressStateProvince: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    countryAbbr: {
      type: String,
      required: true,
    },
    countryCurrency: {
      type: String,
      required: true,
    },
    countryPhonecode: {
      type: Number,
      required: true,
    },
    companyNumber: {
      type: String,
      dafault: "N/A",
    },
    vatNumber: {
      type: String,
      default: "N/A",
    },
    typeOfBusiness: String,
    bankDetails: {
      name: {
        type: String,
        default: "Not set",
      },
      accountNo: {
        type: String,
        default: "Not set",
      },
      sortCode: {
        type: String,
        default: "Not set",
      },
    },
    licenses: {
      groups: {
        allocated: {
          type: Number,
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      users: {
        allocated: {
          type: Number,
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      superUser: {
        allocated: {
          type: Number,
          default: 1,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      complianceTools: {
        type: [String],
        enum: [
          IMS_SERVICES.DSPTNHS,
          IMS_SERVICES.ISO27001,
          IMS_SERVICES.ISO27001_2022,
          IMS_SERVICES.ISO27001_2022_ANNEX_A,
          IMS_SERVICES.ISO27002,
          IMS_SERVICES.ISO9001,
          IMS_SERVICES.ISO45001,
          IMS_SERVICES.ISO20000,
          IMS_SERVICES.CQC,
          IMS_SERVICES.BS9997,
          IMS_SERVICES.ISO14001,
          IMS_SERVICES.CRM,
          IMS_SERVICES.ISO15686_5,
          IMS_SERVICES.ESG_ENVIRONMENTAL,
          IMS_SERVICES.ESG_GOVERNANCE,
          IMS_SERVICES.ESG_SOCIAL,
          IMS_SERVICES.BUILDING_SAFETY_ACT,
        ],
      },
      additionalModules: {
        type: [String],
        enum: [IMS_SERVICES.CRM],
      },
      carbocalc: {
        type: Boolean,
        default: false,
      },
      imsforms: {
        type: Boolean,
        default: false,
      },
      go2ero: {
        type: Boolean,
        default: false,
      },
      projectims: {
        type: Boolean,
        default: false,
      },
    },
    millageCostForUsers: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        defalt: "£",
      },
    },
    systemDate: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
      unset: {
        type: Boolean,
        default: true,
      },
      lockedAfter: {
        type: Date,
        default: Date.now,
      },
    },
    reportSubscriptions: [
      {
        name: String,
        email: {
          type: String,
          required: true,
        },
        issueDate: {
          type: Date,
          required: true,
        },
        nextDate: {
          type: Date,
          required: true,
        },
        interval: {
          type: String,
          enum: ["Monthly", "Quarterly", "Half yearly", "Yearly"],
        },
      },
    ],
    p1incidentResolutionTime: {
      type: Number,
      default: 0,
    },
    p2incidentResolutionTime: {
      type: Number,
      default: 0,
    },
    p3incidentResolutionTime: {
      type: Number,
      default: 0,
    },
    p4incidentResolutionTime: {
      type: Number,
      default: 0,
    },
    referralSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partnership_programs",
      default: null,
    },
    paymentSystem: {
      type: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
      },
      status: {
        type: String,
        default: PAYMENT_STATUS.TRIAL,
        enum: Object.values(PAYMENT_STATUS),
      },
      information: {
        stripeCustomerId: {
          type: String,
          default: "",
        },
        stripePaymentMethodId: {
          type: String,
          default: "",
        },
        stripeSubscriptionId: {
          type: String,
          default: "",
        },
      },
    },
    reference: {
      default: "",
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, { model: "organizations", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `ORG-${this.ID}`;
    next();
  });
  mongoosePaginate(Schema);
  return mongoose.model("organizations", Schema);
};
module.exports.Schema = Schema;
