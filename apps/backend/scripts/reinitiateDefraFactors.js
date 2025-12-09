require("dotenv").config();
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../src/models");
const { connectDataBase } = require("../src/config/databaseManager");
const {
  CC_EMISSION_FACTOR_TYPES,
} = require("../src/models/mongodb/system/cc/ccEnum");
const defraFactors = require("./data/defraFactors.json").data;
const sicFactors = require("./data/sicFactors.json").data;
const fuelProperties = require("./data/fuelProperties.json").data;

(async function () {
  try {
    await connectDataBase();
    let batch = 1;
    const CCFactors = models.ccfactors();
    await CCFactors.deleteMany({});
    /**
     * insert defra factors
     */
    let defraFactoesPlusFuleProperties = [...defraFactors, ...fuelProperties];
    while (true) {
      if (!defraFactoesPlusFuleProperties.length) break;
      logger.info("batch inserting...", { batch });
      batch++;
      let insertItems = defraFactoesPlusFuleProperties
        .splice(0, 200)
        .map((item) => ({
          factorType: CC_EMISSION_FACTOR_TYPES.ACTIVITY_BASED,
          id: item["ID"],
          year: item["Year"],
          scope: item["Scope"],
          level1: item["Level 1"],
          combinedActivityReference: item["Combined Reference"],
          uom: item["UOM"],
          ghgPerUnit: item["GHG/Unit"],
          ghgConversionFactor: item["GHG Conversion Factor"],
          source: item["Source"],
          sourceNotes: item["Source Notes"],
          neroNotes: item["Nero Notes"],
          grade: item["Grade"],
        }));
      await CCFactors.create(insertItems);
    }
    /**
     * insert sic factors
     */
    while (true) {
      if (!sicFactors.length) break;
      logger.info("batch inserting...", { batch });
      batch++;
      let insertItems = sicFactors.splice(0, 250).map((item) => ({
        factorType: CC_EMISSION_FACTOR_TYPES.SPEND_BASED,
        year: item["Year"],
        sic: item["SIC"],
        sicCategory: item["Category"],
        sicGhgCo2ePerCurrency: item["GHG (kgCO2e per £)"],
        sicGhgCo2PerCurrency: item["CO2 (kgCO2 per £)"],
        source: item["Source"],
        sourceNotes: item["Source Notes"],
        grade: item["Grade"],
      }));
      await CCFactors.create(insertItems);
    }
  } catch (err) {
    logger.error("error syncing tools: ", err);
  }
  process.exit(0);
})();
