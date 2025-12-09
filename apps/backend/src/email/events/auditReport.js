module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/audit/report.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Audit report from iMS",
    template,
  };
};
