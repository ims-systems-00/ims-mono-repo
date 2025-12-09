module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/accessControl/txnEmailInvitation.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS Invitation",
    template,
  };
};
