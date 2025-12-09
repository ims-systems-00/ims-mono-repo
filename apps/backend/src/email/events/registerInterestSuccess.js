module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/registerInterestSuccess.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Carbo-Calc Interest Registered Successfully.",
    template,
  };
};
