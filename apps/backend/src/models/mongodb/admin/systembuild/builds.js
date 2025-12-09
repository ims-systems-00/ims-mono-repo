const mongoose = require("mongoose");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
const { attachment } = require("../../schemaTemplates/attachment");

const userSchema = {
  type: {
    type: String,
    default: "Internal",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "123123123",
  },
  workPlace: {
    type: String,
    default: "On-site",
  },
  salary: {
    type: Number,
    default: 0,
  },
  jobTitle: String,
  accessPeriod: {
    type: String,
    default: "Full time",
  },
};
const Schema = new mongoose.Schema(
  {
    tenant: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true, unique: true },
    logo: {
      metadata: attachment,
      url: String,
    },
    rootUsers: [userSchema],
    officeEmail: {
      type: String,
      required: true,
    },
    campaignEmail: {
      type: String,
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
    contactNumber: {
      type: String,
      required: true,
    },
    buildingName: {
      type: String,
      default: "Not set",
    },
    streetName: {
      type: String,
      default: "Not set",
    },
    postCode: {
      type: String,
      default: "Not set",
    },
    town: {
      type: String,
      default: "Not set",
    },
    companyNumber: {
      type: String,
      default: "Not set",
    },
    vatNumber: {
      type: String,
      default: "Not set",
    },
    typeOfBusiness: {
      type: String,
      default: "Not set",
    },
    bankDetails: {
      name: {
        type: String,
        required: true,
      },
      accountNo: {
        type: String,
        required: true,
      },
      sortCode: {
        type: String,
        required: true,
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
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      complianceTools: [
        {
          name: {
            type: String,
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
              IMS_SERVICES.ISO15686_5,
              IMS_SERVICES.ESG_ENVIRONMENTAL,
              IMS_SERVICES.ESG_GOVERNANCE,
              IMS_SERVICES.ESG_SOCIAL,
            ],
          },
          allocated: Number,
          used: Number,
        },
      ],
      premiumModules: [
        {
          name: {
            type: String,
            enum: [IMS_SERVICES.CRM],
          },
        },
      ],
    },
    systemDate: {
      start: {
        type: Date,
        default: null,
      },
      end: {
        type: Date,
        default: null,
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
    status: {
      type: String,
      enum: ["Pending", "Live", "Declined", "Terminated", "Locked"],
      default: "Pending",
    },
    statusChangedAt: {
      type: Date,
      default: Date.now,
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
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("builds", Schema);
};
