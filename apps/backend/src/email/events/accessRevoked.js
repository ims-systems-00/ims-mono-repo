module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/accessControl/accessRevoked.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Access revoked from iMS",
    template,
  };
};
