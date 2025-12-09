require("dotenv").config();
const { connectDataBase } = require("../src/config/databaseManager");
const fs = require("fs");
const { models } = require("../src/models");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
async function importValidationGenerator(schemaPath = "./file.js") {
  let destinationDir = "/../src/services/dataImport/validations";
  /**
   * connect all the databases this piece of code will be removed as
   * we bing in schema import feature from models repository
   */
  await connectDataBase();
  let expectedFilePaths = Object.keys(models).map((model) => `${model}.json`);
  /**
   * clean up unnecessary files...
   */
  let jsonDirectory = __dirname + destinationDir + "/json";
  fs.readdir(jsonDirectory, (err, files) => {
    if (err) return logger.info(err);
    files.forEach((file) => {
      if (!expectedFilePaths.includes(file))
        fs.unlinkSync(jsonDirectory + `/${file}`);
    });
  });
  /**
   * read the validation jsons, check for updates and make
   * amendments where it's required.
   */
  for (let modelName of Object.keys(models)) {
    let model = models[modelName];
    let validationPath = __dirname + destinationDir + `/json/${modelName}.json`;
    const validation = fs.existsSync(validationPath)
      ? require(validationPath)
      : {};
    model = model?.({});
    let schemaPaths = {};
    for (let schemaPath in model?.schema?.paths) {
      let schemaPathInfo = model.schema.paths[schemaPath];
      let accessKey = `${modelName}::${schemaPath}`;
      if (validation[accessKey]) {
        /**
         * if already exists in the validation rules, don't add this.
         * let the programmer decide the validation rules for that path.
         */
        schemaPaths[accessKey] = validation[accessKey];
      } else if (schemaPathInfo?.options?._ims_meta_info?.isClientImportable) {
        /**
         * if it doesn't exist check if the path is an client exportable path.
         * if so add a default validation so programmer can change it latter according to needs.
         */
        schemaPaths[
          accessKey
        ] = `Joi.any().label("${schemaPathInfo?.options?.alias}")`;
      }
    }
    const generatedFilePath =
      __dirname + destinationDir + `/json/${modelName}.json`;
    fs.writeFile(generatedFilePath, JSON.stringify(schemaPaths), () => {
      logger.info("JSON File handled");
    });
  }
  /**
   * read the jsons and generate the validations...
   */
  fs.readdir(jsonDirectory, (err, files) => {
    if (err) return logger.info(err);
    files.forEach((file) => {
      const splitedName = file.split(".");
      const fileName = splitedName.slice(0, splitedName.length - 1).join(".");
      const validationRules = require(jsonDirectory + `/${file}`);
      const generatedFilePath =
        __dirname + destinationDir + `/js/${fileName}.js`;
      let rules = Object.keys(validationRules).map((key) => {
        let path = key.split("::")[1];
        return `'${path}':${validationRules[key]}`;
      });
      fs.writeFile(
        generatedFilePath,
        "/**\n" +
          "* CAUTION: This is a generated file, please do not touch or amend any validation rules.\n" +
          "* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.\n" +
          "*/\n" +
          "let Joi = require('joi');\n" +
          `let rules = {\n\t${rules.join(",\n\t")}\n}\n` +
          "exports.rules = rules",
        () => {
          logger.info("JS File handled");
        }
      );
    });
  });
  fs.writeFile(__dirname + destinationDir + "/README.md", "", () => {
    logger.info("Readme file updated");
  });
}
importValidationGenerator();
