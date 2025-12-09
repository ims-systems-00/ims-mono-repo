module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/getstarted.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS great news (New config request)",
    template,
  };
};
