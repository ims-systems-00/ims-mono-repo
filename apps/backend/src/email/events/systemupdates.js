module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/systemUpdates.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS Systems Information",
    template,
  };
};
