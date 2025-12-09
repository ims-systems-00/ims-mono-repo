module.exports = async (config) => {
  let template = await require("../../helpers/template").createTemplate({
    view: "emailTemplates/imsSystems/booking.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "iMS great news (New demo booked)",
    template,
  };
};
