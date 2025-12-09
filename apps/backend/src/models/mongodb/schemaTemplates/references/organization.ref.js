const mongoose = require("mongoose");
const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
const organizationRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "organizations",
  alias: "Business function",
  ...getImsMetaInfoForSchema({
    isClientImportable: true,
    isBusinessUnitController: true,
    isOwnerShipControler: false,
  }),
};
module.exports = {
  organizationRef,
};
