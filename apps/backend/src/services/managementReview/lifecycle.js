const { ManagementReviewCRUDOperations } = require("./managementReview");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
class Lifecycle extends ManagementReviewCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async markManagementReviewAsComplete(id) {
    let prevManagementReview = await this.getManagementReview({ _id: id });
    if (new Date() >= prevManagementReview.scheduledDate)
      throw new Error(
        "Management review can not be completed before schedule date."
      );
    if (this._isComplete(prevManagementReview))
      throw new Error("This management review is already marked as complete.");
    let managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          completed: {
            status: true,
            by: this.connection.user?._id,
            on: Date.now(),
          },
        },
      },
      { new: true }
    );
    managementReview = await this.ManagementReviews.populateManagementReivew(
      managementReview
    );
    return managementReview;
  }
}
exports.Lifecycle = Lifecycle;
