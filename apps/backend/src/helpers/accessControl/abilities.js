const {
  ACTIONS,
  ROLES,
  IMS_SERVICES,
} = require("@ims-systems-00/ims-core/lib/constants");
const { AbilityBuilder, createMongoAbility } = require("@casl/ability");

function defineAPIAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  if (user?.role === ROLES.SUPER_ADMIN) {
    can(ACTIONS.MANAGE, "all");
  } else if (user?.role === ROLES.HEAD_OF_SERVICE) {
    can(ACTIONS.MANAGE, "all");
    cannot(ACTIONS.MANAGE, [
      IMS_SERVICES.LICENSE_MANAGEMENT,
      IMS_SERVICES.ORGANISATION,
      IMS_SERVICES.PARTNERSHIPS,
    ]);
    cannot(
      [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
      IMS_SERVICES.IAM_GROUPS
    );
  } else if (user?.role === ROLES.BASIC_USER) {
    can(ACTIONS.MANAGE, "all");
    cannot(ACTIONS.MANAGE, [
      IMS_SERVICES.ORGANISATION,
      IMS_SERVICES.AUDIT,
      IMS_SERVICES.INVITATIONS,
      IMS_SERVICES.MEMBERSHIPS,
      IMS_SERVICES.PARTNERSHIPS,
      IMS_SERVICES.LICENSE_MANAGEMENT,
    ]);
    cannot(
      [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
      [
        IMS_SERVICES.IAM_GROUPS,
        IMS_SERVICES.IAM_PREMISES,
        IMS_SERVICES.AUDIT,
        IMS_SERVICES.COMPLIANCE_TOOL,
      ]
    );
  } else if (user?.role === ROLES.INTERNAL_AUDITOR) {
    can(ACTIONS.READ, "all");
    can(ACTIONS.MANAGE, IMS_SERVICES.AUDIT, IMS_SERVICES.TASK_MANAGER);
    cannot(ACTIONS.MANAGE, [
      IMS_SERVICES.ORGANISATION,
      IMS_SERVICES.INVITATIONS,
      IMS_SERVICES.MEMBERSHIPS,
      IMS_SERVICES.PARTNERSHIPS,
      IMS_SERVICES.LICENSE_MANAGEMENT,
    ]);
  } else if (user?.role === ROLES.EXTERNAL_AUDITOR) {
    can(ACTIONS.READ, "all");
    can(ACTIONS.MANAGE, [IMS_SERVICES.AUDIT, IMS_SERVICES.TASK_MANAGER]);
    cannot(ACTIONS.MANAGE, [
      IMS_SERVICES.ORGANISATION,
      IMS_SERVICES.INVITATIONS,
      IMS_SERVICES.MEMBERSHIPS,
      IMS_SERVICES.PARTNERSHIPS,
      IMS_SERVICES.LICENSE_MANAGEMENT,
    ]);
  } else if (user?.role === ROLES.EXTERNAL_USER) {
    can(ACTIONS.MANAGE, "all");
    cannot(ACTIONS.MANAGE, [
      IMS_SERVICES.ORGANISATION,
      IMS_SERVICES.AUDIT,
      IMS_SERVICES.INVITATIONS,
      IMS_SERVICES.MEMBERSHIPS,
      IMS_SERVICES.PARTNERSHIPS,
      IMS_SERVICES.LICENSE_MANAGEMENT,
    ]);
    cannot(
      [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
      [
        IMS_SERVICES.IAM_GROUPS,
        IMS_SERVICES.IAM_PREMISES,
        IMS_SERVICES.AUDIT,
        IMS_SERVICES.COMPLIANCE_TOOL,
      ]
    );
  }
  return build();
}

exports.defineAPIAbilitiesFor = defineAPIAbilitiesFor;
