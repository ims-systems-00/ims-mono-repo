module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/accessControl/emailVerification.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Verify your account",
    template,
  };
};
