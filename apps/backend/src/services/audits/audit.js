const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { basicRoleScopedFilter } = require("../../queries");
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

class AuditCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createAudit(data) {
    let attachments = data.attachments?.map((attachment) => ({
      ...attachment,
      "modified.by": data.createdBy._id,
    }));
    const baseDate = new Date(data.startDate);
    const intervals = {
      Quarterly: 4,
      "Half yearly": 2,
      Yearly: 1,
    };
    let scheduledAudits = [];
    let multiplicationFactor = 12 / intervals[data.interval];
    for (let i = 0; i < intervals[data.interval]; i++) scheduledAudits.push(i);
    scheduledAudits = await Promise.all(
      scheduledAudits.map(async (i) => {
        let scheduledDate = new Date(
          baseDate.getTime() + 86400000 * 30 * i * multiplicationFactor
        );
        let day = scheduledDate.getDay();
        scheduledDate =
          day === 0 ? scheduledDate.getTime() + 86400000 : scheduledDate;
        scheduledDate =
          day === 6 ? scheduledDate.getTime() + 86400000 * 2 : scheduledDate;
        let audit = new this.Audits({
          organization: this.connection.user.organizationId,
          auditor: data.auditor,
          group: data.group,
          complianceBody: data.complianceBody,
          title: data.title,
          focusArea: data.focusArea,
          startDate: scheduledDate,
          time: data.time,
          type: data.type,
          attachments: attachments && i === 0 ? attachments : [],
          interval: data.interval,
          created: {
            on: Date.now(),
            by: data.createdBy._id,
          },
        });
        await audit.save();
        audit = await this.Audits.populateAudit(audit);
        // notification
        let membershipQuery = {};
        if (data.group?.name)
          membershipQuery = {
            $or: [
              { role: ROLES.SUPER_ADMIN },
              { role: ROLES.HEAD_OF_SERVICE, groups: data.group?._id },
            ],
          };
        else
          membershipQuery = {
            $or: [
              { role: [ROLES.SUPER_ADMIN, ROLES.HEAD_OF_SERVICE] },
              { invitedUserId: data?.auditor?._id },
            ],
          };

        let memberships = await this.Membership.findByOrg(
          this.connection?.user?.organizationId,
          membershipQuery
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        mainChannel.topic(SERVER_EVENTS_BUS.NEW_AUDIT_OWNER_EVENT).emit({
          accessControl: this.connection,
          audit,
          users,
        });

        // this.trigger.sendNotification("newAuditEvent", audit, { email: true });
        this.Audits.createCalenderEvent(audit);
        return audit;
      })
    );
    mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.incidents,
      user: data.createdBy,
    });

    // eventEmitter.emit(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.audits,
    //   user: data.createdBy,
    // });
    return scheduledAudits;
  }
  async listAudits(query, options) {
    let pagination = await this.Audits.paginate(query, options);
    let audits = pagination.docs;
    audits = await Promise.all(
      audits.map((audit) => this.Audits.populateAudit(audit))
    );
    return { audits, pagination: this.imsPaginationFormated(pagination) };
  }
  async listAuditsByOrg(query, options) {
    let pagination = await this.Audits.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let audits = pagination.docs;
    audits = await Promise.all(
      audits.map((audit) => this.Audits.populateAudit(audit))
    );
    return { audits, pagination: this.imsPaginationFormated(pagination) };
  }
  async getAudit(query) {
    let audit = await this.Audits.findOne(query);
    if (!audit)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No audit was found with the query."
      );
    return this.Audits.populateAudit(audit);
  }
  async deleteAudit(id) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot delete completed audit."
      );
    await this.Audits.deleteOne({ _id: id });
    return audit;
  }
  async updateAudit(id, data) {
    let prevAudit = await this.getAudit({ _id: id });
    if (this._isComplete(prevAudit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot update completed audit."
      );
    let newAttachments = data.attachments ? [...data.attachments] : [];
    delete data.attachments;
    let audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
        },
        $push: {
          attachments: newAttachments,
        },
      },
      { new: true }
    );
    audit = await this.Audits.populateAudit(audit);
    this.Audits.updateCalenderEvent(audit);
    return audit;
  }
  async deleteAttachment(id, data) {
    let audit = await this.getAudit({ _id: id });
    if (this._isComplete(audit))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot remove attachment from completed audit."
      );
    let { attachment_id } = data;
    audit = await this.Audits.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          attachments: { _id: attachment_id },
        },
      },
      { new: true }
    );
    return this.Audits.populateAudit(audit);
  }
}
exports.AuditCRUDOperations = AuditCRUDOperations;
