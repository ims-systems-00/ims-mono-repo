const UserModel = require("../models/mongodb/system/users&auth/user");
const { asynchronously, imsPaginationFormated } = require("./utility");
const LeavesModel = require("../models/mongodb/system/wallet/leaves");
const CalendarModel = require("../models/mongodb/system/calender/calenderEvents");
const Holidays = require("date-holidays");
class LeavesService {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
    this.Leaves = LeavesModel(connection);
    this.Calendar = CalendarModel(connection);
  }
  async createLeave(data) {
    let startDate = new Date(data.startDate);
    let endDate = new Date(data.endDate);
    const [userError, { lineManagers, country }] = await asynchronously(
      this.User.findById(data.created.by)
    );
    if (userError) return [userError, null];
    if (!lineManagers)
      return [{ message: "No line manager assigned to user" }, null];
    if (!country) return [{ message: "No country assigned to user" }, null];
    let days =
      this._totalDayes(startDate, endDate) -
      (this._countWeekendDays(startDate, endDate) +
        this._countHolidays(startDate, endDate, country.code)) -
      /**
       * we are minusing wokring hours of the staring day and ending day because these
       * are not counted as leave times.
       */
      (1 - data.startDayFraction) -
      (1 - data.endDayFraction);
    const { submission, ...modData } = data;
    let [leaveError, leave] = await asynchronously(
      this.Leaves.create({
        ...modData,
        startDate,
        endDate,
        days,
        submission: {
          lineManagers,
          status: submission.status,
        },
      })
    );
    if (leaveError) return [leaveError, leave];
    return await asynchronously(this.Leaves.populateLeave(leave));
  }
  _findEndDate(endDate, remaining = 0, countryCode = "GB") {
    while (remaining > 0) {
      // logger.ifo('Off day', new Date(endDate).toDateString(), "remains", remaining)
      if (this._workDay(new Date(endDate), countryCode)) remaining--;
      // else logger.info("ivalida date")
      endDate = new Date(endDate).getTime() + 86400000;
    }
    return new Date(endDate);
  }
  _workDay(date, countryCode) {
    const hd = new Holidays(countryCode);
    return date.getDay() !== 0 && date.getDay() !== 6 && !hd.isHoliday(date);
  }
  _totalDayes(dateStart, dateEnd) {
    var totalDays =
      1 +
      Math.round(
        (dateEnd.getTime() - dateStart.getTime()) / (24 * 3600 * 1000)
      );
    return totalDays;
  }
  _countWeekendDays(dateStart, dateEnd) {
    var totalDays =
      1 +
      Math.round(
        (dateEnd.getTime() - dateStart.getTime()) / (24 * 3600 * 1000)
      );
    var totalSaturdays = Math.floor((dateStart.getDay() + totalDays) / 7);
    return (
      2 * totalSaturdays + (dateStart.getDay() == 0) - (dateStart.getDay() == 6)
    );
  }
  _countHolidays(dateStart, dateEnd, countryCode) {
    const hd = new Holidays(countryCode);
    let holidays = 0;
    let currentDate = dateStart;
    while (currentDate <= dateEnd) {
      if (hd.isHoliday(currentDate)) holidays++;
      currentDate = new Date(currentDate).getTime() + 86400000;
    }
    return holidays;
  }
  async addToCalender(data) {
    return asynchronously(
      this.Calendar.create({
        group: null,
        systemEventId: data._id,
        eventReference: "leave",
        title: `${data.user.name} is on ${data.type.toLowerCase()}`,
        description: `${data.notes}`,
        color: "azure",
        start: data.startDate,
        end: data.endDate,
        created: {
          on: Date.now(),
          by: data.approved.by._id,
        },
      })
    );
  }
  async getLeaves(query, options) {
    let [leavesError, pagination] = await asynchronously(
      this.Leaves.paginate(query, options)
    );
    let leaves = pagination.docs;
    if (leavesError) return [leavesError, leaves];
    let [populationError, populatedLeaves] = await asynchronously(
      Promise.all(leaves.map((leave) => this.Leaves.populateLeave(leave)))
    );
    if (populationError) return [populationError, populatedLeaves];
    return [
      null,
      {
        leaveRequests: populatedLeaves,
        pagination: imsPaginationFormated(pagination),
      },
    ];
  }
  async getLeave(id) {
    let [leaveError, leave] = await asynchronously(
      this.Leaves.findOne({ _id: id })
    );
    if (leaveError) return [leaveError, leave];
    return asynchronously(this.Leaves.populateLeave(leave));
  }
  async updateLeave(id, data) {
    /**
     * todo: bad code review the implementationof leaves API
     */
    let modData = data;
    const [userError, { country }] = await asynchronously(
      this.User.findById(data.created.by)
    );
    if (userError) return [userError, null];
    if (!country) return [{ message: "No country assigned to user" }, null];
    if (data.startDate && data.endDate && country) {
      let startDate = new Date(data.startDate);
      let endDate = new Date(data.endDate);
      let days =
        this._totalDayes(startDate, endDate) -
        (this._countWeekendDays(startDate, endDate) +
          this._countHolidays(startDate, endDate, country.code));
      modData = {
        ...data,
        startDate,
        endDate,
        days,
      };
    }
    let [leaveError, leave] = await asynchronously(
      this.Leaves.findOneAndUpdate(
        { _id: id },
        {
          $set: modData,
        },
        { new: true }
      )
    );
    if (leaveError) return [leaveError, leave];
    return asynchronously(this.Leaves.populateLeave(leave));
  }
  async deleteLeave(id) {
    return asynchronously(this.Leaves.findOneAndDelete({ _id: id }));
  }
  async handleRequest(id, data) {
    let [leaveError, leave] = await asynchronously(
      this.Leaves.findOneAndUpdate(
        {
          _id: id,
          "submission.status": { $in: ["Ongoing", "Pending"] },
          "created.by": { $ne: data.userId },
        },
        {
          $set: {
            "submission.status": data.decision,
            "submission.decisionDate": Date.now(),
            "submission.decisionMaker": data.userId,
          },
        },
        { new: true }
      )
    );
    if (leaveError) return [leaveError, leave];
    if (!leave)
      return [{ message: "No pending leave with that id found." }, leave];
    if (data.decision === "Approved") {
      [leaveError, leave] = await asynchronously(
        this.Leaves.populateLeave(leave)
      );
      const [userError, { accessPolicies }] = await asynchronously(
        this.User.findById(leave.created.by)
      );
      if (userError) return [userError, null];
      const [calendarError] = await asynchronously(
        this.Leaves.createCalendarEvent(leave, {
          options: {
            eventVisibilityGroups: accessPolicies.map(({ group }) => group),
          },
        })
      );
      if (calendarError)
        return [
          {
            message:
              "Could not create calendar event but leave was submitted successfully",
          },
          leave,
        ];
      return [null, leave];
    }
    return asynchronously(this.Leaves.populateLeave(leave));
  }
  async handleSubmission(id, data) {
    const today = new Date();
    let [leaveError, leave] = await asynchronously(
      this.Leaves.findOneAndUpdate(
        { _id: id },
        [
          {
            $set: {
              endDate: {
                $cond: {
                  if: {
                    $allElementsTrue: [
                      [
                        { $eq: ["$submission.status", "Ongoing"] },
                        { $lte: ["$endDate", today] },
                        { $lte: ["$startDate", today] },
                      ],
                    ],
                  },
                  then: today,
                  else: "$endDate",
                },
              },
            },
          },
          {
            $set: {
              "submission.status": data.status,
              "submission.submissionDate": today,
            },
          },
        ],
        { new: true }
      )
    );
    if (leaveError) return [leaveError, leave];
    if (!leave) return [{ message: "No leave found." }, leave];
    return asynchronously(this.Leaves.populateLeave(leave));
  }
}
module.exports = LeavesService;
