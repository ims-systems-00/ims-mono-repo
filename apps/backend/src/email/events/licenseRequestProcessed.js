module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/licence/licenseRequestProcessed.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "License Request Processed Successfully",
    template,
  };
};
