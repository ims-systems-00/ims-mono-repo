import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import RiskDrawerActions from "./RiskDrawerActions";
import RiskLinkActions from "./RiskLinkActions";
import { useRisk } from "./store";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const RiskToolBar = (props) => {
  const { visitingRisk } = useRisk();
  return (
    <React.Fragment>
      <Can
        policy={{
          service: IMS_SERVICES.RISK_MANAGEMENT,
          action: ACTIONS.CREATE,
        }}
      >
        {!visitingRisk?.mitigated.status && (
          <React.Fragment>
            <div className="d-flex">
              <RiskLinkActions />
              <RiskDrawerActions />
            </div>
            <DrawerOpener drawerId="edit-risk-form">
              <Button outline size="sm" className="border-0 ">
                <i className="ims-icons-20-16 icon-icon-pencil-24" />
              </Button>
            </DrawerOpener>
            <DrawerOpener drawerId="risk-analyser">
              <Button outline size="sm" className="border-0 ">
                Analyse <i className="fa-solid fa-wand-magic-sparkles" />
              </Button>
            </DrawerOpener>
          </React.Fragment>
        )}
      </Can>
    </React.Fragment>
  );
};

export default RiskToolBar;
