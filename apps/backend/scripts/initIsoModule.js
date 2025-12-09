const fs = require("fs").promises;
const pathModule = require("path");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");

function Structure(
  clause,
  title,
  description = "",
  annex = "",
  parentControl = null,
  childrenControls = [],
  isLocked = true,
  moreInfo = {}
) {
  this.clause = clause;
  this.title = title;
  this.description = description;
  this.annex = annex;
  this.parentControl = parentControl;
  this.childrenControls = childrenControls;
  this.isLocked = isLocked;
  this.moreInfo = moreInfo;
}
// JSON files provide lowercase keys that match directly with variable names
const _readAlogrithom_1 = (rows, module = []) => {
  rows.map((row) => {
    // Safely extract fields with defaults for missing values
    let clause = row.clause || "";
    let title = row.title || "";
    let description = row.description || "";
    let annex = row.annex || "";
    let note = row.note || "";
    let type = row.type || "";
    let appliesTo = row.applies_to || "";
    let applicableModules = row.applicable_modules?.split(",") || [];
    let applicableModulesLabel = row.applicable_modules_label || "";

    let moreInfo = {
      appliesTo,
      note,
      type,
      applicableModules,
      applicableModulesLabel,
    };
    if (!clause) {
      if (title && module.length > 0) {
        title = String(title).trim();
        let currentDescription = module[module.length - 1].description;
        module[module.length - 1].description = currentDescription
          ? currentDescription.concat(title)
          : title;
      }
    } else {
      clause = String(clause).trim();
      title = String(title).trim();
      regex = /^[\S]+[.]/;
      if (regex.test(clause)) {
        let parentClause = regex.exec(clause);
        parentClause = parentClause[0].slice(0, parentClause[0].length - 1);
        let parentControl = module.find(
          (isoModule) => isoModule.clause === parentClause
        );
        if (parentControl) {
          let control = new Structure(
            clause,
            title,
            description,
            annex,
            parentControl.clause,
            [],
            false,
            moreInfo
          );
          parentControl.childrenControls.push(control.clause);
          parentControl.isLocked = true;
          module.push(control);
        } else {
          // Parent not found, add as root control to preserve data
          let control = new Structure(
            clause,
            title,
            description,
            annex,
            null,
            [],
            true,
            moreInfo
          );
          module.push(control);
        }
      } else {
        let control = new Structure(
          clause,
          title,
          description,
          annex,
          null,
          [],
          true,
          moreInfo
        );
        module.push(control);
      }
    }
  });
  return module;
};

const _readAlogrithom_2 = (rows, module = []) => {
  rows.map((row) => {
    let clause = row.clause || "";
    let title = row.title || "";
    let description = row.description || "";
    let annex = row.annex || "";
    if (clause) {
      clause = String(clause).trim();
      let control = new Structure(
        clause,
        title,
        description,
        annex,
        null,
        [],
        false,
        {}
      );
      module.push(control);
    }
  });
  return module;
};
const _createToolRefrence = async (inputPath = "", algo = "r_1") => {
  try {
    const absolutePath = pathModule.isAbsolute(inputPath)
      ? inputPath
      : pathModule.resolve(process.cwd(), inputPath);
    const fileContent = await fs.readFile(absolutePath, "utf8");
    const rows = JSON.parse(fileContent);
    if (algo == "r_1") return _readAlogrithom_1(rows);
    else if (algo == "r_2") return _readAlogrithom_2(rows);
  } catch (err) {
    throw err;
  }
};
const isoModules20000initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso20000.json");
const isoModules27001initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso27001.json");
const isoModules27001_2022Initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso27001-2022.json");
const isoModules27001_2022AnnexAInitialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso27001-2022-annex-a.json");
const isoModules27002initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso27002.json", "r_2");
const isoModules9001initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso9001.json");
const isoModules45001initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso45001.json");
const isoModules14001Initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso14001.json");
const isoModules15686_5Initialize = () =>
  _createToolRefrence("./scripts/data/compliance/iso15686-5.json");
const dsptNhsInitialize = () =>
  _createToolRefrence("./scripts/data/compliance/dspt-nhs.json", "r_2");
const cqcToolInitialize = () =>
  _createToolRefrence("./scripts/data/compliance/cqc.json");
const bs9997Initialize = () =>
  _createToolRefrence("./scripts/data/compliance/bs9997.json");
const esgToolkitEnviromentalinitialize = () =>
  _createToolRefrence(
    "./scripts/data/compliance/esg-toolkit-environmental.json"
  );
const esgToolkitSocialinitialize = () =>
  _createToolRefrence("./scripts/data/compliance/esg-toolkit-social.json");
const esgToolkitGovernanceinitialize = () =>
  _createToolRefrence("./scripts/data/compliance/esg-toolkit-governance.json");
const buildingSafetyActInitialize = () =>
  _createToolRefrence(
    "./scripts/data/compliance/building-safety-act.json",
    "r_2"
  );

module.exports = {
  initialize: {
    [IMS_SERVICES.ISO20000]: isoModules20000initialize,
    [IMS_SERVICES.ISO27001]: isoModules27001initialize,
    [IMS_SERVICES.ISO27001_2022]: isoModules27001_2022Initialize,
    [IMS_SERVICES.ISO27001_2022_ANNEX_A]: isoModules27001_2022AnnexAInitialize,
    [IMS_SERVICES.ISO27002]: isoModules27002initialize,
    [IMS_SERVICES.ISO9001]: isoModules9001initialize,
    [IMS_SERVICES.ISO45001]: isoModules45001initialize,
    [IMS_SERVICES.ISO14001]: isoModules14001Initialize,
    [IMS_SERVICES.ISO15686_5]: isoModules15686_5Initialize,
    [IMS_SERVICES.DSPTNHS]: dsptNhsInitialize,
    [IMS_SERVICES.CQC]: cqcToolInitialize,
    [IMS_SERVICES.BS9997]: bs9997Initialize,
    [IMS_SERVICES.ESG_ENVIRONMENTAL]: esgToolkitEnviromentalinitialize,
    [IMS_SERVICES.ESG_GOVERNANCE]: esgToolkitGovernanceinitialize,
    [IMS_SERVICES.ESG_SOCIAL]: esgToolkitSocialinitialize,
    [IMS_SERVICES.BUILDING_SAFETY_ACT]: buildingSafetyActInitialize,
  },
};
