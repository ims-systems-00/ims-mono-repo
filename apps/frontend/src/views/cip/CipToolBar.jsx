import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useCip } from "./store";
import CipDrawerActions from "./CipDrawerActions";
import CipLinkActions from "./CipLinkActions";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";
const CipToolBar = (props) => {
  const { isImplementedCip, visitingCip } = useCip();
  return (
    <React.Fragment>
      <Can
        policy={{
          service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
          action: ACTIONS.CREATE,
        }}
      >
        {!isImplementedCip(visitingCip) && (
          <React.Fragment>
            <div className="d-flex">
              <CipLinkActions />
              <CipDrawerActions />
            </div>
            <DrawerOpener drawerId="edit-cip-form">
              <Button outline size="sm" className="border-0 ">
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>
            </DrawerOpener>
            <DrawerOpener drawerId="cip-analyser">
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

export default CipToolBar;
