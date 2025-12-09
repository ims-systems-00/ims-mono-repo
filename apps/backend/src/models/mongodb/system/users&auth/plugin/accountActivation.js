/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const mongoose = require("mongoose");
const accountActivation = (schema) => {
  async function _excludeInactiveUsersHook(next) {
    if (this._mongooseOptions.populate) {
      // Skip the hook while population
      return;
    }
    if (
      this.getFilter().systemAccess?.status ||
      this.getFilter()["systemAccess.status"]
    ) {
      return next();
    }
    this.setQuery({ ...this.getFilter(), "systemAccess.status": "Active" });
    next();
  }
  let typesFindQueryMiddleware = ["count", "countDocuments", "find"];
  typesFindQueryMiddleware.forEach((type) =>
    schema.pre(type, _excludeInactiveUsersHook)
  );

  schema.static("deactivateAccess", async function (query, options) {
    // const templates = await this.find(query);
    // if (!templates) {
    //   return Error("Element not found");
    // }
    // let deactivated = 0;
    // for (const template of templates) {
    //   if (!template.systemAccess?.status) {
    //     template.systemAccess.status = "Blocked";
    //     await template
    //       .save(options)
    //       .then(() => deactivated++)
    //       .catch((e) => {
    //         throw new Error(e.name + " " + e.message);
    //       });
    //   }
    // }
    // return { deactivated };
  });

  schema.static("activateAccess", async function (query) {
    // const updatedQuery = {
    //   ...query,
    //   "systemAccess.status": "Blocked",
    // };
    // const deactivatedTemplates = await this.find(updatedQuery);
    // if (!deactivatedTemplates) {
    //   return Error("Element not found");
    // }
    // let restored = 0;
    // for (const deactivatedTemplate of deactivatedTemplates) {
    //   if (deactivatedTemplate.systemAccess?.status === "Blocked") {
    //     deactivatedTemplate.systemAccess.status = "Active";
    //     deactivatedTemplate.systemAccess.deletedAt = null;
    //     deactivatedTemplate.deleteMarker.dateScheduled = null;
    //     await deactivatedTemplate
    //       .save()
    //       .then(() => restored++)
    //       .catch((e) => {
    //         throw new Error(e.name + " " + e.message);
    //       });
    //   }
    // }
    // return { restored };
  });
};
module.exports = { accountActivation };
