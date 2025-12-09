module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/documentManagement/sendSignedCopyToSignee.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Document signed",
    template,
  };
};
