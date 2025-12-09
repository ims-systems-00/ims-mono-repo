const WorklogModel = require("../models/mongodb/system/wallet/worklog");
const UserModel = require("../models/mongodb/system/users&auth/user");
const { asynchronously, imsPaginationFormated } = require("./utility");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
class WorklogService {
  constructor(connection) {
    this.connection = connection;
    this.Worklog = WorklogModel(connection);
    this.User = UserModel(connection);
  }
  async clockIn(data) {
    let [worklogError, worklog] = await asynchronously(
      this.Worklog.findOne({ endTime: null, "created.by": data.created.by })
    );
    if (worklog) return asynchronously(this.Worklog.populateWorklog(worklog));
    [worklogError, worklog] = await asynchronously(
      this.Worklog.create({
        ...data,
        currentState: "Resume",
      })
    );
    if (worklogError) return [worklogError, null];
    const [userUpdateError, updatedUser] = await asynchronously(
      this.User.findOneAndUpdate(
        {
          _id: data?.created?.by,
        },
        {
          $set: { "shift.status": "Clocked in" },
        },
        { new: true }
      )
    );
    if (userUpdateError)
      return [{ message: "Could not update user shift status" }, null];
    return asynchronously(this.Worklog.populateWorklog(worklog));
  }
  async pauseClock({ userId }) {
    let [worklogError, worklog] = await asynchronously(
      this.Worklog.findOneAndUpdate(
        { endTime: null, "created.by": userId },
        [
          {
            $addFields: {
              nextState: {
                $cond: {
                  if: { $eq: ["$currentState", "Pause"] },
                  then: "Resume",
                  else: "Pause",
                },
              },
            },
          },
          {
            $set: {
              timesheet: {
                $concatArrays: [
                  { $ifNull: ["$timesheet", []] },
                  [
                    {
                      eventTime: new Date(),
                      event: "$nextState",
                    },
                  ],
                ],
              },
              currentState: "$nextState",
            },
          },
          {
            $unset: ["nextState"],
          },
        ],
        { new: true }
      )
    );
    if (worklogError) return [worklogError, null];
    if (!worklog) return [{ message: "No active sessions" }, null];
    this.User.findOneAndUpdate(
      {
        _id: worklog.created.by,
      },
      {
        $set: {
          "shift.status":
            worklog.currentState === "Pause" ? "Paused" : "Clocked in",
        },
      }
    ).exec();
    return asynchronously(this.Worklog.populateWorklog(worklog));
  }
  async getWorklogs(query, options) {
    let [worklogsError, pagination] = await asynchronously(
      this.Worklog.paginate(query, options)
    );
    let worklogs = pagination.docs;
    if (worklogsError) return [worklogsError, worklogs];
    let [populationError, populatedWorklogs] = await asynchronously(
      Promise.all(
        worklogs.map((worklog) => this.Worklog.populateWorklog(worklog))
      )
    );
    if (populationError) return [populationError, populatedWorklogs];
    return [
      null,
      {
        worklogs: populatedWorklogs,
        pagination: imsPaginationFormated(pagination),
      },
    ];
  }
  async getWorklog(id) {
    let [worklogError, worklog] = await asynchronously(
      this.Worklog.findOne({ _id: id })
    );
    if (!worklog) return [{ message: "Worklog no found" }, null];
    if (worklogError) return [worklogError, worklog];
    return asynchronously(this.Worklog.populateWorklog(worklog));
  }
  async getActiveWorklog({ userId }) {
    return asynchronously(
      this.Worklog.findOne({ "created.by": userId, endTime: null })
    );
  }
  async updateWorklog(id, data) {
    let [worklogError, worklog] = await asynchronously(
      this.Worklog.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            type: data.type,
            achivements: data.achievements,
            priorities: data.priorities,
            location: data.location,
          },
        },
        { new: true }
      )
    );
    if (worklogError) return [worklogError, null];
    return asynchronously(this.Worklog.populateWorklog(worklog));
  }
  async clockOut({ userId, achievements }) {
    let [worklogError, worklog] = await asynchronously(
      this.Worklog.findOneAndUpdate(
        { endTime: null, "created.by": userId },
        {
          $set: {
            endTime: new Date(),
            achievements,
          },
        },
        { new: true }
      )
    );
    if (worklogError) return [worklogError, null];
    if (!worklog) return [{ message: "No active sessions" }, null];
    let /** @type {Date} */ breakStartTime;
    const { timesheet } = worklog;
    let totalBreakTimeMs = 0;
    if (timesheet) {
      totalBreakTimeMs = timesheet.reduce((breakTimeMs, timesheet) => {
        let currentBreakTimeMs = 0;
        if (timesheet.event === "Pause") {
          breakStartTime = timesheet.eventTime;
        } else if (timesheet.event === "Resume") {
          currentBreakTimeMs = timesheet.eventTime - breakStartTime;
        }
        return breakTimeMs + currentBreakTimeMs;
      }, 0);
    }
    logger.info("Total break time in ms", {totalBreakTime: totalBreakTimeMs});
    let totalWorkTimeMs = 0;
    if (worklog.currentState === "Pause") {
      totalWorkTimeMs =
        timesheet[timesheet.length - 1].eventTime -
        worklog.startTime -
        totalBreakTimeMs;
    } else if (worklog.currentState === "Resume") {
      totalWorkTimeMs = worklog.endTime - worklog.startTime - totalBreakTimeMs;
    }
    logger.info("Total work time in ms", {totalWorkTime: totalWorkTimeMs});
    const [worklogError2, updatedWorklog] = await asynchronously(
      this.Worklog.findOneAndUpdate(
        { _id: worklog._id },
        {
          $set: {
            totalBreakTimeMs,
            totalWorkTimeMs,
          },
        },
        { new: true }
      )
    );
    const totalExtraTimeMs =
      updatedWorklog.totalWorkTimeMs - worklog.totalWorkTimeMs;
    logger.info("total extra time in ms", {totalExtraTime: totalExtraTimeMs});
    await asynchronously(
      this.User.findOneAndUpdate(
        { _id: worklog.created.by },
        {
          $set: {
            "shift.status": "Clocked out",
          },
        }
      )
    );
    return asynchronously(this.Worklog.populateWorklog(worklog));
  }
  async deleteWorklog(id) {
    let [deleteError, worklog] = await asynchronously(
      this.Worklog.findOneAndDelete({ _id: id })
    );
    if (deleteError) return [deleteError, worklog];
    if (!worklog) return [{ message: "No worklog found with the id." }, null];
    if (worklog && !worklog.endTime)
      await asynchronously(
        this.User.findOneAndUpdate(
          {
            _id: worklog?.created?.by,
          },
          {
            $set: { "shift.status": "Clocked out" },
          },
          { new: true }
        )
      );
    return [deleteError, worklog];
  }
}
module.exports = WorklogService;
