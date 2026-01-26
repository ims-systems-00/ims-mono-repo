import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";
import { TourStep } from "../../components/Tour";
const CreateRisk = () => {
  return (
    <React.Fragment>
      <TourStep stepId="create-risk-button">
        <Can
          policy={{
            service: IMS_SERVICES.RISK_MANAGEMENT,
            action: ACTIONS.CREATE,
          }}
        >
          <DrawerOpener drawerId="create-risk">
            <Button color="primary" size="md" className="shadow-sm--hover">
              <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
              {"  "} Raise
            </Button>
          </DrawerOpener>
        </Can>
      </TourStep>
    </React.Fragment>
  );
};

export default CreateRisk;
