module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/accessControl/acceptPartnership.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS Partnership confirmation",
    template,
  };
};
