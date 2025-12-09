module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/cqc/cqcSafeguarding.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "CQC Safe guarding",
    template,
  };
};
