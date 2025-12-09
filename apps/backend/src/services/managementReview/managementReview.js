const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { basicRoleScopedFilter } = require("../../queries");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const {
  IMS_POLICIES,
  ROLES,
} = require("@ims-systems-00/ims-core/lib/constants");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];
class ManagementReviewCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createManagementReview(data) {
    let {
      organization,
      group,
      attendees,
      agenda,
      minutes,
      title,
      date,
      time,
      interval,
      privacy,
      createdBy,
    } = data;
    const baseDate = new Date(date);
    const reviewIntervals = {
      Monthly: 12,
      Quarterly: 4,
      "Half yearly": 2,
      Yearly: 1,
    };
    let scheduledManagementReviews = [];
    let multiplicationFactor = 12 / reviewIntervals[interval];
    for (let i = 0; i < reviewIntervals[interval]; i++)
      scheduledManagementReviews.push(i);
    scheduledManagementReviews = await Promise.all(
      scheduledManagementReviews.map(async (i) => {
        let scheduledDate = new Date(
          baseDate.getTime() + 86400000 * 30 * i * multiplicationFactor
        );
        let day = scheduledDate.getDay();
        scheduledDate =
          day === 0 ? scheduledDate.getTime() + 86400000 : scheduledDate;
        scheduledDate =
          day === 6 ? scheduledDate.getTime() + 86400000 * 2 : scheduledDate;
        let managementReview = new this.ManagementReviews({
          organization: this.connection.user.organizationId,
          group,
          title,
          privacy,
          date: scheduledDate,
          time,
          interval,
          agenda: agenda && i === 0 ? agenda : [],
          minutes: minutes && i === 0 ? minutes : [],
          attendees,
          created: {
            on: Date.now(),
            by: createdBy?._id,
          },
        });
        managementReview = await managementReview.save();
        managementReview =
          await this.ManagementReviews.populateManagementReivew(
            managementReview
          );

        // / notification
        mainChannel.topic(SERVER_EVENTS_BUS.NEW_MANAGEMENT_REVIEW_EVENT).emit({
          accessControl: this.connection,
          managementReview,
        });

        // this.trigger.sendNotification(
        //   "newManagementReviewEvent",
        //   managementReview
        // );
        mainChannel.topic(SERVER_EVENTS_BUS.NOTIFY_ATTENDEEDS).emit({
          accessControl: this.connection,
          managementReview,
        });
        // this.trigger.sendNotification("notifyAttendeeds", managementReview);
        this.ManagementReviews.createCalenderEvent(managementReview);
        return managementReview;
      })
    );
    // eventEmitter.emit(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.managementreviews,
    //   user: createdBy,
    // });
    mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.incidents,
      user: data.createdBy,
    });
    return scheduledManagementReviews;
  }
  async updateManagementReview(id, data) {
    let { title, attendees, agenda, minutes, date, time, privacy } = data;
    let prevManagementReview = await this.getManagementReview({ _id: id });
    if (this._isComplete(prevManagementReview))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This management review is already updated."
      );
    let managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $set: { title, privacy, date, time, attendees },
        $push: {
          agenda: agenda ? agenda : [],
          minutes: minutes ? minutes : [],
        },
      },
      { new: true }
    );
    managementReview = await this.ManagementReviews.populateManagementReivew(
      managementReview
    );
    this.ManagementReviews.updateCalendetEvent(managementReview);
    return managementReview;
  }
  async listManagementReviews(query, options) {
    let pagination = await this.ManagementReviews.paginate(query, options);
    let managementReviews = pagination.docs;
    managementReviews = await Promise.all(
      managementReviews.map((managementReview) =>
        this.ManagementReviews.populateManagementReivew(managementReview)
      )
    );
    return {
      managementReviews,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async listManagementReviewsByOrg(query, options) {
    let pagination = await this.ManagementReviews.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let managementReviews = pagination.docs;
    managementReviews = await Promise.all(
      managementReviews.map((managementReview) =>
        this.ManagementReviews.populateManagementReivew(managementReview)
      )
    );
    return {
      managementReviews,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getManagementReview(query) {
    let managementReview = await this.ManagementReviews.findOne(query);
    if (!managementReview)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No management review was found with the query."
      );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
  async deleteManagementReview(id) {
    let managementReview = await this.getManagementReview({ _id: id });
    if (this._isComplete(managementReview))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not delete complete management review"
      );
    await this.ManagementReviews.deleteOne({ _id: id });
    return managementReview;
  }
}
exports.ManagementReviewCRUDOperations = ManagementReviewCRUDOperations;
