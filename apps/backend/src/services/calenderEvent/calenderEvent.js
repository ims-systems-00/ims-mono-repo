const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { basicRoleScopedFilter } = require("../../queries");
class CalenderEventService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCalenderEvent(data) {
    let calendar = new this.CalenderEvent({
      organization: this.connection.user.organizationId,
      title: data.title,
      group: data.group,
      description: data.description,
      start: data.start,
      end: data.end,
      color: "default",
      created: {
        by: data.createdBy._id,
        on: Date.now(),
      },
    });
    await calendar.save();
    return this.CalenderEvent.populateCalenderEvent(calendar);
  }
  async listCalendersByOrg(query, options) {
    let pagination = await this.CalenderEvent.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let calenders = pagination.docs;
    calenders = await Promise.all(
      calenders.map((calendar) =>
        this.CalenderEvent.populateCalenderEvent(calendar)
      )
    );
    return { calenders, pagination: this.imsPaginationFormated(pagination) };
  }
  async getCalenderEvent(query) {
    let calender = await this.CalenderEvent.findOne(query);
    if (!calender)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No calender event was found with the query."
      );
    return this.CalenderEvent.populateCalenderEvent(calender);
  }
  async editCalenderEvent(id, data) {
    let preCalender = await this.getCalenderEvent({ _id: id });
    (preCalender.title = data.title),
      (preCalender.description = data.description),
      (preCalender.start = data.start),
      (preCalender.end = data.end);

    return await preCalender.save();
  }
  async removeCalenderEvent(query) {
    let calenderEvent = await this.getCalenderEvent(query);
    await this.CalenderEvent.deleteOne(query);
    return calenderEvent;
  }
}
exports.CalenderEventService = CalenderEventService;
