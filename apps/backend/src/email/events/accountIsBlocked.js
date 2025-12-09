module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/accountIsBlocked.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Urgent: Temporary Suspension of Your Account",
    template,
  };
};
