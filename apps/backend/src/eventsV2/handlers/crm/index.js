const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.CUSTOMER_STAGE_CHANGED_EVENT)
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
            $or: [
              {
                invitedUserId: {
                  $in: [
                    data.payload?.customer?.accountManager._id,
                    data.payload?.customer?.created.by._id,
                  ],
                },
              },
              {
                role: ROLES.HEAD_OF_SERVICE,
              },
            ],
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "CRM",
                  message: `${data.payload?.customer?.updated.by.name} has changed ${data.payload?.customer?.reference} ${data.payload?.customer?.name}'s Organisation profile from ${data?.payload?.oldCustomer?.stage} to ${data.payload?.customer?.stage}`,
                  group: data.payload?.customer?.group?._id,
                  referenceType: "customers",
                  referenceModule: data.payload?.customer?._id,
                  screenIdentifier: "customer-detail",
                  params: {
                    id: data.payload?.customer?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.customer?.updated.by._id,
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
    .topic(SERVER_EVENTS_BUS.CUSTOMER_STATUS_CHANGED_EVENT)
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
            $or: [
              {
                invitedUserId: {
                  $in: [
                    data.payload?.customer?.accountManager._id,
                    data.payload?.customer?.created.by._id,
                  ],
                },
              },
              {
                role: ROLES.HEAD_OF_SERVICE,
              },
            ],
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "CRM",
                  message: `${data.payload?.customer?.updated.by.name} has changed ${data.payload?.customer?.reference} ${data.payload?.customer?.name}'s Status from ${data?.payload?.oldCustomer?.status} to ${data.payload?.customer?.status}`,
                  group: data.payload?.customer?.group?._id,
                  referenceType: "customers",
                  referenceModule: data.payload?.customer?._id,
                  screenIdentifier: "customer-detail",
                  params: {
                    id: data.payload?.customer?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.customer?.updated.by._id,
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
    .topic(SERVER_EVENTS_BUS.CUSTOMER_NEW_ACCOUNT_MANAGER_EVENT)
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
            invitedUserId: data.payload?.customer?.accountManager._id,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "CRM",
                  message: `You have been assigned ${data.payload?.customer?.reference} ${data.payload?.customer?.name} by ${data.payload?.customer?.updated.by.name}, the previous owner was ${data.payload?.oldCustomer?.accountManager.name}`,
                  group: data.payload?.customer?.group?._id,
                  referenceType: "customers",
                  referenceModule: data.payload?.customer?._id,
                  screenIdentifier: "customer-detail",
                  params: {
                    id: data.payload?.customer?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.customer?.updated.by._id,
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
   * crm/invoices
   */

  mainChannel
    .topic(SERVER_EVENTS_BUS.SEND_INVOICE_EVENT)
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
            invitedUserId: data?.payload?.invoice?.customer.accountManager._id,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Invoice",
                  message: `${data.payload?.invoice?.updated.by.name} has sent ${data.payload?.invoice?.reference} to ${data.payload?.invoice?.customer.primaryContact} from ${data.payload?.invoice?.customer.reference} ${data.payload?.invoice?.customer.name}`,
                  group: null,
                  referenceType: "invoices",
                  referenceModule: data.payload?.invoice?._id,
                  screenIdentifier: "invoice-detail",
                  params: {
                    id: data.payload?.invoice?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/invoice-sent.png",
                  createdBy: data.payload?.invoice?.updated.by._id,
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
    .topic(SERVER_EVENTS_BUS.INVOICE_PAYMENT_COMPLETE_EVENT)
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
            invitedUserId: data?.payload?.invoice?.customer.accountManager._id,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Invoice",
                  message: `${data.payload?.invoice?.updated.by.name} has marked ${data.payload?.invoice?.reference} as paid in ${data.payload?.invoice?.customer.reference} ${data.payload?.invoice?.customer.name}`,
                  group: null,
                  referenceType: "invoices",
                  referenceModule: data.payload?.invoice?._id,
                  screenIdentifier: "invoice-detail",
                  params: {
                    id: data.payload?.invoice?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.invoice?.updated.by._id,
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
    .topic(SERVER_EVENTS_BUS.NEW_INVOICE_EVENT)
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
            invitedUserId: data?.payload?.invoice?.customer.accountManager._id,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Invoice",
                  message: `${data.payload?.invoice?.created.by.name} has created ${data.payload?.invoice?.reference} in ${data.payload?.invoice?.customer.reference} ${data.payload?.invoice?.customer.name}`,
                  group: null,
                  referenceType: "invoices",
                  referenceModule: data.payload?.invoice?._id,
                  screenIdentifier: "invoice-detail",
                  params: {
                    id: data.payload?.invoice?._id,
                  },
                  user: user,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.invoice?.created.by._id,
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
}

module.exports = { register };
