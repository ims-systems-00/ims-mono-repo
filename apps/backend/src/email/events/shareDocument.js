module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/documentManagement/shareDocument.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Document share",
    template,
  };
};
