const Joi = require("joi");
const { APIError } = require("../../helpers/errors/apiError");
const RegisterPublicInterestModel = require("../../models/mongodb/system/registerPublicInterest/registerPublicInterest");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sendMail } = require("../../email/sendMail");

// Define Joi schema for request body validation
const schema = Joi.object({
  name: Joi.string().max(20).required().label("Name"),
  email: Joi.string().max(50).email().required().label("Email"),
  companyName: Joi.string().max(30).required().label("Company Name"),
  product: Joi.string().required().label("Product"),
});

exports.createRegisterPublicInterest = async (req, res, next) => {
  let RegisterPublicInterest = RegisterPublicInterestModel(req.accessControl);
  try {
    // Validate request body against Joi schema
    const { error, value } = schema.validate(req.body);
    if (error) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }

    // Destructure validated data
    let { name, email, companyName, product } = value;
    email = email.toLowerCase();

    // Check if email is already registered
    let user = await RegisterPublicInterest.findOne({ email });
    if (user) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "An email is already registered."
      );
    }
    let newRegisterPublicInterest = new RegisterPublicInterest({
      name,
      email,
      companyName,
      product,
    });
    newRegisterPublicInterest = await newRegisterPublicInterest.save();
    if (product === "carbon-calculator")
      await sendMail("register-interest-success", email, {});
    // Send success response
    res.status(StatusCodes.CREATED).json({
      message: "Interest registered successfully",
      registerPublicInterest: newRegisterPublicInterest,
    });
  } catch (error) {
    next(error);
  }
};
