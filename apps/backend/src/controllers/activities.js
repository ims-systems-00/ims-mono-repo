const ActivityService = require("../services/activity");
const { Filters } = require("../services/utility");
exports.createActivity = async (req, res, next) => {
  let activityService = new ActivityService(req.accessControl);
  try {
    let activity = await activityService.createActivity({
      isAutomated: false,
      createdBy: req.accessControl?.user?._id,
      organization: req.accessControl.user.organizationId,
      ...req.body,
    });
    res
      .status(200)
      .json({ message: "Activity added successfully.", activity });
    res.locals.formatedTextTracking = {
      bodyFields: {
        name: "value",
        alias: "comment",
      },
      prevData: activity,
    };
    next();
  } catch (error) {
    next(error);
  }
};
exports.getActivities = async (req, res, next) => {
  let activityService = new ActivityService(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    let result = await activityService.listActivitiesByOrg(query, options);
    res.status(200).json({
      message: "Activities retrived successfully.",
      activities: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
exports.getActivity = async (req, res, next) => {
  let activityService = new ActivityService(req.accessControl);
  let { id } = req.params;
  try {
    let activity = await activityService.getAcivity(id);
    return res
      .status(200)
      .json({ message: "Activity retrived successfully.", activity });
  } catch (error) {
    next(error);
  }
};
exports.updateActivity = async (req, res, next) => {
  let activityService = new ActivityService(req.accessControl);
  let { id } = req.params;
  try {
    let prevActivity = await activityService.getAcivity(id);
    let activity = await activityService.updateActivity(id, req.body);
    res
      .status(200)
      .json({ message: "Activity updated successfully.", activity });
    res.locals.formatedTextTracking = {
      bodyFields: {
        name: "value",
        alias: "comment",
      },
      prevDataFields: [
        {
          name: "value",
          alias: "comment",
        },
      ],
      prevData: prevActivity,
    };
    next();
  } catch (error) {
    next(error);
  }
};
exports.deleteActivity = async (req, res, next) => {
  let activityService = new ActivityService(req.accessControl);
  let { id } = req.params;
  try {
    let activity = await activityService.deleteActivity(id);
    return res
      .status(200)
      .json({ message: "Activity deleted successfully.", activity });
  } catch (error) {
    next(error);
  }
};
