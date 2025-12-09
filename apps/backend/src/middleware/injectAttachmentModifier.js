const attachmentSchema = require("../validations/templates/attachments");
const ValidationService = require("../services/validation");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

const injectAttachmentModifierMetaData =
  (injectableFields = []) =>
  async (req, res, next) => {
    const _handleValidation = (data) => {
      const validationService = new ValidationService(req.accessControl);
      let errors = validationService.validate(attachmentSchema, data);
      if (errors)
        return res.status(400).json({
          message:
            "Injectable field must pass attachment meta data validation.",
          errors,
        });
    };
    const _inject = (data) => ({
      ...data,
      "modified.by": req.accessControl.user._id,
    });
    injectableFields = Array.isArray(injectableFields)
      ? injectableFields
      : [injectableFields];
    if (!req?.accessControl?.user?._id)
      return res
        .status(400)
        .json({ message: "User must have a valid session." });
    for (let field of injectableFields) {
      if (!req.body[field]) continue;
      // return res.status(400).json({
      //   message:
      //     "Request must contain the the specified field for injecting the modifier",
      // });
      logger.info("validating attachment for injection...", {
        field: req.body[field],
      });
      if (Array.isArray(req.body[field])) {
        req.body[field].forEach((data) => {
          _handleValidation(data);
        });
        logger.info("validating complete. starting injection...");
        req.body[field] = req.body[field].map((attachment) =>
          _inject(attachment)
        );
      } else {
        _handleValidation(req.body[field]);
        req.body[field] = _inject(req.body[field]);
      }
    }
    next();
  };
module.exports = { injectAttachmentModifierMetaData };
