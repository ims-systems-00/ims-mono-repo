module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/accessControl/removedFromBu.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Membership removed from Business Unit",
    template,
  };
};
