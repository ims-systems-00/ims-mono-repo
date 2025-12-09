const readXlsxFile = require("read-excel-file/node");
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
const schema = {
  clause: {
    prop: "Clause",
    type: String,
  },
  title: {
    prop: "Title",
    type: String,
  },
  description: {
    prop: "Description",
    type: String,
  },
  annex: {
    prop: "Annex",
    type: String,
  },
  note: {
    prop: "Note",
    type: String,
  },
  type: {
    prop: "Type",
    type: String,
  },
  applicable_modules_label: {
    prop: "Applicable_modules_label",
    type: String,
  },
  applicable_modules: {
    prop: "Applicable_modules",
    type: String,
  },
  kloe: {
    prop: "KLOE",
    type: String,
  },
  applies_to: {
    prop: "Applies_to",
    type: String,
  },
};
const _readAlogrithom_1 = (rows, module = []) => {
  rows.map((row) => {
    let {
      Clause,
      Title,
      Description,
      Annex,
      Note,
      Type,
      Applies_to,
      Applicable_modules,
      Applicable_modules_label,
    } = row;
    let clause = Clause;
    let title = Title;
    let description = Description;
    let annex = Annex;
    let appliesTo = Applies_to;
    let applicableModules = Applicable_modules?.split(",") || [];
    let moreInfo = {
      appliesTo,
      note: Note,
      type: Type,
      applicableModules,
      applicableModulesLabel: Applicable_modules_label,
    };
    if (!clause) {
      title = title.toString().trim();
      let currentDescription = module[module.length - 1].description;
      module[module.length - 1].description = currentDescription
        ? currentDescription.concat(title)
        : title;
    } else {
      clause = clause.toString().trim();
      title = title.toString().trim();
      regex = /^[\S]+[.]/;
      if (regex.test(clause)) {
        let parentClause = regex.exec(clause);
        parentClause = parentClause[0].slice(0, parentClause[0].length - 1);
        let parentControl = module.find(
          (isoModule) => isoModule.clause === parentClause
        );
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
    let { Clause, Title, Description, Annex } = row;
    let clause = Clause;
    let title = Title;
    let description = Description;
    let annex = Annex;
    if (clause) {
      clause = clause.toString().trim();
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
const _createToolRefrence = async (path = "", schema, algo = "r_1") => {
  try {
    let { rows } = await readXlsxFile(path, { schema });
    if (algo === "r_1") return _readAlogrithom_1(rows);
    if (algo === "r_2") return _readAlogrithom_2(rows);
    return;
  } catch (err) {
    throw err;
  }
};
const isoModules20000initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso20000.xlsx"), schema);
const isoModules27001initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso27001.xlsx"), schema);
const isoModules27001_2022Initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso27001-2022.xlsx"), schema);
const isoModules27001_2022AnnexAInitialize = () =>
  _createToolRefrence(
    (path = "./src/initialize/iso27001-2022-annex-a.xlsx"),
    schema
  );
const isoModules27002initialize = () =>
  _createToolRefrence(
    (path = "./src/initialize/iso27002.xlsx"),
    schema,
    (algo = "r_2")
  );
const isoModules9001initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso9001.xlsx"), schema);
const isoModules45001initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso45001.xlsx"), schema);
const isoModules14001Initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso14001.xlsx"), schema);
const isoModules15686_5Initialize = () =>
  _createToolRefrence((path = "./src/initialize/iso15686-5.xlsx"), schema);
const dsptNhsInitialize = () =>
  _createToolRefrence(
    (path = "./src/initialize/dspt-nhs.xlsx"),
    schema,
    (algo = "r_2")
  );
const cqcToolInitialize = () =>
  _createToolRefrence((path = "./src/initialize/cqc.xlsx"), schema);
const bs9997Initialize = () =>
  _createToolRefrence((path = "./src/initialize/bs9997.xlsx"), schema);
const esgToolkitEnviromentalinitialize = () =>
  _createToolRefrence(
    (path = "./src/initialize/esg-toolkit-environmental.xlsx"),
    schema
  );
const esgToolkitSocialinitialize = () =>
  _createToolRefrence(
    (path = "./src/initialize/esg-toolkit-social.xlsx"),
    schema
  );
const esgToolkitGovernanceinitialize = () =>
  _createToolRefrence(
    (path = "./src/initialize/esg-toolkit-governance.xlsx"),
    schema
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
  },
};
