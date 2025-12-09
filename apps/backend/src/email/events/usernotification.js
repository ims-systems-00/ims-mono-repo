module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/notification/usernotification.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS Notification",
    template,
  };
};
