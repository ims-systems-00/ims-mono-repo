const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { APIError } = require("../helpers/errors/apiError");
const imsProject = require("../services/imsProjects/imsProject");

const checkTimePeriod = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { startDate, endDate } = req.body;

    // If neither startDate nor endDate is provided, proceed to the next middleware
    if (!startDate && !endDate) {
      return next();
    }
    const imsProject = await imsProjectService.getImsProject({
      _id: req.params.projectId,
    });

    if (
      startDate &&
      (new Date(startDate) < new Date(imsProject.startDate) ||
        new Date(startDate) > new Date(imsProject.endDate))
    ) {
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "startDate must be within the project time period."
      );
    }

    if (
      endDate &&
      (new Date(endDate) < new Date(imsProject.startDate) ||
        new Date(endDate) > new Date(imsProject.endDate))
    ) {
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "endDate must be within the project time period."
      );
    }

    // If all checks pass, proceed to the next middleware
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkTimePeriod;
