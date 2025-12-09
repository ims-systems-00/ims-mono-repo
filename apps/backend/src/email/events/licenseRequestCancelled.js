module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/licence/licenseRequestCancelled.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Notice: License Request Cancellation",
    template,
  };
};
