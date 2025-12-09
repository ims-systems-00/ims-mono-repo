module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/licence/licenceRequestRecievedConfirmation.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Confirmation: Receipt of License Request",
    template,
  };
};
