const { asyncWrapper, imsPaginationFormated } = require("./utility");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../models");
const { Token } = require("./tokenManagement");
const { Membership } = require("./membership");
const { ComplianceToolCRUDOps } = require("./complianceManager");
const {
  ROLES,
  PAYMENT_METHODS,
  ORGANISATTION_STATUS,
  PAYMENT_STATUS,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");
const { APIError } = require("../helpers/errors/apiError");
const {
  CreateBucketCommand,
  PutBucketCorsCommand,
  PutBucketTaggingCommand,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/awsS3");
const { sendMail } = require("../email/sendMail");
const PaymentService = require("./payments");

class OrganisationService {
  constructor(connection) {
    this.connection = connection;
    this.Organisation = models.organizations(connection);
    this.Membership = models.memberships(connection);
    this.Dashboard = models.dashboards(connection);
    this.GroupDashboard = models.groupdashboards(connection);
    this.Groups = models.iamgroups(connection);
    this.imsPaginationFormated = imsPaginationFormated;
  }
  async initializeOrganisation(data) {
    const membershipService = new Membership();
    const {
      name,
      vatNumber,
      officeEmail,
      contactNumber,
      industry,
      sizeOfOrg,
      referralSource,
      logometadata,
      addressCity,
      addressBuilding,
      addressStreet,
      addressPostCode,
      addressStateProvince,
      countryName,
      countryAbbr,
      countryCurrency,
      countryPhonecode,
    } = data;
    logger.info("Creating new organisation...");
    const organisation = await this.Organisation.create({
      name,
      officeEmail,
      contactNumber,
      address:
        addressCity +
        +" " +
        addressStreet +
        " " +
        addressBuilding +
        " " +
        addressPostCode +
        " " +
        addressStateProvince,
      vatNumber,
      industry,
      sizeOfOrg,
      addressCity,
      addressStreet,
      addressBuilding,
      addressPostCode,
      addressStateProvince,
      countryName,
      countryAbbr,
      countryCurrency,
      countryPhonecode,
      referralSource,
      logo: {
        metadata: logometadata || null,
        src:
          logometadata?.Key &&
          process.env.PUBLIC_RESOURCE_BASE_URL + "/" + logometadata?.Key,
      },
    });
    await membershipService.createMembership({
      invitedUserId: this.connection.user._id,
      organization: organisation?._id,
      role: ROLES.SUPER_ADMIN,
    });
    return organisation;
  }
  async getOrganisations(query, options) {
    let pagination = await this.Organisation.paginate(query, options);
    let organizations = pagination.docs;
    return {
      organizations,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getOrganisation(id) {
    let organization = await this.Organisation.findOne({ _id: id });
    if (!organization)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No organisation found with the id"
      );
    return organization;
  }
  async updateOrganisation(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let {
        name,
        bankDetails,
        companyNumber,
        vatNumber,
        millageCostForUsers,
        typeOfBusiness,
        officeEmail,
        addressCity,
        addressStreet,
        addressBuilding,
        addressPostCode,
        addressStateProvince,
        countryName,
        countryAbbr,
        countryCurrency,
        countryPhonecode,
        contactEmail,
        contactName,
        contactPosition,
      } = data;
      let updatedOrganization = await this.Organisation.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            bankDetails,
            companyNumber,
            vatNumber,
            typeOfBusiness,
            millageCostForUsers,
            officeEmail,
            address:
              addressCity +
              +" " +
              addressStreet +
              " " +
              addressBuilding +
              " " +
              addressPostCode +
              " " +
              addressStateProvince,
            addressCity,
            addressStreet,
            addressBuilding,
            addressPostCode,
            addressStateProvince,
            countryName,
            countryAbbr,
            countryCurrency,
            countryPhonecode,
            contactEmail,
            contactName,
            contactPosition,
          },
        },
        { new: true }
      );
      return updatedOrganization;
    }
  }
  async setIncidentResolutionTimes(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      const {
        p1incidentResolutionTime,
        p2incidentResolutionTime,
        p3incidentResolutionTime,
        p4incidentResolutionTime,
      } = data;
      return await this.Organisation.updateOne(
        { _id: id },
        {
          $set: {
            p1incidentResolutionTime,
            p2incidentResolutionTime,
            p3incidentResolutionTime,
            p4incidentResolutionTime,
          },
        }
      );
    }
  }
  async getIncidentResolutionTimes(id) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let {
        p1incidentResolutionTime,
        p2incidentResolutionTime,
        p3incidentResolutionTime,
        p4incidentResolutionTime,
      } = organisation;
      return {
        p1incidentResolutionTime,
        p2incidentResolutionTime,
        p3incidentResolutionTime,
        p4incidentResolutionTime,
      };
    }
  }

  async updateLogo(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let updatedOrganization = await this.Organisation.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "logo.metadata": data,
            "logo.src": process.env.PUBLIC_RESOURCE_BASE_URL + "/" + data.Key,
          },
        },
        { new: true }
      );
      return updatedOrganization;
    }
  }
  async updateLogoRectangle(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let updatedOrganization = await this.Organisation.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            logoRectangleMeta: data,
            logoRectangleSrc:
              process.env.PUBLIC_RESOURCE_BASE_URL + "/" + data.Key,
          },
        },
        { new: true }
      );
      return updatedOrganization;
    }
  }

  async removeOrganisation(id) {}
  async getLicenses(id) {
    const organisation = await this.getOrganisation(id);
    return organisation.licenses;
  }
  async getSystemDates(id) {
    const organisation = await this.getOrganisation(id);
    return organisation.systemDate;
  }
  async updateSystemDates(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let { start, end } = data;
      let { systemDate } = organisation;
      let query = {
        $set: { "systemDate.start": start, "systemDate.end": end },
      };
      if (!systemDate.unset && systemDate.lockedAfter < Date.now())
        return new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "System date update is not allowed now."
        );
      query = systemDate.unset
        ? {
            $set: {
              systemDate: {
                start,
                end,
                unset: false,
                lockedAfter: Date.now() + 86400000 * 7,
              },
            },
          }
        : query;
      await this.Organisation.updateOne({ _id: id }, query);
    }
  }
  async addRreportSubscriber(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let { name, email, interval, issueDate } = data;
      email = email.toLowerCase();
      let isExisting = await this.Organisation.findOne({
        "reportSubscriptions.email": email,
      });
      if (isExisting)
        new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          `${email} is already in use.`
        );
      let { reportSubscriptions } = await this.Organisation.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            reportSubscriptions: {
              name,
              email,
              interval,
              issueDate,
              nextDate: issueDate,
            },
          },
        },
        { new: true }
      ).select("reportSubscriptions");
      let subscriber = reportSubscriptions.find((user) => user.email === email);
      return subscriber;
    }
  }
  async getRreportSubscribers(id) {
    const organisation = await this.getOrganisation(id);
    return organisation.reportSubscriptions;
  }
  async updateRreportSubscriber(id) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
    }
  }
  async removeRreportSubscriber(id, data) {
    const organisation = await this.getOrganisation(id);
    if (organisation) {
      let { subscription_id } = data;
      await this.Organisation.findOneAndUpdate(
        { "reportSubscriptions._id": subscription_id },
        {
          $pull: { reportSubscriptions: { _id: subscription_id } },
        },
        { new: true }
      );
    }
  }
  async becomeACustomer(id, licenses) {
    let organization = await this.getOrganisation(id);
    let payment = new PaymentService(this.connection);
    /** we are retriving a membership to ensure user is a super admin of this org */
    if (id !== this.connection.user.organizationId)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "You don't have permission to go live for this organization."
      );
    /**
     * we are not taking it from paramter to ensure security by using users token data.
     */
    if (organization.isCustomer)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This organisation has already an iMS Setup."
      );
    organization.licenses.groups.allocated = licenses.groups;
    organization.licenses.users.allocated = licenses.users;
    organization.licenses.superUser.allocated = licenses.superUser;
    organization.licenses.complianceTools = licenses.complianceTools;
    organization.licenses.additionalModules = licenses.additionalModules;
    organization.licenses.carbocalc = licenses.carbocalc || false;
    organization.licenses.imsforms = licenses.imsforms || false;
    organization.licenses.go2ero = licenses.go2ero || false;
    organization.licenses.projectims = licenses.projectims || false;
    organization.isCustomer = true;
    organization.paymentSystem.type = licenses.paymentType;
    organization.systemDate.start = Date.now();
    organization.systemDate.end = Date.now() + 86400000 * 365;
    organization = await organization.save();
    let { start, end } = organization.systemDate;
    await this.Dashboard.create({
      organization: organization._id,
      systemDate: {
        start,
        end,
      },
    });
    const complaince = new ComplianceToolCRUDOps(this.connection);
    for (let toolName of licenses.complianceTools) {
      await complaince.createComplianceTool({ name: toolName });
    }
    if (process.env.NODE_ENV === "production") {
      const bucketName =
        this.connection?.user?.organizationId + process.env.AWS_BUCKET_NAME;
      const createBucket = new CreateBucketCommand({
        Bucket: bucketName,
      });
      const { Location } = await s3Client.send(createBucket);
      logger.info(`Bucket created with location ${Location}`);
      const updateCorsSettings = new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["HEAD", "GET", "PUT"],
              AllowedOrigins: [
                process.env.CLIENT_URL,
                "https://view.officeapps.live.com",
                "https://projects.imssystems.tech",
                "https://gozerocalculator.com",
                "https://app.carbo-calc.com",
                "https://accounts.imssystems.tech",
                "https://forms.imssystems.tech",
              ],
              ExposeHeaders: ["ETag", "x-amz-meta-custom-header"],
            },
          ],
        },
      });
      logger.info("updating cors settings");
      await s3Client.send(updateCorsSettings);
      const tagBucket = new PutBucketTaggingCommand({
        Bucket: bucketName,
        Tagging: {
          TagSet: [
            {
              Key: "organisation-name",
              Value: this.connection?.user?.organizationName,
            },
            {
              Key: "organisation-id",
              Value: this.connection?.user?.organizationId,
            },
          ],
        },
      });
      await s3Client.send(tagBucket);
    }

    let paymentSession = null;
    if (licenses.paymentType === PAYMENT_METHODS.CARD) {
      paymentSession = await this.payWithCard(organization._id.toString());
    }
    if (licenses.paymentType === PAYMENT_METHODS.MONTHLY_INVOICE) {
      /**
       * we are subscribing the organisation because they will be invoiced.
       * if they decide to pay with card two months down the line this will prevent th system from
       * asking for complinace payment as they they should only pay for subscriptions going forward.
       */
      organization.paymentSystem.status = PAYMENT_STATUS.SUBSCRIBED;
      await organization.save();
      await sendMail(
        "new-customer-signup",
        [process.env.SUPPORT_MAIL, process.env.ACCOUNTS_MAIL],
        {
          user: this.connection.user,
          licenses,
          organization,
        }
      );
    }
    await sendMail("onboard-success", this.connection.user.email, {
      attachments: [
        {
          filename: "ims-systems-adoption-pack.pptx",
          path: "./src/assets/pdfs/ims-systems-adoption-pack.pptx",
        },
        {
          filename: "service-charter.pdf",
          path: "./src/assets/pdfs/service-charter.pdf",
        },
      ],
    });
    return { paymentSession, organization };
  }
  async payWithCard(id) {
    let organization = await this.getOrganisation(id);
    let payment = new PaymentService(this.connection);
    /** we are retriving a membership to ensure user is a super admin of this org */
    if (id !== this.connection.user.organizationId)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "You don't have permission to update for this organization."
      );
    /**
     * we are not taking it from paramter to ensure security by using users token data.
     */
    if (!organization.isCustomer)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This organisation has to become a customer first to change method."
      );
    if (organization.paymentSystem.information.stripeSubscriptionId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This organisation already has a subscription running. Please contact support@imssystems.tech for any query."
      );

    const istrialorg =
      organization.paymentSystem.status === PAYMENT_STATUS.TRIAL;

    const licenses = {
      groups: organization.licenses.groups.allocated,
      users: organization.licenses.users.allocated,
      superUser: organization.licenses.superUser.allocated,
      complianceTools: istrialorg ? organization.licenses.complianceTools : [],
      additionalModules: istrialorg
        ? organization.licenses.additionalModules
        : [],
    };
    organization.paymentSystem.type = PAYMENT_METHODS.CARD;
    organization = await organization.save();
    let paymentSession = await payment.getCheckoutSessionForOrg(
      organization._id.toString(),
      licenses
    );
    return paymentSession;
  }
  async getBillingSession(id) {
    let payment = new PaymentService(this.connection);
    let organization = await this.getOrganisation(id);
    if (id !== this.connection.user.organizationId)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "You don't have permission to update for this organization."
      );
    /**
     * we are not taking it from paramter to ensure security by using users token data.
     */
    if (!organization.isCustomer)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This organisation has to become a customer first to change method."
      );
    return payment.createBillingPortalSessionForOrg(
      organization._id.toString()
    );
  }
  async refreshSystemDates(id) {
    const organisation = await this.Organisation.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          systemDate: {
            start: Date.now(),
            end: Date.now() + 86400000 * 365,
            unset: true,
          },
        },
      },
      { new: true }
    );
    console.log(organisation._id);
    let { start, end } = organisation.systemDate;
    let [groups, groupsError] = await asyncWrapper(() => this.Groups.find({}));
    if (groupsError) return [groups, groupsError];
    await Promise.all(
      groups.map((group) =>
        asyncWrapper(() =>
          this.GroupDashboard.create({
            group: group._id,
            groupName: group.name,
            systemDate: {
              start,
              end,
            },
          })
        )
      )
    );
    return asyncWrapper(() =>
      this.Dashboard.create({
        organization: organisation._id,
        systemDate: {
          start,
          end,
        },
      })
    );
  }
  async auth(id, data) {
    const membershipService = new Membership();
    const membership = await membershipService.getMembership({
      invitedUserId: data.invitedUserId,
      organization: id,
    });
    if (membership) {
      const payload = {
        _id: membership._id,
        invitedUserId: membership.invitedUserId,
        organization: membership.organization,
        role: membership.role,
      };
      let token = await Token.signToken(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 30 * 24 * 60 * 60 } // 30 days
      );
      return {
        orgAccessToken: token,
      };
    }
  }
  async alertOrganisationForPayment(id) {
    const organization = await this.getOrganisation(id);
    const memberships = await this.Membership.find({
      organization: id,
      role: ROLES.SUPER_ADMIN,
    }).populate([
      {
        path: "invitedUserId",
        select: "name email profileImageSrc",
      },
    ]);
    await sendMail(
      "org-account-past-due",
      [
        ...memberships.map((m) => {
          return m.invitedUserId.email;
        }),
      ],
      {
        organizationName: organization.name,
        orgProfileLink: process.env.CLIENT_URL + "/admin/organisation",
      }
    );
  }
  async blockOrganisation(id) {
    const organization = await this.getOrganisation(id);
    organization.status = ORGANISATTION_STATUS.BLOCKED;
    await organization.save();
    const memberships = await this.Membership.find({
      organization: id,
      role: ROLES.SUPER_ADMIN,
    }).populate([
      {
        path: "invitedUserId",
        select: "name email profileImageSrc",
      },
    ]);
    await sendMail(
      "org-account-blocked",
      [
        ...memberships.map((m) => {
          return m.invitedUserId.email;
        }),
      ],
      {
        organizationName: organization.name,
        orgProfileLink: process.env.CLIENT_URL + "/admin/organisation",
      }
    );
    return organization;
  }
  async reactivateOrganisation(id) {
    const organization = await this.getOrganisation(id);
    organization.status = ORGANISATTION_STATUS.ACTIVE;
    const memberships = await this.Membership.find({
      organization: id,
      role: ROLES.SUPER_ADMIN,
    }).populate([
      {
        path: "invitedUserId",
        select: "name email profileImageSrc",
      },
    ]);
    await sendMail(
      "org-account-reactivated",
      [
        ...memberships.map((m) => {
          return m.invitedUserId.email;
        }),
      ],
      {
        organizationName: organization.name,
      }
    );
    return organization.save();
  }
}

module.exports = OrganisationService;
