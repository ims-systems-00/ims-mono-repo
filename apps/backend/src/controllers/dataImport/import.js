const DataImportService = require("../../services/dataImport/dataImport");
const Trigger = require("../../services/triggers");
const dataImportQueue = require("../../schedules/queues/dataImport.queue");
const path = require("path");
const { fork } = require("child_process");
const dataimportListeners = require("../../socket/listeners/dataimport.listener");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const startImport = (req, res, next) => {
  try {
    let trigger = new Trigger(req.accessControl);
    let { module, dataMap, dateFormat, dataSet } = req.body;
    let dataImportService = new DataImportService(req.accessControl);
    let validation = dataImportService.validateDataSet({
      module,
      dataMap,
      dataSet,
      dateFormat,
    });
    if (!validation.success)
      return res.status(400).json({
        message: "Validation has failed. Please review your data.",
        validation,
      });
    dataImportQueue.produce({
      importer: req.accessControl.user,
      accessControl: req.accessControl,
      module,
      dataMap,
      dataSet,
      dateFormat,
    });
    mainChannel.topic(SERVER_EVENTS_BUS.DATA_IMPORT_INITIAL_EVENT).emit({
      accessControl: req.accessControl,
      module,
      user: req.accessControl.user,
    });
    // trigger.sendNotification("dataImportInitiateEvent", {
    //   module,
    //   user: req.accessControl.user,
    // });
    res.status(200).json({
      message:
        "We recieved your data. You will be notified once import is complete",
    });
  } catch (err) {
    next(err);
  }
};
const validation = (req, res, next) => {
  let { module, dataMap, dateFormat, dataSet } = req.body;
  let process = fork(
    path.resolve(__dirname + "/../../subprocess/dataImportValidation.js")
  );
  process.send({
    accessControl: req.accessControl,
    module,
    dataMap,
    dataSet,
    dateFormat,
  });
  process.on("message", (data) => {
    if (data.message === "validation-end") {
      let validation = data?.result;
      res.status(200).json({
        message: "Validation successful.",
        validation,
      });
      process.kill(data?.pid);
    }
    if (data.message === "validation-progress") {
      dataimportListeners({
        ...data,
        user: req.accessControl.user,
      });
    }
  });
};
module.exports = {
  startImport,
  validation,
};
