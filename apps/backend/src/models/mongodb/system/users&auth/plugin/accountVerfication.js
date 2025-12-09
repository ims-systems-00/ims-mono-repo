/**
 * this plugin allowes soft delete feature for  data-models
 * @param {import("mongoose").Schema} schema
 */
const accountVerification = (schema) => {
  async function _excludeUnverifiedUsersHook(next) {
    if (
      this.op === "find" &&
      (this.getFilter().emailVerified?.status ||
        this.getFilter()["emailVerified.status"])
    ) {
      return next();
    }
    this.setQuery({ ...this.getFilter(), "emailVerified.status": "varified" });
    next();
  }
  let typesFindQueryMiddleware = ["count", "countDocuments", "find"];
  typesFindQueryMiddleware.forEach((type) =>
    schema.pre(type, _excludeUnverifiedUsersHook)
  );

  schema.static("markAsVerified", async function (query, options) {
    // const templates = await this.find(query);
    // if (!templates) {
    //   return Error("Element not found");
    // }
    // let verified = 0;
    // for (const template of templates) {
    //   if (template.emailVerified?.status !== "varified") {
    //     template.emailVerified.status = "varified";
    //     template.emailVerified.on = Date.now();
    //     await template
    //       .save(options)
    //       .then(() => verified++)
    //       .catch((e) => {
    //         throw new Error(e.name + " " + e.message);
    //       });
    //   }
    // }
    // return { verified };
  });
};
module.exports = { accountVerification };
