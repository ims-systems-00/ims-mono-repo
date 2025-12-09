const { models } = require("../models");
class MarkerService {
  constructor(connection, module) {
    if (!module) throw new Error("Module not specified. Can't compile model.");
    this.module = module;
    this.models = models;
    this.connection = connection;
  }
  _compileModel() {
    let model = this.models[this.module];
    model = model?.(this.connection);
    if (!model) throw new Error("No  models found for this module.");
    return model;
  }
  async markForDelete(query) {
    return this._compileModel().updateMany(query, {
      $set: { "deleteMarker.status": true },
    });
  }
  async markAsDelete(query) {
    return this._compileModel().updateMany(query, {
      $set: { "deleteMarker.status": true },
    });
  }
}
module.exports = MarkerService;
