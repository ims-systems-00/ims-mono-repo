const mongoose = require("mongoose");
function calc() {
  if (this.ghgCo2eEmission !== null) {
    this.emmisionFactorKgCo2ePerUnit =
      (this.ghgCo2eEmission / this.amount) * 1000;
    this.emmisionFactorKgCo2ePerUnit =
      this.emmisionFactorKgCo2ePerUnit.toFixed(5);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    emmisionFactorKgCo2ePerUnit: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
