const { KNOWN_HOSTS } = require("../helpers/knownHosts");
const Joi = require("../lib/validation");
const {
  defaultInjectedQueryValidations,
} = require("./templates/defaultInjectedQueryValidations");

const validKnownHosts = (function () {
  if (process.env.NODE_ENV === "production")
    return Object.values(KNOWN_HOSTS.PROD);
  if (process.env.NODE_ENV === "staging")
    return [
      ...Object.values(KNOWN_HOSTS.PROD),
      ...Object.values(KNOWN_HOSTS.STAGING),
      ...Object.values(KNOWN_HOSTS.DEV),
    ];
  if (process.env.NODE_ENV === "development")
    return [
      ...Object.values(KNOWN_HOSTS.STAGING),
      ...Object.values(KNOWN_HOSTS.DEV),
    ];
})();

const knowHostValidator = (value, helpers) => {
  const url = new URL(value);
  let parsedUrl = url.protocol + "//" + url.hostname;
  if (process.env.NODE_ENV !== "production" && url.hostname === "localhost")
    parsedUrl = parsedUrl + ":" + url.port;
  if (!validKnownHosts.includes(parsedUrl))
    return helpers.message(
      "Invalid URL. Allowed domains: " + validKnownHosts.join(",")
    );
  return value;
};

const authoriseQuery = Joi.object({
  redirect_uri: Joi.string()
    .uri()
    .custom(knowHostValidator)
    .required()
    .label("redirect_uri"),
  ...defaultInjectedQueryValidations,
});
const authCodeQuery = Joi.object({
  redirect_uri: Joi.string()
    .uri()
    .custom(knowHostValidator)
    .required()
    .label("redirect_uri"),
  ...defaultInjectedQueryValidations,
});
const signInBody = Joi.object({
  email: Joi.string().email().required().label("email"),
  password: Joi.string().min(8).max(35).required().label("password"),
  redirect_uri: Joi.string()
    .uri()
    .custom(knowHostValidator)
    .optional()
    .label("redirect_uri"),
});
module.exports = {
  authoriseQuery,
  signInBody,
  authCodeQuery,
};
