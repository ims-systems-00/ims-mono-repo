require("dotenv").config();
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { initialize } = require("./initIsoModule");

const { models } = require("../src/models");
const { connectDataBase } = require("../src/config/databaseManager");

const AVAILABLE_COMPLIANCE_TOOLS = [
  IMS_SERVICES.DSPTNHS,
  IMS_SERVICES.ISO27001,
  IMS_SERVICES.ISO27001_2022,
  IMS_SERVICES.ISO27001_2022_ANNEX_A,
  IMS_SERVICES.ISO27002,
  IMS_SERVICES.ISO9001,
  IMS_SERVICES.ISO45001,
  IMS_SERVICES.ISO20000,
  IMS_SERVICES.BS9997,
  IMS_SERVICES.ISO14001,
  IMS_SERVICES.ISO15686_5,
  IMS_SERVICES.ESG_ENVIRONMENTAL,
  IMS_SERVICES.ESG_SOCIAL,
  IMS_SERVICES.ESG_GOVERNANCE,
  IMS_SERVICES.BUILDING_SAFETY_ACT,

];

(async function () {
  try {
    await connectDataBase();
    for (let complianceToolName of AVAILABLE_COMPLIANCE_TOOLS) {
      let newControls = await initialize[complianceToolName]();
      console.log("newControls", newControls);
      const Controls = models.compliancecontrols({});
      const existingTool = await Controls.findOne({ name: complianceToolName });
      if (existingTool) {
        logger.info(complianceToolName + " already exists. syncing now... ");
        for (let _control of newControls) {
          const control = await Controls.findOneAndUpdate(
            {
              name: complianceToolName,
              clause: _control.clause,
            },
            {
              title: _control.title,
              description: _control.description,
              moreInfo: _control.moreInfo,
              annex: _control.annex,
            }
          );
          logger.info(`updated, ${control?.clause}`);
        }
      } else {
        logger.info(complianceToolName + " does not exist. creating new... ");
        for (let _control of newControls) {
          let control = await Controls.create({
            name: complianceToolName,
            clause: _control.clause,
            title: _control.title,
            description: _control.description,
            annex: _control.annex,
            isLocked: _control.isLocked,
            parentClause: _control.parentControl,
            childrenClauses: _control.childrenControls,
            moreInfo: _control.moreInfo,
          });
          logger.info(`created, ${control?.clause}`);
        }
      }
    }
  } catch (err) {
    logger.error("error syncing tools: ", err);
  }
  process.exit(0);
})();
