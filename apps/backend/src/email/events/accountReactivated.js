module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/accountReactivated.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Account Reactivated – Thank You for Your Prompt Action",
    template,
  };
};
