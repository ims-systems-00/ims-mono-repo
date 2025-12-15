const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");
const CacheControl = require("../../cache/cacheControll");
class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Tasks = models.tasks(connection);
    this.taskCache = new CacheControl({
      cacheClient: 'redis',
      prefix: 'tasks',
      expireInSeconds: 600
    })
    this.Users = models.users(connection);
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.fileHandler = new FileHandlerService(connection);
  }
  _isComplete(task) {
    return task.completed?.status === "Complete";
  }
}
exports.Manager = Manager;
