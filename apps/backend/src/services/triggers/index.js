const moment = require("moment");
const { asynchronously } = require("../utility");
const {
  IMS_POLICIES,
  ROLES,
} = require("@ims-systems-00/ims-core/lib/constants");
const UserModel = require("../../models/mongodb/system/users&auth/user");
const IamGroupModel = require("../../models/mongodb/system/ourIms/iamGroup");
const IamRoleModel = require("../../models/mongodb/system/ourIms/iamRole");
const NotificationService = require("../notification");
const { sendMail } = require("../../email/sendMail");
const { moduleToScreenMap } = require("./moduleToScreenMap");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { models } = require("../../models");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];
class Trigger {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
    this.Membership = models.memberships(connection);
    this.IamGroup = IamGroupModel(connection);
    this.IamRole = IamRoleModel(connection);
  }
  _buildNotification(eventName, data, options) {
    return new Promise((resolve, reject) => {
      let dataSets = [];
      let events = {
        /**
         * Do not use es6 function declearation, in this block
         */

        /**
         * risks
         */
        nudgeToLookAtRisk: async (data) => {
          try {
            let users = await this.User.find({
              _id: data?.owner,
            }).select("name email");
            let notification = {
              title: "Risk management",
              message: `${data.nudged.by.name} nudged you to look at ${data.type} risk ${data.reference} ${data.title}`,
              group: null,
              referenceType: "risks",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/nudge-notification.png",
              params: {
                group: null,
                id: data._id,
              },
              screenIdentifier: `risk-management-detail`,
              createdBy: data.nudged.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        escalateRiskEvent: async (data) => {
          try {
            {
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.SUPER_ADMIN,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              let notification = {
                title: "Risk management",
                message: `${data.escalated.by.name} has escalated ${
                  data.type
                } risk ${data.reference} ${data.title} to you${
                  data.group ? ` from ${data.group?.name}` : ""
                }.`,
                group: data.group?._id,
                referenceType: "risks",
                referenceModule: data._id,
                icon: notificationIconUrl + "/escalated.png",
                audiences: users,
                popUpStatus: "unread",
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                screenIdentifier: `risk-management-detail`,
                createdBy: data.escalated.by._id,
              };
              dataSets.push(notification);
            }
            {
              // saving hos notifications ...
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.HEAD_OF_SERVICE,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              if (users.length) {
                let notification = {
                  title: "Risk management",
                  message: `${data.escalated.by.name} has escalated ${
                    data.type
                  } risk ${data.reference} ${data.title}${
                    data.group ? ` from ${data.group?.name}` : ""
                  }.`,
                  group: data.group?._id,
                  referenceType: "risks",
                  referenceModule: data._id,
                  audiences: users,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/escalated.png",
                  params: {
                    group: data.group?._id,
                    id: data._id,
                  },
                  screenIdentifier: `risk-management-detail`,
                  createdBy: data.escalated.by._id,
                };
                dataSets.push(notification);
              }
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newRiskOwnerEvent: async (data) => {
          try {
            let users = [data.owner];
            let notification = {
              title: "Risk management",
              message: `${data.type} risk ${data.reference} ${data.title} has been assigned to you by ${data.created.by.name}`,
              group: null,
              referenceType: "risks",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/risk-assigned.png",
              params: {
                id: data._id,
              },
              screenIdentifier: `risk-management-detail`,
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        mitigateRiskEvent: async (data) => {
          try {
            {
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.SUPER_ADMIN,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              let notification = {
                title: "Risk management",
                message: `${data.type} risk ${data.reference} ${
                  data.title
                } has been mitigated by ${data.mitigated.by.name}${
                  data.group?.name ? ` in ${data.group?.name}` : ""
                }.`,
                group: data.group?._id,
                referenceType: "risks",
                referenceModule: data._id,
                audiences: users,
                popUpStatus: "unread",
                icon: notificationIconUrl + "/mitigated.png",
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                screenIdentifier: `risk-management-detail`,
                createdBy: data.mitigated.by._id,
              };
              dataSets.push(notification);
            }
            {
              // saving hos notifications ...
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.HEAD_OF_SERVICE,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              if (users.length) {
                let notification = {
                  title: "Risk management",
                  message: `${data.type} risk ${data.reference} ${data.title} has been mitigated by ${data.mitigated.by.name}.`,
                  group: data.group?._id,
                  referenceType: "risks",
                  referenceModule: data._id,
                  audiences: users,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.group?._id,
                    id: data._id,
                  },
                  screenIdentifier: `risk-management-detail`,
                  createdBy: data.mitigated.by._id,
                };
                dataSets.push(notification);
              }
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * incidents
         */
        nudgeToLookAtIncident: async (data) => {
          try {
            let users = await this.User.find({
              _id: data?.owner,
            }).select("name email");
            let notification = {
              title: "Incident management",
              message: `${data.nudged.by.name} nudged you to look at incident ${data.reference} ${data.title}`,
              group: null,
              referenceType: "incidents",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/nudge-notification.png",
              params: {
                group: null,
                id: data._id,
              },
              screenIdentifier: `incident-management-detail`,
              createdBy: data.nudged.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newIncidentOwnerEvent: async (data) => {
          try {
            let users = [data.owner];
            let notification = {
              title: "Incident management",
              message: `Incident ${data.reference} ${data.title} has been assigned to you by ${data.created.by.name}`,
              group: data.group?._id,
              referenceType: "incidents",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/incident-assigned.png",
              params: {
                group: data.group?._id,
                id: data._id,
              },
              screenIdentifier: "incident-management-detail",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        escalateIncidentEvent: async (data) => {
          try {
            {
              // saving super admin notifications ...
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.SUPER_ADMIN,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              let notification = {
                title: "Incident management",
                message: `${data.escalated.by.name} has escalated incident ${
                  data.reference
                } ${data.title} to you${
                  data.group?.name ? ` from ${data.group?.name}` : ""
                }.`,
                group: data.group?._id,
                referenceType: "incidents",
                referenceModule: data._id,
                audiences: users,
                popUpStatus: "unread",
                icon: notificationIconUrl + "/escalated.png",
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                screenIdentifier: "incident-management-detail",
                createdBy: data.escalated.by._id,
              };
              dataSets.push(notification);
            }
            {
              // saving hos notifications ...
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.HEAD_OF_SERVICE,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              if (users.length) {
                let notification = {
                  title: "Incident management",
                  message: `${data.escalated.by.name} has escalated incident ${
                    data.reference
                  } ${data.title}${
                    data.group?.name ? ` from ${data.group?.name}` : ""
                  }.`,
                  group: data.group?._id,
                  referenceType: "incidents",
                  referenceModule: data._id,
                  audiences: users,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/escalated.png",
                  params: {
                    group: data.group?._id,
                    id: data._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.escalated.by._id,
                };
                dataSets.push(notification);
              }
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        resolveIncidentEvent: async (data) => {
          try {
            {
              // saving super admin notifications ...
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.SUPER_ADMIN,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              let notification = {
                title: "Incident management",
                message: `${data.reference} ${
                  data.title
                } has been resolved by ${data.resolved.by.name}${
                  data.group?.name ? ` in ${data.group?.name}` : ""
                }.`,
                group: data.group?._id,
                referenceType: "incidents",
                referenceModule: data._id,
                audiences: users,
                popUpStatus: "unread",
                icon: notificationIconUrl + "/notification-default.png",
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                screenIdentifier: "incident-management-detail",
                createdBy: data.resolved.by._id,
              };
              dataSets.push(notification);
            }
            {
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  $or: [
                    { role: ROLES.HEAD_OF_SERVICE },
                    {
                      invitedUserId: {
                        $in: [data.created.by?._id, data.owner?._id],
                      },
                    },
                  ],
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              if (users.length) {
                let notification = {
                  title: "Incident management",
                  message: `${data.reference} ${data.title} has been resolved by ${data.resolved.by.name}`,
                  group: data.group?._id,
                  referenceType: "incidents",
                  referenceModule: data._id,
                  audiences: users,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.group?._id,
                    id: data._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.resolved.by._id,
                };
                dataSets.push(notification);
              }
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newAuditEvent: async (data) => {
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
          try {
            let message = `${
              data.group?.name || this.connection?.user?.organizationName
            } has been scheduled in for ${data.reference} ${
              data.title
            } ${data.type.toLowerCase()} audit on ${moment(
              data.startDate
            ).format("D/M/Y")} ${data.time}`;
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              membershipQuery
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "Audit",
              message,
              group: data.group?._id,
              referenceType: "audits",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              params: {
                group: data.group?._id,
                id: data._id,
              },
              screenIdentifier: !data.isExternal
                ? "internal-audit-detail"
                : "external-audit-detail",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (ex) {
            logger.info(ex);
            reject(ex);
          }
        },
        /**
         * management review
         */
        notifyAttendeeds: async (data) => {
          try {
            // saving attendees notifications ...
            let notification = {
              title: "Management review",
              message: `You have a management review ${data.reference} ${
                data.title
              } on ${moment(data.date).format("D/M/Y")} `,
              group: null,
              referenceType: "managementreviews",
              referenceModule: data._id,
              audiences: data.attendees,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              params: {
                group: null,
                id: data._id,
              },
              screenIdentifier: "management-review-detail",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (ex) {
            logger.info(ex);
            reject(ex);
          }
        },
        newManagementReviewEvent: async (data) => {
          try {
            if (data.privacy === "Organisational") {
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.SUPER_ADMIN,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              let notification = {
                title: "Management review",
                message: `You have a management review ${data.reference} ${
                  data.title
                } on ${moment(data.date).format("D/M/Y")} `,
                group: null,
                referenceType: "managementreviews",
                referenceModule: data._id,
                audiences: users,
                popUpStatus: "read",
                icon: notificationIconUrl + "/notification-default.png",
                params: {
                  group: null,
                  id: data._id,
                },
                screenIdentifier: "management-review-detail",
                createdBy: data.created.by._id,
              };
              dataSets.push(notification);
            }
            if (data.privacy === "Business unit" && data.group) {
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.HEAD_OF_SERVICE,
                  groups: data.group?._id,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              if (users.length) {
                let notification = {
                  title: "Management review",
                  message: `You have a management review ${data.reference} ${
                    data.title
                  } on ${moment(data.date).format("D/M/Y")} `,
                  group: null,
                  referenceType: "managementreviews",
                  referenceModule: data._id,
                  audiences: data.attendees,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: null,
                    id: data._id,
                  },
                  screenIdentifier: "management-review-detail",
                  createdBy: data.created.by._id,
                };
                dataSets.push(notification);
              }
            }
            resolve(dataSets);
          } catch (ex) {
            logger.info(ex);
            reject(dataSets);
          }
        },
        /**
         * kpi/objectives
         */
        newKpiEvent: async (data) => {
          try {
            if (!data.group) return;
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                role: ROLES.HEAD_OF_SERVICE,
                groups: data.group?._id,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            if (!users.length) return;
            let notification = {
              title: "New KPI/Objectives",
              message: `A new kpi has been assigned to ${data.group?.name}`,
              group: data.group?._id,
              referenceType: "kpiobjectives",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              params: {
                group: data.group?._id,
                id: data._id,
              },
              screenIdentifier: "kpi-objective",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * licenseRequests
         */
        newLicenseRequestEvent: async (data) => {
          try {
            // saving super admin notifications ...
            let superAdminGroup = await this.IamGroup.findOne({
              name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION,
            });
            let users = await this.User.find({
              "accessPolicies.group": superAdminGroup._id,
            });
            let notification = {
              title: "Licence request",
              message: `${data.created.by.name} requested some licences for ${data.group?.name}`,
              group: data.group?._id,
              referenceType: "licenserequests",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              params: {
                group: null,
                id: data._id,
              },
              screenIdentifier: "license-management",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        licenseRequestStatusChanged: async (data) => {
          try {
            let users = [data.created.by];
            let notification = {
              title: "Licence request",
              message: `Licence request ${
                data.reference
              } has been ${data.granted.status.toLowerCase()} by ${
                data.granted.by.name
              }`,
              group: data.group?._id,
              referenceType: "licenserequests",
              referenceModule: data._id,
              screenIdentifier: "license-management",
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              params: {
                group: null,
                id: data._id,
              },
              createdBy: data.granted.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * suppliers
         */
        newSupplierBuyerEvent: async (data) => {
          try {
            let users = [data.buyer];
            let notification = {
              title: "Supplier management",
              message: `You have been assigned as the buyer for supplier ${data.reference} ${data.name}.`,
              group: null,
              referenceType: "suppliers",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              params: {
                id: data._id,
              },
              screenIdentifier: `supplier-management-detail`,
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        compliantSupplierEvent: async (data) => {
          try {
            {
              // saving super admin notifications ...
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.SUPER_ADMIN,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              let notification = {
                title: "Supplier management",
                message: `Supplier ${data.reference} ${
                  data.name
                } has become compliant${
                  data.group?.name ? ` in ${data.group?.name}` : ""
                }.`,
                group: data.group?._id,
                referenceType: "suppliers",
                referenceModule: data._id,
                screenIdentifier: `supplier-management-detail`,
                audiences: users,
                popUpStatus: "read",
                icon: notificationIconUrl + "/notification-default.png",
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                createdBy: data.created.by._id,
              };
              dataSets.push(notification);
            }
            {
              let memberships = await this.Membership.findByOrg(
                this.connection?.user?.organizationId,
                {
                  role: ROLES.HEAD_OF_SERVICE,
                }
              ).populate(membershipPopulation);
              const users = memberships.map((m) => m.invitedUserId);
              if (users.length) {
                let notification = {
                  title: "Supplier management",
                  message: `${data.reference} ${
                    data.name
                  } has become compliant${
                    data.group?.name ? ` in ${data.group?.name}` : ""
                  }.`,
                  group: data.group?._id,
                  referenceType: "suppliers",
                  referenceModule: data._id,
                  screenIdentifier: `supplier-management-detail`,
                  params: {
                    group: data.group?._id,
                    id: data._id,
                  },
                  audiences: users,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.created.by._id,
                };
                dataSets.push(notification);
              }
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        p1IncidentSupplierEvent: async (supplier) => {
          try {
            // saving hos notifications ...
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                role: ROLES.HEAD_OF_SERVICE,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            if (users.length) {
              let notification = {
                title: "Supplier management",
                message: `P1 incident has been added to ${data.reference} ${
                  data.name
                }${data.group?.name ? ` in ${data.group?.name}` : ""}.`,
                group: data.group?._id,
                referenceType: "suppliers",
                referenceModule: data._id,
                screenIdentifier: `supplier-management-detail`,
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                audiences: users,
                popUpStatus: "read",
                icon: notificationIconUrl + "/notification-default.png",
                createdBy: data.created.by._id,
              };
              dataSets.push(notification);
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * tasks
         */
        nudgeToLookAtTask: async (data) => {
          try {
            let assignedTo = data?.assignedTo?.map((assignee) => assignee.user);
            let users = await this.User.find({
              _id: { $in: assignedTo },
            }).select("name email");
            let notification = {
              title: "Task management",
              message: `${data.nudged.by.name} nudged you to look at task ${data.reference} ${data.name}`,
              group: null,
              referenceType: "tasks",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/nudge-notification.png",
              params: {
                group: null,
                id: data._id,
              },
              screenIdentifier: `task-manager-detail`,
              createdBy: data.nudged.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newTaskAssigneeEvent: async ({ task: data, prevTask: prevData }) => {
          // Filter only the new assigned members
          // [popup_refactor] - team only and high priority.
          let users = prevData
            ? data.assignedTo
                .filter(
                  (assignee) =>
                    !prevData.assignedTo
                      .map(
                        (assignee) =>
                          assignee.user && assignee.user._id.toString()
                      )
                      .includes(assignee && assignee.user._id.toString())
                )
                .map((assignee) => assignee.user)
            : data.assignedTo.map((assignee) => assignee.user);
          try {
            // saving user notifications ...
            let notification = {
              title: "Task manager",
              message: `${data.teamTask ? "Team task" : "Task"} ${
                data.reference
              } ${data.name} has been assigned to you by ${
                data.created.by.name
              }.`,
              group: data.group && data.group?._id,
              referenceType: "tasks",
              referenceModule: data._id,
              screenIdentifier: `task-manager-detail`,
              params: {
                group: data.group && data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/task-assigned.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        taskCompletedEvent: async (data) => {
          try {
            // saving Usre notifications ...
            let users = [data.created.by];
            let notification = {
              title: "Task manager",
              message: `Task ${data.reference} ${data.name} has been completed by ${data.completed.by.name}.`,
              group: data.group && data.group?._id,
              referenceType: "tasks",
              referenceModule: data._id,
              screenIdentifier: `task-manager-detail`,
              params: {
                group: data.group && data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/task-completed.png",
              createdBy: data.completed.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        taskRequestStatusChangedEvent: async ({ task: data, userId }) => {
          let assignee = data.assignedTo.find(
            (assignee) =>
              assignee.user &&
              assignee.user._id.toString() === userId.toString()
          );
          if (!assignee) return;
          let users = [data.created.by];
          try {
            // saving Usre notifications ...
            let notification = {
              title: "Task manager",
              message: `${data.reference} ${
                data.name
              } has been ${assignee.acceptance.toLowerCase()} by ${
                assignee.user.name
              }.`,
              group: data.group && data.group?._id,
              referenceType: "tasks",
              referenceModule: data._id,
              screenIdentifier: `task-manager-detail`,
              params: {
                group: data.group && data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: assignee.user && assignee.user._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * cip / ofis
         */
        nudgeToLookAtCip: async (data) => {
          try {
            let users = await this.User.find({
              _id: data?.owner,
            }).select("name email");
            let notification = {
              title: "Opportunity for improvement",
              message: `${data.nudged.by.name} nudged you to look at ${data.reference} ${data.title}`,
              group: null,
              referenceType: "cips",
              referenceModule: data._id,
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/nudge-notification.png",
              params: {
                group: null,
                id: data._id,
              },
              screenIdentifier: `continual-improvement-plan-detail`,
              createdBy: data.nudged.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newOfiOwnerEvent: async (data) => {
          try {
            let users = [data.owner];
            let notification = {
              title: "Opportunity for improvement",
              message: `You have been assigned ${data.reference} ${
                data.title
              } by ${data.created.by.name}${
                data.group?.name ? ` in ${data.group?.name}` : ""
              }.`,
              group: data.group?._id,
              referenceType: "cips",
              referenceModule: data._id,
              screenIdentifier: "continual-improvement-plan-detail",
              params: {
                group: data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        ofiImplementdEvent: async (data) => {
          try {
            // saving hos notifications ...
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                role: ROLES.HEAD_OF_SERVICE,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            if (users.length) {
              let notification = {
                title: "Opportunity for improvement",
                message: `${data.reference} ${
                  data.title
                } has been implmeneted by ${data.implemented.by.name}${
                  data.group?.name ? ` from ${data.group?.name}` : ""
                }.`,
                group: data.group?._id,
                referenceType: "cips",
                referenceModule: data._id,
                screenIdentifier: "continual-improvement-plan-detail",
                params: {
                  group: data.group?._id,
                  id: data._id,
                },
                audiences: users,
                popUpStatus: "unread",
                icon: notificationIconUrl + "/notification-default.png",
                createdBy: data.implemented.by._id,
              };
              dataSets.push(notification);
            }
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * documents
         */
        newRepositoryOwnerEvent: async (data) => {
          try {
            let users = data.owners.map((owner) => owner._id);
            // saving user notifications ...
            let notification = {
              title: "Document management",
              message: `You have been assigned as the owner of ${data.reference} ${data.name}`,
              group: data.group && data.group?._id,
              referenceType: "documentrepositories",
              referenceModule: data._id,
              screenIdentifier: "document-management-detail",
              params: {
                group: data.group && data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            console.log("notification", notification);
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newDocumentVersionEvent: async (data) => {
          try {
            let users = [];
            let memberships = [];
            let message = `${data?.document?.privacy} document ${data?.document?.reference} ${data?.document?.name} has been updated by ${data?.document?.created?.by?.name}, please click to view.`;
            switch (data?.document?.privacy) {
              case "Business unit":
                memberships = await this.Membership.findByOrg(
                  this.connection?.user?.organizationId,
                  {
                    groups: data?.document?.group?._id,
                  }
                ).populate(membershipPopulation);
                users = memberships.map((m) => m.invitedUserId);
                break;
              case "Organisational":
                memberships = await this.Membership.findByOrg(
                  this.connection?.user?.organizationId,
                  {}
                ).populate(membershipPopulation);
                users = memberships.map((m) => m.invitedUserId);
                break;
            }
            let notification = {
              title: "Document management",
              message,
              group: null,
              referenceType: "documentrepositories",
              referenceModule:
                data?.document?.repository?._id || data?.document?.repository,
              screenIdentifier: "document-version-detail",
              params: {
                id:
                  data?.document?.repository?._id || data?.document?.repository,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus:
                data?.document?.privacy === "Organisational"
                  ? "unread"
                  : "read",
              icon: notificationIconUrl + "/document-uploaded.png",
              createdBy: data?.version?.details?.modified?.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
          }
        },
        documentRevisionEvent: async (data) => {
          try {
            let users = data?.document?.documentData?.authorisation?.map(
              (a) => a.user
            );
            let message = `${data?.document?.created?.by?.name} uploaded a revised version of ${data?.document?.reference} ${data?.document?.name}.`;
            let notification = {
              title: "Document management",
              message,
              group: null,
              referenceType: "documenttrees",
              referenceModule: data.document?._id,
              screenIdentifier: "document-version-detail",
              params: {
                id:
                  data?.document?.repository?._id || data?.document?.repository,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/document-uploaded.png",
              createdBy: data?.document?.created?.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
          }
        },
        shareRepositoryEvent: async ({ repository: data, users }) => {
          try {
            users = users || [];
            let message = `A repository ${data.reference} ${data.name} has been shared with you.`;
            let notification = {
              title: "Document management",
              message,
              group: data.group && data.group?._id,
              referenceType: "documentrepositories",
              referenceModule: data._id,
              screenIdentifier: "document-management-detail",
              params: {
                group: data.group && data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newAuthoriserForDocumentEvent: async (data) => {
          try {
            let users = data.users || [];
            let message = `${data?.document?.created?.by?.name} sent you ${data?.document?.reference} ${data.document.name} in ${data.repository?.reference} ${data.repository?.name} to authorise.`;
            let notification = {
              title: "Document authorisation",
              message,
              group: data?.group?._id || data.group,
              referenceType: "documenttrees",
              referenceModule: data._id,
              screenIdentifier: "document-version-detail",
              params: {
                id: data?.repository?._id,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data?.repository?.owner?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newSignatureForDocumentEvent: async (data) => {
          try {
            let users = data.users || [];
            let message = `${data?.document?.created?.by?.name} sent you ${data?.document?.reference} ${data.document.name} in ${data?.repository?.reference} ${data?.repository?.name} to sign.`;
            let notification = {
              title: "Document management",
              message,
              group: data?.repository?.group?._id || data?.repository?.group,
              referenceType: "documenttrees",
              referenceModule: data._id,
              screenIdentifier: "document-version-detail",
              params: {
                id: data?.repository?._id,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data?.repository?.owner?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        documentAuthorisedEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: {
                  $in: [
                    data?.document?.created?.by?._id,
                    data?.document?.repository?.owner,
                  ],
                },
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let message = `${
              data?.handledAuthorisation?.user?.name
            } has ${data.handledAuthorisation?.status?.toLowerCase()} ${
              data?.document?.reference
            } ${data?.document?.name}.`;
            let notification = {
              title: "Document management",
              message,
              group: data?.group?._id || data.group,
              referenceType: "documenttrees",
              referenceModule: data._id,
              screenIdentifier: "document-version-detail",
              params: {
                id: data?.document?.repository?._id,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/document-authorised.png",
              createdBy: data?.user?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        documentSignedEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: {
                  $in: [
                    data?.document?.repository?.owner,
                    data.document?.created?.by?._id,
                  ],
                },
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let message = `${data?.person} has signed ${data?.document?.reference} ${data.document?.name} in ${data.document?.repository?.reference} ${data.document?.repository?.name}.`;
            let notification = {
              title: "Document management",
              message,
              group: null,
              referenceType: "documenttrees",
              referenceModule: data.document?._id,
              screenIdentifier: "document-version-detail",
              params: {
                id: data.document?.repository?._id || data.document?.repository,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/document-signed.png",
              createdBy: data?.user?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        documentRemovedFromRepoEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: {
                  $in: [
                    data?.document?.repository?.owner,
                    data?.document?.repository?.created?.by,
                  ],
                },
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let message = `${data.actionedBy?.name} removed ${data?.document?.reference} ${data?.document?.name} from ${data?.document?.repository?.reference} ${data?.document?.repository?.name}.`;
            let notification = {
              title: "Document management",
              message,
              group: null,
              referenceType: "documentrepositories",
              referenceModule: data?.document?.repository?._id,
              screenIdentifier: "document-management-detail",
              params: {
                id: data?.document.repository?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data?.actionedBy?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        documentFullConformanceEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: {
                  $in: [
                    data?.document?.created?.by?._id,
                    data?.document?.repository?.owner,
                  ],
                },
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let message = `${data?.document?.reference} ${data?.document?.name} has reached 100% compliance.`;
            let notification = {
              title: "Document management",
              message,
              group: data?.group?._id || data.group,
              referenceType: "documenttrees",
              referenceModule: data._id,
              screenIdentifier: "document-version-detail",
              params: {
                id: data?.document?.repository?._id,
                nodeId: data?.document?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/goal.png",
              createdBy: data?.document?.created?.by?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * cqc/complaint
         */
        complaintNewInvestigatorEvent: async (data) => {
          try {
            let users = [data.investigator];
            let notification = {
              title: "CQC Complaint",
              message: `You have been apointed to investigate ${data.reference} ${data.name} by ${data.created.by.name}`,
              group: data.group?._id,
              referenceType: "complaints",
              referenceModule: data._id,
              screenIdentifier: `cqc-complaint-detail`,
              params: {
                group: data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        complaintReferredInvestigatorEvent: async (data) => {
          try {
            let users = [data.referredInvestigator];
            let notification = {
              title: "CQC Complaint",
              message: `You have been apointed to investigate ${data.reference} ${data.name} ${data.created.by.name}`,
              group: data.group?._id,
              referenceType: "complaints",
              referenceModule: data._id,
              screenIdentifier: `cqc-complaint-detail`,
              params: {
                group: data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        alertSharedSafeguardingUsersEvent: async (data) => {
          try {
            let users = [data.sharedWith];
            let notification = {
              title: "Safeguarding",
              message: `${data.created.by.name} has shared the safeguarding ${data.reference} with you.`,
              group: data.group?._id,
              screenIdentifier: "safeguarding-detail",
              referenceType: "cqcsafeguardings",
              referenceModule: data._id,
              params: {
                group: data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (ex) {
            logger.info(ex);
            reject(ex);
          }
        },
        /**
         * cqc/significantevents
         */
        significanteventPlaneOfActionAssignedEvent: async (data) => {
          try {
            let users = [data.request.assignedTo];
            let notification = {
              title: "Significant events",
              message: `Action for ${data.reference} ${data.title} has been assigned to you.`,
              group: data.group?._id,
              referenceType: "cqcsignificantevents",
              referenceModule: data._id,
              screenIdentifier: `significant-event-detail`,
              params: {
                group: data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.request.createdBy._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * cqc/whistleblow
         */
        newWhistleBlowInvestigatorEvent: async (data) => {
          try {
            let users = [data.reportedTo];
            let notification = {
              title: "CQC Whistle Blow",
              message: `${data.reference} ${data.title} has been reported to you by ${data.created.by.name}`,
              group: data.group?._id,
              referenceType: "cqcwhistleblows",
              referenceModule: data._id,
              screenIdentifier: `cqc-whistleblow-detail`,
              params: {
                group: data.group?._id,
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * crm/cutomers
         */
        customerStageChangedEvent: async ({
          customer: data,
          oldCustomer: prevData,
        }) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                $or: [
                  {
                    invitedUserId: {
                      $in: [data.accountManager._id, data.created.by._id],
                    },
                  },
                  {
                    role: ROLES.HEAD_OF_SERVICE,
                  },
                ],
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "CRM",
              message: `${data.updated.by.name} has changed ${data.reference} ${data.name}'s Organisation profile from ${prevData.stage} to ${data.stage}`,
              group: data.group?._id,
              referenceType: "customers",
              referenceModule: data._id,
              screenIdentifier: "customer-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.updated.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        customerStatusChangedEvent: async ({
          customer: data,
          oldCustomer: prevData,
        }) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                $or: [
                  {
                    invitedUserId: {
                      $in: [data.accountManager._id, data.created.by._id],
                    },
                  },
                  {
                    role: ROLES.HEAD_OF_SERVICE,
                  },
                ],
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "CRM",
              message: `${data.updated.by.name} has changed ${data.reference} ${data.name}'s Status from ${prevData.status} to ${data.status}`,
              group: data.group?._id,
              referenceType: "customers",
              referenceModule: data._id,
              screenIdentifier: "customer-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.updated.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        customerDetailsUpdatedEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: data.accountManager._id,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "CRM",
              message: `${data.updated.by.name} has made changes to ${data.reference} ${data.name}`,
              group: data.group?._id,
              referenceType: "customers",
              referenceModule: data._id,
              screenIdentifier: "customer-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.updated.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        customerNewAccountManagerEvent: async ({
          customer: data,
          oldCustomer: prevData,
        }) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: data.accountManager._id,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "CRM",
              message: `You have been assigned ${data.reference} ${data.name} by ${data.updated.by.name}, the previous owner was ${prevData.accountManager.name}`,
              group: data.group?._id,
              referenceType: "customers",
              referenceModule: data._id,
              screenIdentifier: "customer-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.updated.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * crm/invoices
         */
        sendInvoiceEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: data.customer.accountManager._id,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "Invoice",
              message: `${data.updated.by.name} has sent ${data.reference} to ${data.customer.primaryContact} from ${data.customer.reference} ${data.customer.name}`,
              group: null,
              referenceType: "invoices",
              referenceModule: data._id,
              screenIdentifier: "invoice-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/invoice-sent.png",
              createdBy: data.updated.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        invoicePaymentCompleteEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: data.customer.accountManager._id,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "Invoice",
              message: `${data.updated.by.name} has marked ${data.reference} as paid in ${data.customer.reference} ${data.customer.name}`,
              group: null,
              referenceType: "invoices",
              referenceModule: data._id,
              screenIdentifier: "invoice-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.updated.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        newInvoiceEvent: async (data) => {
          // notifiy account manager
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                invitedUserId: data.customer.accountManager._id,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "Invoice",
              message: `${data.created.by.name} has created ${data.reference} in ${data.customer.reference} ${data.customer.name}`,
              group: null,
              referenceType: "invoices",
              referenceModule: data._id,
              screenIdentifier: "invoice-detail",
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * wallet/expenses
         */
        newExpenseReportSubmissionEvent: async (data) => {
          try {
            let users = data.submission?.lineManagers || [];
            let notification = {
              title: "Expense report",
              message: `${data.created?.by?.name} has submitted expense report ${data.reference}. Please review the report.`,
              group: null,
              referenceType: "expensereports",
              referenceModule: data._id,
              screenIdentifier: `expense-report-detail`,
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/expense-claimed.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        expenseReportReviewedEvent: async (data) => {
          try {
            let users = [data.created?.by];
            let notificationImage = "/notification-default.png";
            switch (data.submission?.status) {
              case "Approved":
                notificationImage = "/approved.png";
              case "Rejected":
                notificationImage = "/declined.png";
            }
            let notification = {
              title: "Expense report",
              message: `Your expense report ${data.reference} has been ${data.submission?.status} by ${data.submission?.decisionMaker?.name}`,
              group: null,
              referenceType: "expensereports",
              referenceModule: data._id,
              screenIdentifier: `expense-report-detail`,
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + notificationImage,
              createdBy: data.submission?.decisionMaker?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * wallet/leaves
         */
        newLeaveRequestSubmissionEvent: async (data) => {
          try {
            let users = data.submission?.lineManagers || [];
            let notification = {
              title: "Leave request",
              message: `${data.created?.by?.name} has submitted leave request ${data.reference}. Please review the request.`,
              group: null,
              referenceType: "leaves",
              referenceModule: data._id,
              screenIdentifier: `leave-request-detail`,
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/leave-request.png",
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        leaveRequestReviewedEvent: async (data) => {
          try {
            let users = [data.created?.by];
            let notificationImage = "/notification-default.png";
            switch (data.submission?.status) {
              case "Approved":
                notificationImage = "/approved.png";
              case "Rejected":
                notificationImage = "/declined.png";
            }
            let notification = {
              title: "Leave request",
              message: `Your leave request ${data.reference} has been ${data.submission?.status} by ${data.submission?.decisionMaker?.name}`,
              group: null,
              referenceType: "leaves",
              referenceModule: data._id,
              screenIdentifier: `leave-request-detail`,
              params: {
                id: data._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + notificationImage,
              createdBy: data.created.by._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * data-import
         */
        dataImportInitiateEvent: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {
                role: ROLES.SUPER_ADMIN,
              }
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "Import Dataset",
              message: `${
                data.user.name
              } initiated a data import process into '${
                data.module
              }' module on ${moment(new Date()).format("DD/MM/YYYY HH:mm")}.`,
              group: null,
              referenceType: "",
              referenceModule: null,
              screenIdentifier: ``,
              params: {},
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.user?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        dataImportCompleteEvent: async (data) => {
          try {
            let users = [data.user];
            let notification = {
              title: "Import Dataset",
              message: `We have successfully imported your datasets into the system that was started at ${moment(
                data.startTime
              ).format("DD/MM/YYYY HH:mm")}. Import duration ${
                data.durationString
              }`,
              group: null,
              referenceType: "",
              referenceModule: null,
              screenIdentifier: ``,
              params: {},
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.user?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /**
         * users
         */
        userMentionedEvent: async (data) => {
          const tempBadParamsFix =
            data.moduleType === "documenttrees"
              ? {
                  id: data.module.repository,
                  nodeId: data.module._id,
                }
              : {};
          try {
            let users = data.mentionedUsers || [];
            let notification = {
              title: "Mentions",
              message: `${data.user.name} mentioned you in a ${
                data.place?.alias
              } in ${data.module?.reference} ${
                data.module.title || data.module.name || ""
              }`,
              group: null,
              referenceType: data.moduleType,
              referenceModule: data.module._id,
              /**
               * TODO: really bad way to handle this mention notifications in this event
               * in future need robust way to detect screens or links
               */
              screenIdentifier:
                moduleToScreenMap[
                  (["audits"].includes(data.moduleType)
                    ? data.module.type?.toLowerCase()
                    : "") + data.moduleType
                ] || ``,
              params: {
                id: data.module._id,
                ...tempBadParamsFix,
              },
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.user?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        referentialIntegrityHandleCompleteEvent: async (data) => {
          try {
            let users = [
              {
                _id: data.initiator._id,
                name: data.initiator.name,
              },
            ];
            let notification = {
              title: "Data integrity checks",
              message: `Data ownership for ${data.sourceUser.name} has been transfered to ${data.destinationUser.name} safely. You can now delete the account ${data.sourceUser.name}.`,
              group: null,
              referenceType: "",
              referenceModule: null,
              screenIdentifier: ``,
              params: {},
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.initiator?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        dataOwnershipTransferedEvent: async (data) => {
          try {
            let users = [
              {
                _id: data.destinationUser._id,
                name: data.destinationUser.name,
              },
            ];
            let notification = {
              title: "Data integrity checks",
              message: `${data.initiator.name} has transferred the ownership of all data from ${data.sourceUser.name} to you.`,
              group: null,
              referenceType: "",
              referenceModule: null,
              screenIdentifier: ``,
              params: {},
              audiences: users,
              popUpStatus: "unread",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.initiator?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
        /** compliance controls */
        controlComplianceUpdates: async (data) => {
          try {
            let memberships = await this.Membership.findByOrg(
              this.connection?.user?.organizationId,
              {}
            ).populate(membershipPopulation);
            const users = memberships.map((m) => m.invitedUserId);
            let notification = {
              title: "Compliance",
              message: `Your organisation has now selected and implemented ${data.control?.name} - Control ${data.control?.clause}.`,
              group: null,
              referenceType: "",
              referenceModule: null,
              screenIdentifier: "control-status-detail",
              params: {
                id: data?._id,
              },
              audiences: users,
              popUpStatus: "read",
              icon: notificationIconUrl + "/notification-default.png",
              createdBy: data.updated?.by?._id,
            };
            dataSets.push(notification);
            resolve(dataSets);
          } catch (err) {
            logger.info("error preparing notification: ", err);
            reject(err);
          }
        },
      };
      return events[eventName](data);
    });
  }
  async sendNotification(eventName, data, options) {
    let notificationService = new NotificationService(this.connection);
    let [buildError, notifications] = await asynchronously(
      this._buildNotification(eventName, data, options)
    );
    const generatedNotifications = await Promise.all(
      notifications.map((notification) =>
        notificationService.notify(notification)
      )
    );
    if (options?.email) {
      await Promise.all(
        /**
         * we are reducing array of array into a single array...
         * basically linearising things:
         * fom arr = [[1,2,3],[4],[5,6,7,8]]
         * to arr = [1,2,3,4,5,6,7,8]
         */
        generatedNotifications
          .reduce((set, total) => {
            return [...set, ...total];
          }, [])
          .map(async (notification) => {
            await sendMail("user-notification", notification.user.email, {
              recipient: notification.user,
              notification: {
                ...notification._doc,
                message: notification.msg,
              },
              loginLink: `${process.env.CLIENT_URL}/admin/notificaion-redirection/?notification=${notification._id}&user=${notification.user._id}`,
            });
          })
      );
    }
  }
}
module.exports = Trigger;
