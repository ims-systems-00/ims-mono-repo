const { asynchronously, imsPaginationFormated } = require("./utility");
const UserModel = require("../models/mongodb/system/users&auth/user");
const EmailCampaignModel = require("../models/mongodb/system/crm/emailCampaign");
const OrganizationModel = require("../models/mongodb/system/organization/organization");
const FileHandlerService = require("./fileHandler");
const OrganisationService = require("./organisation");
const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
const PaymentService = require("./payments");
const CRMService = require("./crm");
const campaignQueue = require("../schedules/queues/campaign.queue");
const CustomerModel = require("../models/mongodb/system/crm/customer");
const CampaignDeliveryModel = require("../models/mongodb/system/crm/campaignDelivary");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { APIError } = require("../helpers/errors/apiError");
const { basicRoleScopedFilter } = require("../queries");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

class EmailCampaignService {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
    this.Organization = OrganizationModel(connection);
    this.EmailCampaign = EmailCampaignModel(connection);
    this.Customer = CustomerModel(connection);
    this.CampaignDelivery = CampaignDeliveryModel(connection);
  }
  async createCampaign(data) {
    let organisationService = new OrganisationService(this.connection);
    let organisation = await organisationService.getOrganisation(
      this.connection.user.organizationId
    );
    let campaign = await this.EmailCampaign.create({
      organization: this.connection.user.organizationId,
      group: data.group,
      bundle: data.bundle || uuidv4(),
      target: data.target,
      customAudience: data.customAudience,
      subject: data.subject,
      name: data.name,
      body: data.body,
      rootCampaign: !data.bundle ? true : false,
      sentFrom: {
        email: organisation.officeEmail,
        name: organisation.name,
      },
      attachments: data.attachments,
      created: {
        on: Date.now(),
        by: data.createdBy,
      },
    });
    return this.EmailCampaign.populateCampaign(campaign);
  }
  async getCampaigns(query, options) {
    let pagination = await this.EmailCampaign.paginate(query, options);
    let campaigns = pagination.docs;
    let populatedCampaigns = await Promise.all(
      campaigns.map((campaign) => this.EmailCampaign.populateCampaign(campaign))
    );
    return {
      campaigns: populatedCampaigns,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async getCampaignsByOrg(query, options) {
    let pagination = await this.EmailCampaign.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let campaigns = pagination.docs;
    let populatedCampaigns = await Promise.all(
      campaigns.map((campaign) => this.EmailCampaign.populateCampaign(campaign))
    );
    return {
      campaigns: populatedCampaigns,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async getCampaign(id) {
    let campaign = await this.EmailCampaign.findOne({ _id: id });
    if (!campaign)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Campaign not found with given query."
      );
    return this.EmailCampaign.populateCampaign(campaign);
  }
  async updateCampaign(id, data) {
    let campaign = await this.getCampaign(id);
    campaign.group = data.group;
    campaign.target = data.target;
    campaign.subject = data.subject;
    campaign.body = data.body;
    campaign.attachments = [...campaign.attachments, ...data.attachments];
    await campaign.save();
    // campaign.attachments = data.attachments;
    // let campaign = await this.EmailCampaign.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $set: {
    //       group: data.group,
    //       target: data.target,
    //       subject: data.subject,
    //       body: data.body,
    //       $push: { attachments: data.attachments },
    //     },
    //   },
    //   { new: true }
    // );
    return this.EmailCampaign.populateCampaign(campaign);
  }
  async sendCampaign(id) {
    let campaign = await this.getCampaign(id);
    campaign.status = "Queued";
    campaign = await campaign.save();
    campaignQueue.produce({
      accessControl: this.connection,
      campaignId: id,
    });
    return this.EmailCampaign.populateCampaign(campaign);
  }
  async listRecipients(query, options) {
    let pagination = await this.CampaignDelivery.paginate(query, options);
    let lists = pagination.docs;
    let populatedlists = await Promise.all(
      lists.map((list) => this.CampaignDelivery.populateList(list))
    );
    return {
      lists: populatedlists,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async listRecipientsByOrg(query, options) {
    let pagination = await this.CampaignDelivery.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query },
      options
    );
    let lists = pagination.docs;
    let populatedlists = await Promise.all(
      lists.map((list) => this.CampaignDelivery.populateList(list))
    );
    return {
      lists: populatedlists,
      pagination: imsPaginationFormated(pagination),
    };
  }
  async campaignOverview(id) {
    let getCampaign = this.EmailCampaign.findOne({ _id: id });
    if (!getCampaign)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Campaign not found with given query."
      );
    let getTotalRecipients = this.CampaignDelivery.aggregate([
      {
        $match: { campaign: new mongoose.Types.ObjectId(id) },
      },
      {
        $group: {
          _id: { total: "total" },
          totalRecipients: { $sum: "$total" },
        },
      },
    ]);
    let analytics = await Promise.all([getCampaign, getTotalRecipients]);
    logger.info(analytics);
    return {
      totalCustomers: analytics[0] ? analytics[0].totalCustomers : 0,
      totalRecipients: analytics[1].length
        ? analytics[1][0].totalRecipients
        : 0,
    };
  }
  async closeCampaign(id, bundle) {
    let campaigns = await this.EmailCampaign.updateMany(
      { bundle },
      {
        $set: { closed: true },
      }
    );
    return this.getCampaign(id);
  }
  async deleteICampaign(id) {
    let campaign = await this.EmailCampaign.findOne({ _id: id });
    if (!campaign)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Campaign not found with given id"
      );
    await this.EmailCampaign.deleteOne({ _id: id });
    return campaign;
  }
}
module.exports = EmailCampaignService;
