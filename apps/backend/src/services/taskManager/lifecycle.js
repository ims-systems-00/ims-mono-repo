const { TaskCRUDOperations } = require("./tasks");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
class Lifecycle extends TaskCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async markAsComplete(id, data) {
    let { completedBy } = data;
    let task = await this.getTask({ _id: id });

    if (this._isComplete(task))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Task is already marked as complete."
      );

    task = await this.Tasks.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "completed.status": "Complete",
          "completed.on": Date.now(),
          "completed.by": completedBy._id,
        },
      },
      { new: true }
    );

    task = await this.Tasks.populateTask(task);

    if (this._isComplete(task)) {
      mainChannel.topic(SERVER_EVENTS_BUS.TASK_COMPLETED_EVENT).emit({
        accessControl: this.connection,
        task,
      });
      mainChannel.topic(SERVER_EVENTS.TASK_COMPLETED).emit({
        accessControl: this.connection,
        task,
      });
      // this.trigger.sendNotification("taskCompletedEvent", task);
      // eventEmitter.emit(SERVER_EVENTS.TASK_COMPLETED, {
      //   accessControl: this.connection,
      //   task,
      // });
    }
    await this.taskCache.clearAll();
    return task;
  }

  async handleTaskRequest(id, data) {
    let { status, userId, user } = data;
    let prevTask = await this.getTask({ _id: id });
    let task = null;
    if (this._isComplete(prevTask))
      throw APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot amend completed task."
      );
    if (status === "Declined")
      task = await this.Tasks.findOneAndUpdate(
        { _id: id, "assignedTo.user": userId },
        {
          $set: {
            "assignedTo.$.acceptance": status,
            "assignedTo.$.updatedOn": Date.now(),
          },
        },
        { new: true }
      );
    else if (status === "Accepted")
      task = await this.Tasks.findOneAndUpdate(
        { _id: id, "assignedTo.user": userId },
        {
          $set: {
            "completed.status": "In progress",
            "assignedTo.$.acceptance": status,
            "assignedTo.$.updatedOn": Date.now(),
          },
        },
        { new: true }
      );
    else
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid status Update"
      );
    task = await this.Tasks.populateTask(task);
    if (status === "Accepted" || status === "Declined") {
      // this.trigger.sendNotification("taskRequestStatusChangedEvent", {
      //   task,
      //   userId,
      // });

      mainChannel
        .topic(SERVER_EVENTS_BUS.TASK_REQUEST_STATUS_CHANGE_EVENT)
        .emit({
          accessControl: this.connection,
          task,
          userId,
        });

      eventEmitter.emit(SERVER_EVENTS.TASK_ACCEPTANCE_BY_USER, {
        accessControl: this.connection,
        task,
        user,
        status,
      });
    }
    if (
      task.completed.status === "In progress" &&
      prevTask.completed.status !== "In progress"
    ) {
      mainChannel.topic(SERVER_EVENTS.TASK_IN_PROGRESS).emit({
        accessControl: this.connection,
        task,
      });
      // eventEmitter.emit(SERVER_EVENTS.TASK_IN_PROGRESS, {
      //   accessControl: this.connection,
      //   task,
      // });
    }
    await this.taskCache.clearAll();
    return task;
  }
}

exports.Lifecycle = Lifecycle;
