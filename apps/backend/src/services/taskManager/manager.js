const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");
class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Tasks = models.tasks(connection);
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
