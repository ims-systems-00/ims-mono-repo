/**
 * Console coloring is not supported in this  file. Coloring the console is only supported
 * in the main thread. DB connection is alos being used by migrations and schedules. It is
 * highly recommended not use any custom console function in this file.
 */
const mongoose = require("mongoose");
const Tetants = require("../../models/mongodb/admin/tenants/tenants");
const { getNamespace } = require("continuation-local-storage");
const forceRunValidators = require("@ims-systems-00/ims-core/lib/plugins/mongoose/forcevalidation");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
let tenantsMap = [];
let databaseCluster = {};
// create new connection...
const connect = (db) => {
  mongoose.plugin(forceRunValidators);
  return mongoose.createConnection(
    process.env.MONGO_URI + `/${db}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      autoIndex: true,
      connectTimeoutMS: 60000,
    }
  );
};

exports.connectAllDb = () =>
  new Promise(async (resolve, reject) => {
    try {
      let adminConnection = await connect(process.env.ADMIN_DB);
      let tenants = [] || (await Tetants(adminConnection).find({}));
      databaseCluster = adminConnection;
      logger.info("MongoDB admin Connected");
      tenantsMap = tenants;
      resolve("Tenants cached successfully.");
      logger.info("Tenants cached successfully");
    } catch (err) {
      console.error(err);
      reject(err);
      // Exit process with failure
      process.exit(1);
    }
  });
exports.getConnection = () => {
  const nameSpace = getNamespace(process.env.CONNECTION_CONTEXT);
  const connection = nameSpace.get(process.env.CONNECTION);
  if (!connection) return null;
  return connection;
};
exports.getConnectionMap = () => {
  return tenantsMap;
};
exports.getCluster = () => databaseCluster;
