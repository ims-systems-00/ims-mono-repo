module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsProject/newProjectCreated.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "New Project Created",
    template,
  };
};
