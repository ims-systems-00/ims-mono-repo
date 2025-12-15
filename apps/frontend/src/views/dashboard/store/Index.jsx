import React from "react";
import useAccess from "@/hooks/useAccess";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import OrganizationalDashboard from "./orgnaisationDashboard/OrganizationalDashboard";
import BusinessFunctionDashBoard from "./businessFunctionDashboard/BusinessFunctionDashBoard";
import { DashboardContextProvider } from "./store";
import OldOrganisationalDashboard from "./orgnaisationDashboard/OldOrgDashboard";

const Dashboard = () => {
  let { authUser, authGlobalAccess } = useAccess();
  return (
    <DashboardContextProvider>
      {authUser({
        service: IMS_SERVICES.DASHBOARD,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW,
      }) && authGlobalAccess() ? (
        <React.Fragment>
          <OrganizationalDashboard />
          {/* <OldOrganisationalDashboard /> */}
        </React.Fragment>
      ) : (
        <BusinessFunctionDashBoard />
      )}
    </DashboardContextProvider>
  );
};

export default Dashboard;
