const { ManagementReviewCRUDOperations } = require("./managementReview");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const moment = require("moment");
class Attendees extends ManagementReviewCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async addAttendees(id, data) {
    let { attendee } = data;
    let managementReview = await this.getManagementReview({ _id: id });
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          attendees: attendee,
        },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
  async removeAttendees(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    let { attendee_id } = data;
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          attendees: attendee_id,
        },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
}
exports.Attendees = Attendees;
