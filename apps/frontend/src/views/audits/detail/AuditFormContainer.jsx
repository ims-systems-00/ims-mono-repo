import React, { useContext } from "react";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { useAudits } from "../store";
import AuditForm from "../AuditForm";

const AuditFormContainer = () => {
  const { updateAudit, completeAudit, visitingAudit } = useAudits();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <AuditForm
        visitingAudit={visitingAudit}
        onCompleteAudit={async (data) => {
          await completeAudit(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
        onSubmit={async (data) => {
          await updateAudit(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default AuditFormContainer;
