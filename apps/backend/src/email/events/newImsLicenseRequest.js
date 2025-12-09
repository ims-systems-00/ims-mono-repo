module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/licence/newLicenceRequest.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Licence request from customer",
    template,
  };
};
