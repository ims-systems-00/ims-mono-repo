import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import AuditForm from "./AuditForm";
import { useAudits } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const AuditDrawerUpdateForm = () => {
  const { visitingAudit, updateAudit, completeAudit, type } = useAudits();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingAudit} />
      <AuditForm
        type={type}
        visitingAudit={visitingAudit}
        drawerView
        onSubmit={async (data) => {
          await updateAudit(data);
          closeDrawer("edit-audit-form");
        }}
        onCompleteAudit={async (data) => {
          await completeAudit(data);
          closeDrawer("edit-audit-form");
        }}
      />
    </React.Fragment>
  );
};

export default AuditDrawerUpdateForm;
