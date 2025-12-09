const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
    req.accessControl
  );
  try {
    const { projectId } = req.params;
    const imsProjectMaterial =
      await imsprojectMaterialService.createImsProjectMaterial({
        ...req.body,
        imsProjectId: projectId,
        organization: req.accessControl?.user?.organizationId,
      });
    return res.status(StatusCodes.OK).json({
      message: "Material added successfully.",
      imsProjectMaterial,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
    req.accessControl
  );
  try {
    const { id, projectId } = req.params;
    const imsProjectMaterial =
      await imsprojectMaterialService.getImsProjectMaterial({
        _id: id,
        imsProjectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "Material retrived.",
      imsProjectMaterial,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
    req.accessControl
  );
  try {
    const { projectId, id } = req.params;
    const imsProjectMaterial =
      await imsprojectMaterialService.updateImsProjectMaterial(id, {
        ...req.body,
        projectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "Material updated.",
      imsProjectMaterial,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
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
    const results = await imsprojectMaterialService.listImsProjectMaterial(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Material retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectMaterials: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
    req.accessControl
  );
  try {
    const imsProjectMaterial =
      await imsprojectMaterialService.softRemoveImsProjectMaterial(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "Material moved to trash.",
      imsProjectMaterial,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
    req.accessControl
  );
  try {
    const imsProjectMaterial =
      await imsprojectMaterialService.restoreImsProjectMaterial(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Material restored.",
      imsProjectMaterial,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectMaterial = async (req, res, next) => {
  let imsprojectMaterialService = new imsProject.ImsProjectMaterial(
    req.accessControl
  );
  try {
    const imsProjectMaterial =
      await imsprojectMaterialService.hardRemoveImsProjectMaterial(
        req.params.id
      );
    return res.status(StatusCodes.OK).json({
      message: "Material removed.",
      imsProjectMaterial,
    });
  } catch (error) {
    next(error);
  }
};
