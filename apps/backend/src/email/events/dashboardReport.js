module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/dashboard/report.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Dashboard report from iMS",
    template,
  };
};
