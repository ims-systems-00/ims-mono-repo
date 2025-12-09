/**
 * @typedef {Object} Options
 * @property {Boolean} isClientImportable - decides if the field is importable or not.
 * @property {Boolean} isOwnerShipControler - decides if the field is importable or not.
 * @property {Boolean} isBusinessUnitController - decides if the field is importable or not.
 */
/**
 * @param {Options} options
 * @returns {Object} - some meta info for the schema
 */
let getImsMetaInfoForSchema = (options) => {
  let _ims_meta_info = { ...options };
  return { _ims_meta_info };
};
module.exports = {
  getImsMetaInfoForSchema,
};
