const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const orgDataPlugin = (schema) => {
  schema.add({
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
      alias: "Organization",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
        isBusinessUnitController: true,
        isOwnerShipControler: false,
      }),
      default: null,
    },
  });
  if (
    !schema.statics.paginate ||
    typeof schema.statics.paginate === "function"
  ) {
    mongoosePaginate(schema);
  }
  schema.statics._orgIdValidation = function (orgId) {
    if (!orgId) throw new Error("orgId at arg[0] is a required.");
    if (!mongoose.Types.ObjectId.isValid(orgId))
      throw new Error("invalid mongodb ObjectId");
    return true;
  };
  schema.statics.paginateByOrg = function (
    orgId,
    query,
    ...paginationRestArgs
  ) {
    if (this._orgIdValidation(orgId)) {
      return this.paginate(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...paginationRestArgs
      );
    }
  };
  schema.statics.countDocumentsByOrg = function (
    orgId,
    query,
    ...paginationRestArgs
  ) {
    if (this._orgIdValidation(orgId)) {
      return this.countDocuments(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...paginationRestArgs
      );
    }
  };
  schema.statics.findOneByOrg = function (orgId, query, ...args) {
    if (this._orgIdValidation(orgId)) {
      return this.findOne(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...args
      );
    }
  };
  schema.statics.findByOrg = function (orgId, query, ...args) {
    if (this._orgIdValidation(orgId)) {
      return this.find(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...args
      );
    }
  };
  schema.statics.findOneAndUpdateByOrg = function (orgId, query, ...args) {
    if (this._orgIdValidation(orgId)) {
      return this.findOneAndUpdate(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...args
      );
    }
  };
  schema.statics.updateManyByOrg = function (orgId, query, ...args) {
    if (this._orgIdValidation(orgId)) {
      return this.updateMany(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...args
      );
    }
  };
  schema.statics.updateOneByOrg = function (orgId, query, ...args) {
    if (this._orgIdValidation(orgId)) {
      return this.updateOne(
        {
          ...query,
          // CAUTION: it organization has to be always at the end of query here, otherwise huge security risk
          organization: orgId,
        },
        ...args
      );
    }
  };
};
module.exports = { orgDataPlugin };
