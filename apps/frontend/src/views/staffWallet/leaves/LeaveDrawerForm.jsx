import { useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import LeaveForm from "./LeaveForm";
import { useLeave } from "./store";

const LeaveDrawerForm = () => {
  let {
    visitingLeave,
    updateLeave,
    submitLeave,
    saveAndSubmitLeave,
    approveLeave,
    rejectLeave,
    refreshLeave,
  } = useLeave();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingLeave} />
      <LeaveForm
        drawerView
        onSubmit={async (data) => {
          await updateLeave(data);
          closeDrawer("edit-leave-form");
        }}
        onSubmitLeave={async () => {
          await submitLeave();
          closeDrawer("edit-leave-form");
        }}
        onSaveAndSubmitLeave={async (data) => {
          await saveAndSubmitLeave(data);
          closeDrawer("edit-leave-form");
        }}
        onApprove={async (data) => {
          await approveLeave(data);
          closeDrawer("edit-leave-form");
        }}
        onReject={async (data) => {
          await rejectLeave(data);
          closeDrawer("edit-leave-form");
        }}
        onRefresh={async () => {
          await refreshLeave();
          closeDrawer("edit-leave-form");
        }}
      />
    </React.Fragment>
  );
};

export default LeaveDrawerForm;
