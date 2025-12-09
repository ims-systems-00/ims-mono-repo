const { CC_CALCULATION_METHODS } = require("../../ccEnum");
const fuels = {
  "gaseous fuels, butane": 1,
  "gaseous fuels, cng": 1,
  "gaseous fuels, lng": 1,
  "gaseous fuels, lpg": 1,
  "gaseous fuels, natural gas": 2,
  "gaseous fuels, other petroleum gas": 1,
  "gaseous fuels, propane": 1,
  "liquid fuels, aviation spirit": 1,
  "liquid fuels, aviation turbine fuel": 1,
  "liquid fuels, burning oil": 1,
  "liquid fuels, diesel (average biofuel blend)": 1,
  "liquid fuels, diesel (100% mineral diesel)": 1,
  "liquid fuels, fuel oil": 1,
  "liquid fuels, gas oil": 1,
  "liquid fuels, petrol (average biofuel blend)": 1,
  "liquid fuels, petrol (100% mineral petrol)": 1,
  "liquid fuels, waste oils": 1,
  "liquid fuels, marine gas oil": 1,
  "liquid fuels, marine fuel oil": 1,
  "solid fuels, coal (industrial)": 3,
  "solid fuels, coal (electricity generation)": 3,
  "solid fuels, coal (domestic)": 3,
  "biofuel, bioethanol": 4,
  "biofuel, biodiesel me": 4,
  "biofuel, biomethane (compressed)": 4,
  "biofuel, biodiesel me (from used cooking oil)": 4,
  "biofuel, biodiesel me (from tallow)": 4,
  "biofuel, biodiesel hvo": 4,
  "biofuel, biopropane": 4,
  "biofuel, development diesel": 4,
  "biofuel, development petrol": 4,
  "biofuel, off road biodiesel": 4,
  "biofuel, biomethane (liquified)": 4,
  "biofuel, methanol (bio)": 4,
  "biofuel, avtur (renewable)": 4,
  "biomass, wood logs": 5,
  "biomass, wood chips": 5,
  "biomass, wood pellets": 5,
  "biomass, grass/straw": 5,
  "biogas, biogas": 5,
  "biogas, landfill gas": 5,
};
function calc() {
  if ([CC_CALCULATION_METHODS.FUEL_BASED_METHOD].includes(this.category)) {
    this.unitId = fuels[this.activity?.toLowerCase()];
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    unitId: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
