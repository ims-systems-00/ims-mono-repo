const mongoose = require("mongoose");
/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const sourceDeletePlugin =
  (sourceName, modules = []) =>
  (schema) => {
    /**
     * modules are the related module that contains this datamodel
     * as source. so we are performing a cascade delete here.
     * Example : if task manager data model has a source risk that
     * links toa risk. we then pass the task manager model in modules
     * array and "risk" is the source name all matching tasks with
     * this risk will be deleted.
     */
    async function _cleanRelatedDataHook() {
      if (this.getQuery()["_id"]) {
        await Promise.all(
          modules.map((module) =>
            module.deleteMany({
              "source.moduleType": sourceName,
              "source.module": this.getQuery()["_id"],
            })
          )
        );
      }
    }
    schema.post("deleteOne", _cleanRelatedDataHook);
    schema.post("deleteMany", _cleanRelatedDataHook);
  };
module.exports = { sourceDeletePlugin };
