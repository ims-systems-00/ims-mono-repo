const { TaskCRUDOperations } = require("./tasks");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
class Analytics extends TaskCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async topTasks(data) {
    let { user } = data;
    let [paginatedTeamPriority, paginatedIndividualPriority] =
      await Promise.all([
        this.Tasks.paginate(
          {
            teamPriority: true,
            $or: [{ "assignedTo.user": user._id }, { "created.by": user._id }],
            "completed.status": { $ne: "Complete" },
          },
          { page: 1, limit: 3, sort: "-createdAt" }
        ),
        this.Tasks.paginate(
          {
            "created.by": user._id,
            teamPriority: false,
            "completed.status": { $ne: "Complete" },
          },
          { page: 1, limit: 3, sort: "-createdAt" }
        ),
      ]);
    let teamTasks = await Promise.all(
      paginatedTeamPriority.docs.map((task) => this.Tasks.populateTask(task))
    );
    let individualTasks = await Promise.all(
      paginatedIndividualPriority.docs.map((task) =>
        this.Tasks.populateTask(task)
      )
    );
    return { teamTasks, individualTasks };
  }
}
exports.Analytics = Analytics;
