module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/accountPastDueAlert.ejs",
    templateOptions: config.payload,
  });
  return {
    subject:
      config.subject || "Urgent: Action Required to Prevent Service Disruption",
    template,
  };
};
