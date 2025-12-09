module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/cqc/complaintInvestigation.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Complaint investigation",
    template,
  };
};
