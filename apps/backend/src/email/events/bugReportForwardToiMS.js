module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/bugReports/bugReportForwardToiMS.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "New Bug report from customer",
    template,
  };
};
