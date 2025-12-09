const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.Assets = models.assets(connection);
    this.fileHandler = new FileHandlerService(connection);
  }
  _isDisposedAsset(asset) {
    return asset?.assetStatus === "Retired";
  }
}
exports.Manager = Manager;
