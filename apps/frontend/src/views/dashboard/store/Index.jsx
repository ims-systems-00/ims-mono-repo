import React from "react";
import useAccess from "@/hooks/useAccess";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import OrganizationalDashboard from "./orgnaisationDashboard/OrganizationalDashboard";
import BusinessFunctionDashBoard from "./businessFunctionDashboard/BusinessFunctionDashBoard";
import { DashboardContextProvider } from "./store";
import OldOrganisationalDashboard from "./orgnaisationDashboard/OldOrgDashboard";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Dashboard = () => {
  let { authUser, authGlobalAccess } = useAccess();
  return (
    <DashboardContextProvider>
      <DrawerContextProvider>
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
      </DrawerContextProvider>
    </DashboardContextProvider>
  );
};

export default Dashboard;
