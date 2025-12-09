const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const ActivityService = require("../../../services/activity");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const imsProject = require("../../../models/mongodb/system/imsProject/imsProjects");
const { SERVER_EVENTS } = require("../../../events/constants");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_REPOSITORY_OWNER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository: data.payload?.repository?._id,
        });
        let users = data.payload?.repository?.owners;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message: `You have been assigned as the owner of ${
                    data.payload?.repository?.reference
                  } ${data.payload?.repository?.name}${
                    data.payload?.repository?.owners?._id?.toString() ===
                    data.payload?.repository?.created?.by?._id?.toString()
                      ? "."
                      : ` by ${data.payload?.repository?.created.by.name}.`
                  }`,
                  group:
                    data.payload?.repository?.group &&
                    data.payload?.repository?.group?._id,
                  referenceType: "documentrepositories",
                  referenceModule: data.payload?.repository?._id,
                  screenIdentifier: "document-management-detail",
                  params: {
                    projectId: relatedProject?._id || null,
                    group:
                      data.payload?.repository?.group &&
                      data.payload?.repository?.group?._id,
                    id: data.payload?.repository?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.repository?.created.by?._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.DOCUMENT_REVISION_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = data?.payload?.document?.documentData?.authorisation?.map(
          (a) => a.user
        );
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository:
            data?.payload?.document?.repository?._id ||
            data?.payload?.document?.repository,
        });
        let message = `${data?.payload?.document?.created?.by?.name} uploaded a revised version of ${data?.payload?.document?.reference} ${data?.payload?.document?.name}.`;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message,
                  group: null,
                  referenceType: "documenttrees",
                  referenceModule: data?.payload?.document?._id,
                  screenIdentifier: "document-version-detail",
                  params: {
                    id:
                      data?.payload?.document?.repository?._id ||
                      data?.payload?.document?.repository,
                    nodeId: data?.payload?.document?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/document-uploaded.png",
                  createdBy: data?.payload?.document?.created?.by._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.SHARE_REPOSITORY_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = data.payload?.users || [];

        let message = `${data.payload?.repository?.owners.name} has shared repository ${data.payload?.repository?.reference} ${data.payload?.repository?.name} with you.`;
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository: data.payload?.repository?._id,
        });
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message,
                  group:
                    data.payload?.group && data.payload?.repository?.group?._id,
                  referenceType: "documentrepositories",
                  referenceModule: data.payload?.repository?._id,
                  screenIdentifier: "document-management-detail",
                  params: {
                    group:
                      data.payload?.repository?.group &&
                      data.payload?.repository?.group?._id,
                    id: data.payload?.repository?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.repository?.created.by._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_AUTHORISE_FOR_DOCUMENT_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository: data.payload?.repository?._id,
        });
        let users = data.payload?.users || [];
        let message = `${data?.payload?.document?.created?.by?.name} sent you ${data?.payload?.document?.reference} ${data.payload?.document.name} in ${data.payload?.repository?.reference} ${data.payload?.repository?.name} to authorise.`;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document authorisation",
                  message,
                  group:
                    data?.payload?.repository?.group?._id ||
                    data.payload?.group,
                  referenceType: "documenttrees",
                  referenceModule: data.payload?.document?._id,
                  screenIdentifier: "document-version-detail",
                  params: {
                    id: data?.payload?.repository?._id,
                    nodeId: data?.payload?.document?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data?.payload?.repository?.owners?._id,
                },
                { email: true }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_SIGNATURE_FOR_DOCUMENT_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository: data.payload?.repository?._id,
        });
        let users = data.payload?.users || [];
        let message = `${data?.payload?.document?.created?.by?.name} sent you ${data?.payload?.document?.reference} ${data.payload?.document.name} in ${data?.payload?.repository?.reference} ${data?.payload?.repository?.name} to sign.`;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message,
                  group:
                    data?.payload?.repository?.group?._id ||
                    data?.payload?.repository?.group,
                  referenceType: "documenttrees",
                  referenceModule: data.payload?.document?._id,
                  screenIdentifier: "document-version-detail",
                  params: {
                    id: data?.payload?.repository?._id,
                    nodeId: data?.payload?.document?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data?.payload?.repository?.owners?._id,
                },
                { email: true }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.DOCUMENT_AUTHORISE_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            invitedUserId: {
              $in: [
                data?.payload?.document?.created?.by?._id,
                ...data?.payload?.document?.repository?.owners,
              ],
            },
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository: data?.payload?.document?.repository?._id,
        });
        let message = `${
          data?.payload?.handledAuthorisation?.user?.name
        } has ${data.payload?.handledAuthorisation?.status?.toLowerCase()} ${
          data?.payload?.document?.reference
        } ${data?.payload?.document?.name}.`;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message,
                  group:
                    data?.payload?.document?.group?._id || data?.payload?.group,
                  referenceType: "documenttrees",
                  referenceModule: data.payload?.document?._id,
                  screenIdentifier: "document-version-detail",
                  params: {
                    id: data?.payload?.document?.repository?._id,
                    nodeId: data?.payload?.document?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/document-authorised.png",
                  createdBy: data.payload?.accessControl?.user?._id,
                },
                { email: true }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.DOCUMENT_SIGNED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository:
            data.payload?.document?.repository?._id ||
            data.payload?.document?.repository,
        });
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            invitedUserId: {
              $in: [
                ...data?.payload?.document?.repository?.owners,
                data.payload?.document?.created?.by?._id,
              ],
            },
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        let message = `${data?.payload?.handledAuthorisation?.user?.name} has signed ${data?.payload?.document?.reference} ${data.payload?.document?.name} in ${data.payload?.document?.repository?.reference} ${data.payload?.document?.repository?.name}.`;

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message,
                  group: null,
                  referenceType: "documenttrees",
                  referenceModule: data.payload?.document?._id,
                  screenIdentifier: "document-version-detail",
                  params: {
                    id:
                      data.payload?.document?.repository?._id ||
                      data.payload?.document?.repository,
                    nodeId: data?.payload?.document?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/document-signed.png",
                  createdBy: data.payload?.accessControl?.user?.organizationId,
                },
                { email: true }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.DOCUMENT_FULL_CONFORMANCE_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        let ImsProject = imsProject(data.payload?.accessControl);
        let relatedProject = await ImsProject.findOne({
          repository: data?.payload?.document?.repository?._id,
        });
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            invitedUserId: {
              $in: [
                data?.payload?.document?.created?.by?._id,
                ...data?.payload?.document?.repository?.owners,
              ],
            },
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        let message = `${data?.payload?.document?.reference} ${data?.payload?.document?.name} has reached 100% compliance.`;

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Document management",
                  message,
                  group: data?.payload?.group?._id || data.payload?.group,
                  referenceType: "documenttrees",
                  referenceModule: data.payload?.document?._id,
                  screenIdentifier: "document-version-detail",
                  params: {
                    id: data?.payload?.document?.repository?._id,
                    nodeId: data?.payload?.document?._id,
                    projectId: relatedProject?._id || null,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/goal.png",
                  createdBy: data?.payload?.document?.created?.by?._id,
                },
                { email: true }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  /**
   * Activity
   *
   */

  mainChannel
    .topic(SERVER_EVENTS.DOCUMENT_AUTH_REVIEWED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-authorised.png`,
          moduleId: data.payload?.document?._id,
          value: `${
            data?.payload?.authorisation?.user?.name
          } ${data?.payload?.authorisation?.status?.toLowerCase()} authorisation request.`,
          extraLogs: [
            {
              title: "Authorisation notes",
              description: `
  ${data.message}
  `,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            },
          ],
          metaInfo: {
            threadId: data.payload?.document?.documentData?.threadId,
          },
          createdBy: data?.payload?.authorisation?.user?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.DOCUMENT_AUTHORISATION_REQUESTD)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          moduleId: data?.payload?.document?._id,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          value: `${
            data?.payload?.createdBy?.name
          } requested authorisation from ${users.join(",")}.`,
          metaInfo: {
            threadId: data?.payload?.document?.documentData?.threadId,
          },
          createdBy: data?.payload?.createdBy?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.DOCUMENT_CONFORMANCE_MILESTONE)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
          moduleId: data.payload?.document?._id,
          metaInfo: {
            threadId: data.payload?.document?.documentData?.threadId,
          },
          value: `This document has reached 100% conformance.`,
          createdBy: data.payload?.document?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel
    .topic(SERVER_EVENTS.ADDED_REVISED_DOCUMENT)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data?.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
          moduleId: data?.payload?.document?._id,
          metaInfo: {
            threadId: data?.payload?.document?.documentData?.threadId,
          },
          value: `${data?.payload?.document?.created?.by?.name} added a revised version.`,
          createdBy: data?.payload?.document?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.DOCUMENT_SHARED_VIA_EMAIL)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data?.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
          moduleId: data.payload?.document?._id,
          value: `${
            data?.payload?.sender?.name
          } shared this document with ${data?.payload?.emails.join(", ")}.`,
          extraLogs: [
            {
              title: "Message",
              description: `
  
  ${data?.payload?.message}
  
  `,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            },
          ],
          metaInfo: {
            threadId: data?.payload?.document?.documentData?.threadId,
          },
          createdBy: data?.payload?.sender?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel.topic(SERVER_EVENTS.DOCUMENT_SIGNED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data?.payload?.accessControl);
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-signed.png`,
        moduleId: data.payload?.document?._id,
        value: `${data?.payload?.signee} signed this document.`,
        metaInfo: {
          threadId: data?.payload?.document?.documentData?.threadId,
        },
        createdBy: null,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });
  mainChannel
    .topic(SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data?.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
          moduleId: data.payload?.document?._id,
          value: `${data.payload?.createdBy?.name} has published version ${data.payload?.document?.documentData?.dvID}.`,
          metaInfo: {
            threadId: data.payload?.document?.documentData?.threadId,
          },
          createdBy: data.payload?.createdBy?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data?.payload?.accessControl
        );
        const externalUsersLog = data.payload?.emails?.length
          ? [
              {
                title:
                  "List of external individuals who this document was sent to",
                description: `
${data.payload?.emails.map((email, i) => `${i + 1}. ${email}`).join("\n")}

`,
                icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
                image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              },
            ]
          : [];
        const internalUsersLog = data.payload?.users?.length
          ? [
              {
                title: "List of internal users who this document was sent to",
                description: `
${data.payload?.users
  .map((user, i) => `${i + 1}. ${user.name} (${user.email})`)
  .join("\n")}

`,
                icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
                image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              },
            ]
          : [];
        const messageLog = data.payload?.message
          ? [
              {
                title: `Message sent by ${data.payload?.createdBy?.name}`,
                description: `
${data.payload?.message}

`,
                icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
                image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              },
            ]
          : [];

        await activityService.createActivity({
          moduleType: "documenttrees",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          moduleId: data.payload?.document?._id,
          value: `${data.payload?.createdBy?.name} sent this document to ${data.payload?.signatureType} individuals for signature.`,
          extraLogs: [...messageLog, ...internalUsersLog, ...externalUsersLog],
          metaInfo: {
            threadId: data.payload?.document?.documentData?.threadId,
          },
          createdBy: data.payload?.createdBy?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
