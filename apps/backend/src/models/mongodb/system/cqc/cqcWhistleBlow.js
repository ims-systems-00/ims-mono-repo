/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const UserModel = require("../users&auth/user");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    reportedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    dateOfIncident: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    placeOfIncident: {
      type: String,
      default: "",
    },
    involvedPersonnel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    opinion: {
      type: String,
      default: "",
    },
    identity: {
      type: String,
      default: "",
    },
    statementOfDisclosureOne: {
      status: {
        type: Boolean,
        default: false,
      },
      value: {
        type: String,
        default:
          "I am raising these concerns with you openly. I am happy for my identity to be revealed.",
      },
    },
    statementOfDisclosureTwo: {
      status: {
        type: Boolean,
        default: false,
      },
      value: {
        type: String,
        default:
          "I am raising these concerns with you on a confidential basis [in accordance with the company’s assurance of confidentiality in the whistleblowing policy]. I do not want my identity to be revealed to any other party without first obtaining my consent. I ask that you investigate the concerns in such a way so as not to reveal my identity.",
      },
    },
    statementOfDisclosureThree: {
      status: {
        type: Boolean,
        default: false,
      },
      value: {
        type: String,
        default:
          "I am raising these concerns with you anonymously. I do not want to reveal my identity to you. [Raising concerns anonymously can make it more difficult to assert your legal rights.   Please contact HR for advice if you are unsure].",
      },
    },
    signed: {
      status: {
        type: Boolean,
        default: false,
      },
      on: {
        type: Date,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
    },
    created: {
      on: {
        type: Date,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    reference: {
      default: "",
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.plugin(orgDataPlugin)
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "cqcwhistleblows",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `WB-${this.ID}`;
    next();
  });
  Schema.statics.populateCQCWhistleblow = function (document) {
      return document
        .populate([
          { path: "group", model: IamGroup(connection), select: "name " },
          {
            path: "involvedPersonnel",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "sharedWith",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "reportedTo",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "created.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "signed.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("cqcwhistleblows", Schema);
};
module.exports.Schema = Schema;
