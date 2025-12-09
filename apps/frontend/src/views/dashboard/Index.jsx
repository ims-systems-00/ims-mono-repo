import Can from "@/components/Can/Can";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";
import Dashboard from "./Dashboard";
import { DashboardContextProvider } from "./store";
import { TaskContextProvider } from "@/views/taskManagement/store";
const Index = () => {
  return (
    <DashboardContextProvider>
      <DrawerContextProvider>
        <TaskContextProvider>
          <Can
            policy={{
              service: IMS_SERVICES.DASHBOARD,
              action: ACTIONS.READ,
            }}
          >
            <div className="main-dashboard">
              <Dashboard />
            </div>
          </Can>
        </TaskContextProvider>
      </DrawerContextProvider>
    </DashboardContextProvider>
  );
};

export default Index;
