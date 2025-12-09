const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.connectDataBase = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.plugin(mongoosePaginate);
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DATABASE}`, {
      autoIndex: true,
    });
    logger.info("Database connected");
  } catch (err) {
    logger.info(err.message);
    logger.info(err.stack);
    // Exit process with failure
    process.exit(1);
  }
};
