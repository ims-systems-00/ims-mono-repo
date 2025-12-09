const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { ManagementReviewCRUDOperations } = require("./managementReview");
const eventEmitter = require("../../events/event-manager").getInstance();
class ComplianceManager extends ManagementReviewCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async linkISOControls(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    if (this._isComplete(managementReview))
      throw new Error("Can not link toolkit to complete management review.");
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          "isoControls.toolkits": data.toolkits,
        },
        $push: {
          "isoControls.clauses": data.controls,
        },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
  async removeISOControls(id, data) {
    let managementReview = await this.getManagementReview({ _id: id });
    if (this._isResolved(managementReview))
      throw new Error("Cannot unlink toolkit from resolved incnident.");
    managementReview = await this.ManagementReviews.findOneAndUpdate(
      { _id: id },
      {
        $pullAll: {
          "isoControls.toolkits": data.toolkits,
        },
        $pullAll: {
          "isoControls.clauses": data.controls,
        },
      },
      { new: true }
    );
    return this.ManagementReviews.populateManagementReivew(managementReview);
  }
}
exports.ComplianceManager = ComplianceManager;
