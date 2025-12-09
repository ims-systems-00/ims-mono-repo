const mongoose = require("mongoose");
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.pre("save", function () {
    this.scope = this.scope?.toLowerCase();
    this.level1 = this.level1?.toLowerCase();
    this.combinedActivityReference =
      this.combinedActivityReference?.toLowerCase();
    this.uom = this.uom?.toLowerCase();
    this.ghgPerUnit = this.ghgPerUnit?.toLowerCase();
    this.sicCategory = this.sicCategory?.toLowerCase();
  });
  schema.pre("findOne", function () {
    let queryOverrides = { ...this.getFilter() };
    if (this.getFilter()?.scope)
      queryOverrides = {
        ...queryOverrides,
        scope: this.getFilter()?.scope?.toLowerCase(),
      };
    if (this.getFilter()?.level1) {
      let level1 = this.getFilter()?.level1;
      if (typeof level1 === "string") level1 = level1.toLowerCase();
      queryOverrides = {
        ...queryOverrides,
        level1: level1,
      };
    }
    if (this.getFilter()?.combinedActivityReference)
      queryOverrides = {
        ...queryOverrides,
        combinedActivityReference:
          this.getFilter()?.combinedActivityReference?.toLowerCase(),
      };
    if (this.getFilter()?.uom)
      queryOverrides = {
        ...queryOverrides,
        uom: this.getFilter()?.uom?.toLowerCase(),
      };
    if (this.getFilter()?.ghgPerUnit)
      queryOverrides = {
        ...queryOverrides,
        ghgPerUnit: this.getFilter()?.ghgPerUnit?.toLowerCase(),
      };
    if (this.getFilter()?.sicCategory)
      queryOverrides = {
        ...queryOverrides,
        sicCategory: this.getFilter()?.sicCategory?.toLowerCase(),
      };
    console.log(queryOverrides);
    this.setQuery(queryOverrides);
  });
};
