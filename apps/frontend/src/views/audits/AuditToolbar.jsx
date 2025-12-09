import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useAudits } from "./store";
import AuditDrawerActions from "./AuditDrawerActions";
import useAccess from "@/hooks/useAccess";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";

const AuditToolBar = (props) => {
  const { visitingAudit, auditType } = useAudits();
  let {
    authUser,
    authSuperUser,
    authInternalUser,
    authExternalUser,
    entityAccessControl,
  } = useAccess();

  return (
    <React.Fragment>
      {" "}
      <DrawerOpener drawerId="send-audit-report">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons-20 icon-icon-paperplanetilt-24" />
        </Button>
      </DrawerOpener>
      {!visitingAudit?.completed?.status &&
        ((authUser({
          service: IMS_SERVICES.AUDIT,
          action: ACTIONS.CREATE,
          effect: EFFECTS.ALLOW,
        }) &&
          auditType === "Internal" &&
          authInternalUser()) ||
          (auditType === "External" && authExternalUser()) ||
          authSuperUser() ||
          entityAccessControl({
            users: [
              visitingAudit?.created?.by?._id,
              visitingAudit?.auditor?._id,
            ],
            effect: "Allow",
          })) && (
          <React.Fragment>
            <div className="">
              <AuditDrawerActions />
            </div>

            <DrawerOpener drawerId="edit-audit-form">
              <Button outline size="sm" className="border-0 ">
                <i className="ims-icons icon-icon-pencil-24" />
              </Button>
            </DrawerOpener>
            <DrawerOpener drawerId="audit-analyser">
              <Button outline size="sm" className="border-0 ">
                Assist & Verification{" "}
                <i className="fa-solid fa-wand-magic-sparkles" />
              </Button>
            </DrawerOpener>
          </React.Fragment>
        )}
    </React.Fragment>
  );
};

export default AuditToolBar;
