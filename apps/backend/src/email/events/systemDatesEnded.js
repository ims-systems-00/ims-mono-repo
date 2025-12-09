module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/systemAlerts/systemDatesEnded.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "System-dates ended!",
    template,
  };
};
