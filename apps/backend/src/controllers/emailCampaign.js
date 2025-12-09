const { Filters } = require("../services/utility");
const { IamPolicy } = require("../services/iamPolicy");
const EmailCampaignService = require("../services/emailCampaign");
const { StatusCodes } = require("http-status-codes");
exports.createCampaign = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let campaign = await emailCampaignService.createCampaign({
      ...req.body,
      organization: req.accessControl.user.organizationId,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Campaign has been created.", campaign });
  } catch (error) {
    next(error);
  }
};
exports.getCampaigns = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { session, groupPolicy } = req.accessControl;
    let { page, size, sort } = req.query;
    let filter = new Filters(req, { searchFields: ["reference"] })
      .build()
      .query();
    const options = { page, limit: size, sort };
    let query = { ...filter };
    let queryResult = await emailCampaignService.getCampaignsByOrg(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Campaign retrived successfully.",
      campaigns: queryResult.campaigns,
      pagination: queryResult.pagination,
    });
  } catch (error) {
    next(error);
  }
};
exports.getCampaign = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { id } = req.params;
    let campaign = await emailCampaignService.getCampaign(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Campaign retrived successfully.", campaign });
  } catch (error) {
    next(error);
  }
};
exports.updateCampaign = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { id } = req.params;
    let campaign = await emailCampaignService.updateCampaign(id, req.body);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Campaign updated successfully.", campaign });
  } catch (error) {
    next(error);
  }
};
exports.deleteICampaign = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { id } = req.params;
    let campaign = await emailCampaignService.deleteICampaign(id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Campaign deleted successfully.", campaign });
  } catch (error) {
    next(error);
  }
};
exports.sendCampaign = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { id } = req.params;
    let campaign = await emailCampaignService.sendCampaign(id);
    return res.status(StatusCodes.OK).json({
      message: "Campaign has been scheduled to sent.",
      campaign: campaign,
    });
  } catch (error) {
    next(error);
  }
};
exports.listRecipients = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { session, groupPolicy } = req.accessControl;
    let { page, size, sort } = req.query;
    let { id } = req.params;
    if (!id)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Campaign id is required in 'campaign' query." });
    const options = { page, limit: size, sort };
    let query = { campaign: id };
    let queryResult = await emailCampaignService.listRecipientsByOrg(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Recipients retrived.",
      lists: queryResult.lists,
      pagination: queryResult.pagination,
    });
  } catch (error) {
    next(error);
  }
};
exports.getCampaignOverView = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { id } = req.params;
    let overview = await emailCampaignService.campaignOverview(id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Campaign overview retrived.", overview });
  } catch (error) {
    next(error);
  }
};
exports.closeCampaign = async (req, res, next) => {
  let emailCampaignService = new EmailCampaignService(req.accessControl);
  try {
    let { bundle } = req.query;
    let { id } = req.params;
    let campaign = await emailCampaignService.closeCampaign(id, bundle);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Campaign closed.", campaign });
  } catch (error) {
    next(error);
  }
};
