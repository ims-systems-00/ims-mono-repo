import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import walletsRoutes from "@/views/staffWallet/wallets/routes";
import myWalletRoute from "@/views/staffWallet/myWallet/routes";

const routes = [
  {
    collapse: true,
    name: "iHR",
    icon: "ims-icons-20 icon-icon-users-24",
    accessPolicy: {
      service: IMS_SERVICES.OUR_IMS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    state: "walletCollapse",
    views: [...myWalletRoute, ...walletsRoutes],
  },
];

export default routes;
