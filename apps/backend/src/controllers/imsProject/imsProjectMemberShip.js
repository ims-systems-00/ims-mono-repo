const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    const { projectId } = req.params;
    const imsProjectMemberShip =
      await imsProjectMemberShipService.createImsProjectMemberShip({
        ...req.body,
        imsProjectId: projectId,
        organization: req.accessControl?.user?.organizationId,
        createdBy: req.accessControl?.user?._id,
      });
    return res.status(StatusCodes.OK).json({
      message: "Member addded to project successfully.",
      imsProjectMemberShip,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    const { id, projectId } = req.params;
    const imsProjectMemberShip =
      await imsProjectMemberShipService.getImsProjectMemberShip({
        _id: id,
        imsProjectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Project membership retrived.",
      imsProjectMemberShip,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    const { projectId, id } = req.params;
    const imsProjectMemberShip =
      await imsProjectMemberShipService.updateImsProjectMemberShip(id, {
        ...req.body,
        projectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "iMS Project membership information updated.",
      imsProjectMemberShip,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = {
      ...filter,
      imsProjectId: new mongoose.Types.ObjectId(req.params.projectId),
    };
    const results = await imsProjectMemberShipService.listImsProjectMemberShip(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project memberships retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectMemberShips: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    const imsProjectMemberShip =
      await imsProjectMemberShipService.softRemoveImsProjectMemberShip(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project membership moved to trash.",
      imsProjectMemberShip,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    const imsProjectMemberShip =
      await imsProjectMemberShipService.restoreImsProjectMemberShip(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project membership restored.",
      imsProjectMemberShip,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectMemberShip = async (req, res, next) => {
  let imsProjectMemberShipService = new imsProject.ImsProjectMemberShip(
    req.accessControl
  );
  try {
    const imsProjectMemberShip =
      await imsProjectMemberShipService.hardRemoveImsProjectMemberShip(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "Member removed from project successfully.",
      imsProjectMemberShip,
    });
  } catch (error) {
    next(error);
  }
};
