module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/systemAlerts/passwordChanged.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Password has been changed",
    template,
  };
};
