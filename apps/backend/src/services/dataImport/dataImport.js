const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../../models");
let ValidationService = require("../validation");
class DataImportService {
  constructor(connection) {
    this.connection = connection;
  }
  async importDataSet(module, data) {
    let model = models[module];
    model = model?.(this.connection);
    if (!model) return;
    console.log(
      data.map((d) => ({
        ...d,
        organization: this.connection?.user?.organizationId,
      }))
    );
    return model.insertMany(
      data.map((d) => ({
        ...d,
        organization: this.connection?.user?.organizationId,
      }))
    );
  }
  validateDataSet(
    { module, dataMap, dataSet, dateFormat },
    callback = () => {}
  ) {
    let validationService = new ValidationService(this.connection);
    let validationPath = `./validations/js/${module}.js`;
    let schema = this.getSchema(module);
    let { rules } = require(validationPath);
    let requiredChecks = schema.reduce((totalAbsent, currentField) => {
      if (currentField.isRequired) {
        return dataMap[currentField.path] ? totalAbsent : (totalAbsent += 1);
      }
      return totalAbsent;
    }, 0);
    if (requiredChecks) throw new Error("Required fields needs to be field in");
    let validationResult = Object.keys(dataMap).map((key) => {
      logger.info("validating for :", key);
      let fieldProps = schema.find((item) => item.path === key);
      let { castTo } = require("../../helpers/typeCasting")({
        dateFormat,
      });
      let rule = rules[key];
      if (!rule) return { message: "Rule doesn't exist" };
      let allErrorsForParticularColumn = dataSet
        .map((data, rowNumber) => {
          /**
           * first 1 is for array index offset and second 1 is for leaving
           * the column names rows
           */
          rowNumber += 2;
          let value =
            fieldProps.isBusinessUnitController ||
            fieldProps.isOwnerShipControler
              ? dataMap[key]
              : data[dataMap[key]];
          value = castTo(fieldProps.type)(value);
          let validationError = validationService.validate(rule, value);
          callback({ field: fieldProps.alias, rowNumber });
          if (validationError)
            return {
              message: `Error column '${
                dataMap[key]
              }' at row ${rowNumber}: ${Object.keys(validationError)
                .map((key) => validationError[key])
                .join(",")}`,
            };
          return null;
        })
        .reduce((errors, errorResponse) => {
          if (errorResponse) errors.push(errorResponse);
          return errors;
        }, []);
      return {
        name: fieldProps.alias,
        errors: allErrorsForParticularColumn,
        totalError: allErrorsForParticularColumn.length,
      };
    });
    let errorCount = validationResult.reduce(
      (foundError, currentKey) => (foundError += currentKey?.totalError),
      0
    );
    return {
      success: errorCount < 1,
      result: validationResult,
    };
  }
  getSchema(module) {
    let model = models[module];
    model = model?.(this.connection);
    let schema = [];
    for (let path in model?.schema?.paths) {
      let pathInfo = model.schema.paths[path];
      if (pathInfo?.options?._ims_meta_info?.isClientImportable)
        schema.push({
          alias: pathInfo?.options?.alias,
          path,
          type: pathInfo.instance?.toLowerCase(),
          isRequired: pathInfo?.isRequired ? true : false,
          ...pathInfo?.options?._ims_meta_info,
        });
    }
    return schema;
  }
}
module.exports = DataImportService;
