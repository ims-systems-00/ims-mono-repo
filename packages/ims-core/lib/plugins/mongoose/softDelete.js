/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const softDeletePlugin = (schema) => {
  schema.add({
    deleteMarker: {
      status: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
      dateScheduled: {
        type: Date,
        default: null,
      },
    },
  });
  async function _excludeSoftDeletedHook(next) {
    if (
      this.getFilter().deleteMarker?.status ||
      this.getFilter()["deleteMarker.status"]
    ) {
      return next();
    }
    this.setQuery({ ...this.getFilter(), "deleteMarker.status": false });
    next();
  }
  let typesFindQueryMiddleware = ["count", "countDocuments", "find"];
  typesFindQueryMiddleware.forEach((type) =>
    schema.pre(type, _excludeSoftDeletedHook)
  );

  schema.static("softDelete", async function (query, options) {
    const templates = await this.find(query);
    if (!templates) {
      return Error("Element not found");
    }
    let deleted = 0;
    for (const template of templates) {
      if (!template.deleteMarker?.status) {
        template.deleteMarker.status = true;
        template.deleteMarker.deletedAt = new Date();
        template.deleteMarker.dateScheduled = new Date();
        await template
          .save(options)
          .then(() => deleted++)
          .catch((e) => {
            throw new Error(e.name + " " + e.message);
          });
      }
    }
    return { deleted };
  });

  schema.static("restore", async function (query) {
    const updatedQuery = {
      ...query,
      "deleteMarker.status": true,
    };
    const deletedTemplates = await this.find(updatedQuery);
    if (!deletedTemplates) {
      return Error("Element not found");
    }
    let restored = 0;
    for (const deletedTemplate of deletedTemplates) {
      if (deletedTemplate.deleteMarker?.status) {
        deletedTemplate.deleteMarker.status = false;
        deletedTemplate.deleteMarker.deletedAt = null;
        deletedTemplate.deleteMarker.dateScheduled = null;
        await deletedTemplate
          .save()
          .then(() => restored++)
          .catch((e) => {
            throw new Error(e.name + " " + e.message);
          });
      }
    }
    return { restored };
  });
};
module.exports = { softDeletePlugin };
