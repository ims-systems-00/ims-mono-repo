const Joi = require("joi")
const emailTemplate = Joi.string().max(50).email().required().label("Email");
const passwordTemplate = Joi.string().min(8).max(50).required().label("Password");

const register = Joi.object({
    firstName: Joi.string().max(20).required().label("First Name"),
    lastName: Joi.string().max(20).required().label("Last Name"),
    email: emailTemplate,
    password: passwordTemplate,
    industry: Joi.string(),
    jobTitle: Joi.string().default(''),
    purposeOfUse: Joi.array().items(Joi.string()).label(" Purpose of Use"),
})

const login = Joi.object({
    email: emailTemplate,
    password: passwordTemplate,
})

const requestRecovery = Joi.object({
    email: emailTemplate,
})

const verifyRecovery = Joi.object({
    password: passwordTemplate,
})

const resendVerification = Joi.object({
    adminId: Joi.string().required().label("Admin Id"),
})

module.exports = {
    register,
    login,
    requestRecovery,
    verifyRecovery,
    resendVerification,
}