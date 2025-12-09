const mongoose = require("mongoose");
const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
const groupRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "groups",
  alias: "Business function",
  ...getImsMetaInfoForSchema({
    isClientImportable: true,
    isBusinessUnitController: true,
    isOwnerShipControler: false,
  }),
};
module.exports = {
  groupRef,
};
