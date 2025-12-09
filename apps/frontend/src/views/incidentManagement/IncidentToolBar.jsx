import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useIncident } from "./store";
import IncidentDrawerActions from "./IncidentDrawerActions";
import IncidentLinkActions from "./IncidentLinkActions";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const IncidentToolBar = (props) => {
  const { visitingIncident, isResolvedIncident } = useIncident();
  return (
    <React.Fragment>
      {!isResolvedIncident() && (
        <Can
          policy={{
            service: IMS_SERVICES.RISK_MANAGEMENT,
            action: ACTIONS.CREATE,
          }}
        >
          <React.Fragment>
            <div className="d-flex">
              <IncidentLinkActions />
              <IncidentDrawerActions />
            </div>
            <DrawerOpener drawerId="edit-incident-form">
              <Button outline size="sm" className="border-0 ">
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>
            </DrawerOpener>
            <DrawerOpener drawerId="incident-analyser">
              <Button outline size="sm" className="border-0 ">
                Analyse <i className="fa-solid fa-wand-magic-sparkles" />
              </Button>
            </DrawerOpener>
          </React.Fragment>
        </Can>
      )}
    </React.Fragment>
  );
};

export default IncidentToolBar;
