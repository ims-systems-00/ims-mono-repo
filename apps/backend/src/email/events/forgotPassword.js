module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/accessControl/forgotPassword.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Reset iMS password",
    template,
  };
};
