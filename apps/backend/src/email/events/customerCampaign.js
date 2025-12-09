module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/crm/campaign.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Promotion",
    template,
  };
};
