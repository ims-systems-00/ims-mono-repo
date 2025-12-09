module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/newCustomerSignUp.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "New customer signed up",
    template,
  };
};
