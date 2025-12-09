import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import LeaveForm from "../LeaveForm";
import { useLeave } from "../store";
const LeaveFormContainer = () => {
  let {
    visitingLeave,
    updateLeave,
    submitLeave,
    saveAndSubmitLeave,
    approveLeave,
    rejectLeave,
    refreshLeave,
  } = useLeave();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <LeaveForm
        visitingLeave={visitingLeave}
        onSubmit={async (data) => {
          await updateLeave(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onSubmitLeave={async () => {
          await submitLeave();
          viewContextData.switchView && viewContextData.switchView();
        }}
        onSaveAndSubmitLeave={async (data) => {
          await saveAndSubmitLeave(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onApprove={async (data) => {
          await approveLeave(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onReject={async (data) => {
          await rejectLeave(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default LeaveFormContainer;
