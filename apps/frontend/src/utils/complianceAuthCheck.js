import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";

export default function authCompliance() {
  let compliances = [
    {
      service: IMS_SERVICES.ISO27001,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO27001_2022,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO27001_2022_ANNEX_A,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO27002,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO20000,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO14001,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO45001,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.ISO9001,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.DSPTNHS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.BS9997,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    {
      service: IMS_SERVICES.BUILDING_SAFETY_ACT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
  ];
  return compliances;
}
