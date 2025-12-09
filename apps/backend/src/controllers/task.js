const { trimQuery } = require("../validations/utils");
const taskManagerService = require("../services/taskManager");
const { Filters } = require("../services/utility");
const { StatusCodes } = require("http-status-codes");
exports.createTask = async (req, res, next) => {
  let taskCrudOps = new taskManagerService.TaskCRUDOperations(
    req.accessControl
  );
  try {
    let task = await taskCrudOps.createTask({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Task created.", task });
  } catch (err) {
    next(err);
  }
};
exports.authPersonalization = async (req, res, next) => {
  let { userId } = trimQuery(req.query);
  let { user } = req.accessControl;
  if (!userId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User id is required in query params" });
  if (user._id.toString() !== userId.toString())
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User unauthorized to access others task." });
  return next();
};
exports.getTasks = async (req, res, next) => {
  let taskCrudOps = new taskManagerService.TaskCRUDOperations(
    req.accessControl
  );
  let { page, size, sort } = trimQuery(req.query);
  let { user } = req.accessControl;
  let filter = new Filters(req, {
    searchFields: ["reference", "name", "description", "priority"],
  })
    .build()
    .query();
  const options = { page, limit: size, sort };
  try {
    /**
     * and check is very important otherwise will cause a security breach
     */
    let query = {
      $and: [
        {
          $or: [{ "created.by": user?._id }, { "assignedTo.user": user?._id }],
        },
        { ...filter },
      ],
    };
    let result = await taskCrudOps.listTasksByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Tasks retrived.",
      pagination: result.pagination,
      tasks: result.tasks,
    });
  } catch (err) {
    next(err);
  }
};
exports.getTask = async (req, res, next) => {
  let taskCrudOps = new taskManagerService.TaskCRUDOperations(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let { user } = req.accessControl;
    let task = await taskCrudOps.getTask({
      _id: id,
      $or: [{ "created.by": user._id }, { "assignedTo.user": user._id }],
    });
    res.status(StatusCodes.OK).json({ message: "Task retrived.", task });
  } catch (err) {
    next(err);
  }
};
exports.updateTask = async (req, res, next) => {
  let taskCrudOps = new taskManagerService.TaskCRUDOperations(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let task = await taskCrudOps.updateTask(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Task updated.", task });
  } catch (err) {
    next(err);
  }
};
exports.deleteAttachment = async (req, res, next) => {
  let taskManager = new taskManagerService.TaskCRUDOperations(
    req.accessControl
  );
  try {
    let { id, attachment_id } = req.params;
    let task = await taskManager.deleteAttachment(id, { attachment_id });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Attachment deleted successfully.", task });
  } catch (err) {
    next(err);
  }
};
exports.acceptTask = async (req, res, next) => {
  let taskLifecycle = new taskManagerService.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;
    let task = await taskLifecycle.handleTaskRequest(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Task status updated.", task });
  } catch (err) {
    next(err);
  }
};
exports.completeTask = async (req, res, next) => {
  let taskLifecycle = new taskManagerService.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;

    let task = await taskLifecycle.markAsComplete(id, {
      completedBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Task marked as complete.", task });
  } catch (err) {
    next(err);
  }
};
exports.topTaskAnalytics = async (req, res, next) => {
  let anlaytics = new taskManagerService.Analytics(req.accessControl);
  try {
    let { user, session } = req.accessControl;
    let result = await anlaytics.topTasks({ user });
    res.status(StatusCodes.OK).json({
      message: "Top tasks retrived",
      teamTasks: result.teamTasks,
      individualTasks: result.individualTasks,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteTask = async (req, res, next) => {
  let taskCrudOps = new taskManagerService.TaskCRUDOperations(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let task = await taskCrudOps.deleteTask(id);
    res.status(StatusCodes.OK).json({ message: "Task deleted.", task });
  } catch (err) {
    next(err);
  }
};
