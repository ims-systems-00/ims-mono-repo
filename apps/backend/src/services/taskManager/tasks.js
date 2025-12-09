const { Manager } = require("./manager");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
class TaskCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }

  async createTask(data) {
    let {
      teamPriority,
      group,
      assignedTo,
      priority,
      name,
      attachments,
      description,
      due,
      createdBy,
      moduleType,
      module,
    } = data;

    if (teamPriority && !group)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Team priority tasks require a business function."
      );

    if (teamPriority) {
      assignedTo = await this.Users.find({
        "accessPolicies.group": group,
        // _id: { $ne: createdBy?._id },
      });
      assignedTo = assignedTo.map((assignee) => ({ user: assignee._id }));
    } else {
      assignedTo = assignedTo.map((assignee) => ({ user: assignee }));
    }

    let task = new this.Tasks({
      organization: this.connection.user.organizationId,
      group: teamPriority ? group : null,
      name,
      description,
      teamPriority,
      attachments: attachments ? attachments : [],
      assignedTo,
      priority,
      due,
      created: {
        by: createdBy?._id,
        on: Date.now(),
      },
      source: {
        moduleType: moduleType || "tasks",
        module: module || null,
      },
    });

    await task.save();
    task = await this.Tasks.populateTask(task);
    // this.trigger.sendNotification(
    //   "newTaskAssigneeEvent",
    //   { task },
    //   { email: true }
    // );

    mainChannel.topic(SERVER_EVENTS_BUS.NEW_TASK_ASSIGNEE_EVENT).emit({
      accessControl: this.connection,
      task,
    });

    if (moduleType !== "tasks" && module) {
      mainChannel.topic(SERVER_EVENTS.TASK_HAS_BEEN_LINKED_TO_MODULE).emit({
        accessControl: this.connection,
        task,
      });
      // eventEmitter.emit(SERVER_EVENTS.TASK_HAS_BEEN_LINKED_TO_MODULE, {
      //   accessControl: this.connection,
      //   task,
      // });
    }

    mainChannel.topic(SERVER_EVENTS.TASK_CREATED).emit({
      accessControl: this.connection,
      task,
    });
    // eventEmitter.emit(SERVER_EVENTS.TASK_CREATED, {
    //   accessControl: this.connection,
    //   task,
    // });

    this.Tasks.createCalenderEvent(task);
    return task;
  }

  async getTask(query) {
    let task = await this.Tasks.findOne(query);
    if (!task)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No task was found with the query."
      );
    return this.Tasks.populateTask(task);
  }

  async updateTask(id, data) {
    let { group, assignedTo, teamPriority, attachments } = data;

    const mutations = { ...data };
    delete mutations["attachments"];
    delete mutations["group"];
    delete mutations["assignedTo"];

    let currentTask = await this.getTask({ _id: id });

    if (teamPriority && !group)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Team priority tasks require a business function."
      );

    if (teamPriority) {
      assignedTo = await this.Users.find({
        "accessPolicies.group": group,
        _id: { $ne: currentTask.created.by?._id },
      });
      assignedTo = assignedTo.map((assignee) => {
        let alreadyAssigned = currentTask.assignedTo.find((prevassignee) => {
          return (
            (prevassignee.user && prevassignee.user?._id?.toString()) ===
            (assignee && assignee._id.toString())
          );
        });
        return alreadyAssigned || { user: assignee._id };
      });
    } else {
      assignedTo = assignedTo.map((assignee) => {
        let alreadyAssigned = currentTask.assignedTo.find(
          (prevassignee) =>
            (prevassignee.user && prevassignee.user?._id?.toString()) ===
            (assignee && assignee.toString())
        );
        return alreadyAssigned || { user: assignee };
      });
    }

    if (this._isComplete(currentTask))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can no update completed task."
      );

    let task = await this.Tasks.findByIdAndUpdate(
      id,
      {
        $set: {
          ...mutations,
          assignedTo: assignedTo,
          group: teamPriority ? group : null,
        },
        $push: {
          attachments: attachments ? attachments : [],
        },
      },
      { new: true }
    );

    task = await this.Tasks.populateTask(task);

    if (data.attachments?.length) {
      mainChannel.topic(SERVER_EVENTS.ATTACHMENT_ADDED).emit({
        accessControl: this.connection,
        moduleType: moduleTypes.tasks,
        module: task,
        user: data.updatedBy,
        attachments: attachments,
      });
      // eventEmitter.emit(SERVER_EVENTS.ATTACHMENT_ADDED, {
      //   accessControl: this.connection,
      //   moduleType: moduleTypes.tasks,
      //   module: task,
      //   user: data.updatedBy,
      //   attachments: attachments,
      // });
    }

    // this.trigger.sendNotification(
    //   "newTaskAssigneeEvent",
    //   {
    //     task,
    //     prevTask: currentTask,
    //   },
    //   { email: true }
    // );
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_TASK_ASSIGNEE_EVENT).emit({
      accessControl: this.connection,
      task,
      prevTask: currentTask,
    });

    this.Tasks.updateCalenderEvent(task);
    return task;
  }

  async listTasks(query, options) {
    let pagination = await this.Tasks.paginate(query, options);
    let tasks = pagination.docs;
    tasks = await Promise.all(
      tasks.map((task) => this.Tasks.populateTask(task))
    );
    return { tasks, pagination: this.imsPaginationFormated(pagination) };
  }

  async listTasksByOrg(query, options) {
    let pagination = await this.Tasks.paginateByOrg(
      this.connection?.user?.organizationId,
      query,
      options
    );
    let tasks = pagination.docs;
    tasks = await Promise.all(
      tasks.map((task) => this.Tasks.populateTask(task))
    );
    return { tasks, pagination: this.imsPaginationFormated(pagination) };
  }

  async deleteTask(id) {
    let task = await this.getTask({ _id: id });
    await this.Tasks.deleteOne({ _id: id });
    return task;
  }

  async deleteAttachment(id, data) {
    let task = await this.getTask({ _id: id });
    task = await this.Tasks.findOneAndUpdate(
      { _id: id },
      {
        $pull: { attachments: { _id: data.attachment_id } },
      },
      { new: true }
    );
    return this.Tasks.populateTask(task);
  }
}

exports.TaskCRUDOperations = TaskCRUDOperations;
