const { ManagementReviewCRUDOperations } = require("./managementReview");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const moment = require("moment");
class Documents extends ManagementReviewCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async addAgenda(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    let { agenda } = data;
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $push: { agenda: agenda },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
  async removeAgenda(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    let { agenda_id } = data;
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $pull: { agenda: { _id: agenda_id } },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
  async addMinutes(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    let { minutes } = data;
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $push: { minutes: minutes },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
  async removeMinutes(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    let { minute_id } = data;
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $pull: { minutes: { _id: minute_id } },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
}
exports.Documents = Documents;
