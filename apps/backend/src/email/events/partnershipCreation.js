module.exports = async (config) => {
    let template = await require("../../helpers/template").createTemplate({
      view: "emailTemplates/accessControl/partnershipCreation.ejs",
      templateOptions: config.payload,
    });
    return {
      subject: config.subject || "Welcome to iMS Partnership programme",
      template,
    };
  };
  