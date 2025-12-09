const { Filters } = require("../utility");
const { Manager } = require("./manager");
const { IamPolicy } = require("../iamPolicy");
const mongoose = require("mongoose");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
class DocumentRepositoriesListingQuery extends Manager {
  constructor(connection) {
    super(connection);
  }
  constructListingQuery(data) {
    let { user } = data.requestedAccessControl;
    let queryParams = { ...data.requestedQuery };
    let filter = new Filters(
      {
        query: data.requestedQuery,
        tenant: this.connection,
      },
      {
        searchFields: ["reference", "name", "description", "purpose"],
      }
    )
      .build()
      .query();
    let query = {
      ...(filter["deleteMarker.status"] && { "deleteMarker.status": true }),
    };
    let matchOrganisationalPrivacy = { privacy: "Organisational" };
    let matchBusinessUnitPrivacy = { privacy: "Business unit" };
    let matchCustomPrivacy = { privacy: "Custom" };
    let matchCurrentBusinessUnit = {
      group: new mongoose.Types.ObjectId(user?.groupId),
    };
    /** if the privacy is in the list of ["Organisational", "Business unit"] */
    let matchBusinessUnitAndOrganisationalPrivacy = {
      privacy: { $in: ["Organisational", "Business unit"] },
    };
    /**
     * if i'm the owner of the repo
     * this covers the `Only me` privacy as well.
     */
    let matchOwner = { owner: new mongoose.Types.ObjectId(user?._id) };
    /** if i'm the creator of the repo */
    let matchCreator = { "created.by": new mongoose.Types.ObjectId(user?._id) };
    /** match shared files with me */
    let matchSharedWithMe = {
      sharedWith: new mongoose.Types.ObjectId(user?._id),
    };
    /** if the repo is custom and shared with me */
    let matchCustomAndAudiencePrivacy = {
      $and: [{ ...matchCustomPrivacy }, { ...matchSharedWithMe }],
    };
    /** if the privacy is business unit check if it also macthes the current session of group */
    let matchCurrentlyActiveBusinessUnitAndPrivacy = {
      $and: [{ ...matchBusinessUnitPrivacy }, { ...matchCurrentBusinessUnit }],
    };
    /** following query is must to be matched if the user is a super user */
    let matchGlobalUserPreConditions = {
      $or: [
        { ...matchOwner },
        { ...matchCreator },
        { ...matchBusinessUnitAndOrganisationalPrivacy },
        {
          ...matchCustomAndAudiencePrivacy,
        },
      ],
    };
    /** these pre conditions has to be macthed if the user is a only business unit level user */
    let matchBusinessUnitScopedUsersPreConditions = {
      $or: [
        { ...matchOwner },
        { ...matchCreator },
        { ...matchOrganisationalPrivacy },
        {
          ...matchCurrentlyActiveBusinessUnitAndPrivacy,
        },
        {
          ...matchCustomAndAudiencePrivacy,
        },
      ],
    };
    if (
      user.role === ROLES.EXTERNAL_AUDITOR ||
      user.role === ROLES.SUPER_ADMIN ||
      user.role === ROLES.INTERNAL_AUDITOR
    ) {
      query = {
        ...query,
        $and: [{ ...matchGlobalUserPreConditions }, { ...filter }],
      };
    } else {
      query = {
        ...query,
        $and: [{ ...matchBusinessUnitScopedUsersPreConditions }, { ...filter }],
      };
    }
    logger.info("constructed query:", { query: query });
    return { requestedQuery: queryParams, constructedQuery: query };
  }
}
exports.DocumentRepositoriesListingQuery = DocumentRepositoriesListingQuery;
