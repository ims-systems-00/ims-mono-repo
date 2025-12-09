const mongoose = require("mongoose");

module.exports = {
  source: {
    moduleType: {
      type: String,
      default: "",
      /**
       * has to be exact same model names
       */
      enum: ["", "audits", "suppliers", "incidents", "customers"],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "moduleType",
      default: null,
    },
  },
};
