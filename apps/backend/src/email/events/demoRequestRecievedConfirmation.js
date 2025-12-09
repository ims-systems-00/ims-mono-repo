module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/demoRequestRecievedConfirmation.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS Systems Information",
    template,
  };
};
