/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const { attachment } = require("../../schemaTemplates/attachment");

const Schema = new mongoose.Schema({
  tenant: {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    metadata: attachment,
    signedUrl: String,
  },
  rootUser: {
    type: {
      type: String,
      default: "Internal",
    },
    name: {
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
  },
  officeEmail: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  companyNumber: String,
  vatNumber: String,
  typeOfBusiness: String,
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
    hosUser: {
      allocated: {
        type: Number,
        default: 0,
      },
      used: {
        type: Number,
        default: 0,
      },
    },
    basicUser: {
      allocated: {
        type: Number,
        default: 0,
      },
      used: {
        type: Number,
        default: 0,
      },
    },
    auditorUser: {
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
  },
  status: {
    type: String,
    enum: ["Pending", "Building", "Built", "Declined"],
  },
  statusChangedAt: {
    type: Date,
    default: Date.now,
  },
  reference: {
    default: "",
    type: String,
  },
});

module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, { model: "buildrequests", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `REQ-${this.ID}`;
    next();
  });
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("buildrequest", Schema);
};
module.exports.Schema = Schema;
