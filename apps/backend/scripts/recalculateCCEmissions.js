require("dotenv").config();
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../src/models");
const { connectDataBase } = require("../src/config/databaseManager");

(async function () {
  try {
    await connectDataBase();
    let batch = 1;
    const CCCalculations = models.cccalculations();
    while (true) {
      logger.info("batch calculating...", { batch });
      const emissions = await CCCalculations.paginate(
        {},
        { page: batch, limit: 200 }
      );
      await Promise.all(emissions.docs.map((emission) => emission.save()));
      if (emissions.docs.length < 200) break;
      batch++;
    }
  } catch (err) {
    logger.error("error recalculating data: ", err);
  }
  process.exit(0);
})();
