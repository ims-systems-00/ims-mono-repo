import { ACTIONS, EFFECTS, IMS_SERVICES, ROLES } from "@/rolesAndPermissions";
import ForgotPassword from "./ForogtPassword";
import Login from "./Login";
import Registration from "./Registration";
import Logout from "./Logout";
import SetupNewPassword from "./SetupNewPassword";
import UserProfile from "./UserProfoile";
import ChangePassword from "./ChangePassword";
import VerifyAccount from "./VerifyAccount";
import SystemPreparationScreen from "./SystemPreparation/SystemPreparationScreen";
import ResendVerification from "./ResendVerification";
import OrgChoiceScreen from "./OrgChoiceScreen/OrgChoiceScreen";

const routes = [
  {
    path: "/register",
    name: "Login",
    invisible: true,
    component: Registration,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
  },
  {
    path: "/preparation-screen",
    name: "Login",
    invisible: true,
    component: SystemPreparationScreen,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    invisible: true,
    component: Login,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
  },
  {
    path: "/forgotpassword",
    name: "Forgot password",
    invisible: true,
    component: ForgotPassword,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
  },
  {
    path: "/setup-password/:token/",
    name: "Setup password",
    invisible: true,
    component: SetupNewPassword,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
  },
  {
    path: "/logout",
    invisible: true,
    component: Logout,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/users/:id/changepassword",
    name: "Change Password",
    invisible: true,
    layout: "/auth",
    component: ChangePassword,
  },
  {
    path: "/resend-account-verification",
    name: "Verify your account",
    invisible: true,
    layout: "/auth",
    component: ResendVerification,
  },
  {
    path: "/account-verification/:token/",
    name: "Verify your account",
    invisible: true,
    layout: "/auth",
    component: VerifyAccount,
  },
  {
    path: "/profile",
    invisible: true,
    component: UserProfile,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/admin",
    authorisedRoles: [ROLES.SUPER, ROLES.HOS, ROLES.BASIC, ROLES.AUDITOR],
  },
  {
    path: "/organisation-selection",
    name: "Login",
    invisible: true,
    component: OrgChoiceScreen,
    accessPolicy: {
      service: IMS_SERVICES.USERS,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    },
    layout: "/auth",
  },
];

export default routes;
