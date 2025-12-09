const ValidationService = require("../services/validation");

const validate =
  (validationObjectName) => (schema) => async (req, res, next) => {
    const validationService = new ValidationService(req.accessControl);
    const errors = validationService.validate(
      schema,
      req[validationObjectName]
    );
    if (errors)
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    next();
  };
exports.validate = validate;
