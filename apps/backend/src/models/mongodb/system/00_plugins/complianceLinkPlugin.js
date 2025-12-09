const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const mongoose = require("mongoose");
/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const complianceLinkPlugin = (schema) => {
  schema.add({
    isoControls: {
      toolkits: {
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
          IMS_SERVICES.ISO15686_5,
          IMS_SERVICES.ESG_ENVIRONMENTAL,
          IMS_SERVICES.ESG_GOVERNANCE,
          IMS_SERVICES.ESG_SOCIAL,
        ],
      },
      clauses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "compliancecontrols",
      },
    },
  });
};
module.exports = { complianceLinkPlugin };
