const mongoose = require("mongoose");
/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const sourceLinkPlugin =
  (sourceModules = []) =>
  (schema) => {
    schema.add({
      source: {
        moduleType: {
          type: String,
          default: "",
          /**
           * has to be exact same model names
           */
          enum: ["", ...sourceModules],
        },
        module: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "moduleType",
          default: null,
        },
      },
    });
  };
module.exports = { sourceLinkPlugin };
