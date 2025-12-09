const { models } = require("../../models");
const DataImportService = require("../../services/dataImport/dataImport");
const Trigger = require("../../services/triggers");
const { asynchronously } = require("../../services/utility");
const { msToTime } = require("../../helpers/msToTime");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let model = models[job.data.module];
  model = model?.(connection);
  if (!model) return;
  let dataImportService = new DataImportService(connection);
  let schema = dataImportService.getSchema(job.data.module);
  let { castTo } = require("../../helpers/typeCasting")({
    dateFormat: job?.data?.dateFormat,
  });
  let dataSet = job?.data?.dataSet?.map((data) => {
    let preparedData = {};
    Object.keys(job?.data?.dataMap).forEach((key) => {
      let fieldProps = schema.find((item) => item.path === key);
      let value =
        fieldProps.isBusinessUnitController || fieldProps.isOwnerShipControler
          ? job?.data?.dataMap[key]
          : data[job?.data?.dataMap[key]];
      preparedData[key] = castTo(fieldProps.type)(value);
    });
    return preparedData;
  });
  let batchSize = 250;
  let [insertionError, insertedResult] = [null, {}];
  let startTime = new Date();
  for (let i = 0; i < dataSet.length; i += batchSize) {
    logger.info(`"bacth ", ${i}, " started"`);
    let currentSet = dataSet.slice(i, i + batchSize);
    [insertionError, insertedResult] = await asynchronously(
      dataImportService.importDataSet(job?.data?.module, currentSet)
    );
    if (insertionError) {
      logger.error("insertion error occured", { insertionError });
      logger.info(i, "documents were imported");
      return;
    }
    logger.info("documents were imported", {
      total: i + insertedResult.length,
    });
  }
  let duration = msToTime(new Date() - startTime);
  let durationString = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
  logger.info(
    `${dataSet.length},
    "documents were imported" + " in " + ${durationString}`
  );
  let trigger = new Trigger(connection);
  mainChannel.topic(SERVER_EVENTS_BUS.DATA_IMPORT_COMPLETE_EVENT).emit({
    accessControl: connection,
    startTime,
    durationString,
    user: job?.data?.importer,
  });
  // trigger.sendNotification("dataImportCompleteEvent", {
  //   startTime,
  //   durationString,
  //   user: job?.data?.importer,
  // });
};
exports.completeAction = async (job) => {};
