module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/bugReports/bugReportRecievedConfirmation.ejs",
    templateOptions: config.payload,
  });
  return {
    subject:
      config.subject || "Confirmation - Your Bug Report has Been Recorded",
    template,
  };
};
