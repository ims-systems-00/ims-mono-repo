module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/crm/invoice.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "New invoice",
    template,
  };
};
