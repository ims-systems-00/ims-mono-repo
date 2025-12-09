module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/onboardSuccess.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Welcome to ims systems",
    template,
  };
};
