const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const imsProject = await imsProjectService.createImsProject({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
      createdBy: req.accessControl?.user?._id,
    });
    return res.status(StatusCodes.OK).json({
      message: "New project added successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const imsProject = await imsProjectService.getImsProject({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "Project retrived.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};
exports.getImsProjectGantt = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    let { page, size } = req.query;
    const options = { page, limit: size };
    const results = await imsProjectService.getImsProjectGantt(
      {
        imsProjectId: id,
      },
      options
    );

    res.status(StatusCodes.OK).json({
      message: "Project gantt retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectGantt: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const imsProject = await imsProjectService.updateImsProject(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "Project information updated.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["title", "description"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await imsProjectService.listImsProject(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Project retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjects: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const imsProject = await imsProjectService.softRemoveImsProject(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Project moved to trash.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const imsProject = await imsProjectService.restoreImsProject(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "iMS Project restored.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProject = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const imsProject = await imsProjectService.hardRemoveImsProject(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "iMS Project removed.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.loadAnalytics = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const imsProjectAnalytics = await imsProjectService.loadAnalytics(id);
    return res.status(StatusCodes.OK).json({
      message: "iMS Project analytics retrived.",
      imsProjectAnalytics,
    });
  } catch (error) {
    next(error);
  }
};

exports.dashboard = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const imsProjectDashboard = await imsProjectService.dashboard();
    return res.status(StatusCodes.OK).json({
      message: "iMS Project dashboard analytics retrived.",
      imsProjectDashboard,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCustomField = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const imsProject = await imsProjectService.createCustomField(id, {
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Custom field added into ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.addSection = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const imsProject = await imsProjectService.addSection(id, {
      ...req.body,
    });
    return res.status(StatusCodes.OK).json({
      message: "Section added into ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.addCustomFieldToSection = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id, sectionId } = req.params;
    const imsProject = await imsProjectService.addCustomFieldToSection(
      id,
      sectionId,
      {
        ...req.body,
      }
    );
    return res.status(StatusCodes.OK).json({
      message: "Custom field added into ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSection = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id, sectionId } = req.params;
    const imsProject = await imsProjectService.deleteSection(id, sectionId);
    return res.status(StatusCodes.OK).json({
      message: "Section delete from ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteCustomField = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id, fieldId } = req.params;
    const imsProject = await imsProjectService.deleteCustomField(id, fieldId);
    return res.status(StatusCodes.OK).json({
      message: "Custom field delete from ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.reorderSection = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const { sectionId, targetSectionId } = req.body;
    const imsProject = await imsProjectService.reorderSection(id, {
      sectionId,
      targetSectionId,
    });

    return res.status(StatusCodes.OK).json({
      message: "Section reordered successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.reorderCustomField = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id, sectionId } = req.params;
    const { customFieldId, targetFieldId } = req.body;
    const imsProject = await imsProjectService.reorderCustomField(id, {
      sectionId,
      customFieldId,
      targetFieldId,
    });

    return res.status(StatusCodes.OK).json({
      message: "Custom field reordered successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.createWorkPackageStatus = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id } = req.params;
    const imsProject = await imsProjectService.createWorkPackageStatus(id, {
      ...req.body,
    });
    return res.status(StatusCodes.OK).json({
      message: "Work package status added into ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkPackageStatus = async (req, res, next) => {
  let imsProjectService = new imsProject.ImsProject(req.accessControl);
  try {
    const { id, workPackageStatusId } = req.params;
    const imsProject = await imsProjectService.deleteWorkPackageStatus(
      id,
      workPackageStatusId
    );
    return res.status(StatusCodes.OK).json({
      message: "Work package status delete from ims project successfully.",
      imsProject,
    });
  } catch (error) {
    next(error);
  }
};
