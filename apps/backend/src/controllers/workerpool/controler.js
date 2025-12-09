const workerPool = require("workerpool");
const path = require("path");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

let poolProxy = null;

let init = async (options) => {
  const pool = workerPool.pool(
    path.join(__dirname, "./threadFunctions.js"),
    options
  );
  poolProxy = await pool.proxy();
  logger.info(
    `Worker threads enabled - Min workers: ${pool.minWorkers} - Max workers: ${pool.maxWorkers} - Worker type: ${pool.workerType}`
  );
};

const get = () => poolProxy;

exports.init = init;
exports.get = get;
