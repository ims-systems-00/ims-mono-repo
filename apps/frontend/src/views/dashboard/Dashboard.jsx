import { DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import TaskDrawerDetail from "@/views/taskManagement/TaskDrawerDetail";
import TaskDrawerForm from "@/views/taskManagement/TaskDrawerForm";
import TaskForm from "@/views/taskManagement/TaskForm";
import TaskToolBar from "@/views/taskManagement/TaskToolbar";
import { useTask } from "@/views/taskManagement/store";
import BusinessFunctionDashBoard from "./businessFunctionDashboard/BusinessFunctionDashBoard";
import OrganizationalDashboard from "./orgnaisationDashboard/OrganizationalDashboard";
import OrganizationalDashboardNew from "./orgnaisationDashboard/OrganizationalDashboardNew";
import { useDashboard } from "./store";
const Dashboard = () => {
  let { canLoadOrgDashboardForUser } = useDashboard();
  const { toggle } = useDrawer();
  const { handleCreateTask, processing: taskProcessing } = useTask();
  return (
    <React.Fragment>
      {canLoadOrgDashboardForUser() ? (
        // <OrganizationalDashboard />
        <OrganizationalDashboardNew />
      ) : (
        <BusinessFunctionDashBoard />
      )}

      <DrawerRight toolbar={<TaskToolBar />} drawerId="task-detail">
        <TaskDrawerDetail />
      </DrawerRight>
      <DrawerRight drawerId="edit-task-form">
        <TaskDrawerForm />
      </DrawerRight>
      <DrawerRight drawerId="create-task">
        <TaskForm
          drawerView={true}
          processing={taskProcessing}
          module={null}
          moduleType={"tasks"}
          onSubmit={async (data) => {
            await handleCreateTask(data);
            toggle("create-task");
          }}
        />
      </DrawerRight>
    </React.Fragment>
  );
};

export default Dashboard;
