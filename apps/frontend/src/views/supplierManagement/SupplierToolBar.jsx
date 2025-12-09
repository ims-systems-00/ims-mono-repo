import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import SupplierDrawerActions from "./SupplioerDrawerActions";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const SupplierToolBar = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
        action: ACTIONS.CREATE,
      }}
    >
      <div className="">
        <SupplierDrawerActions />
      </div>
      <DrawerOpener drawerId="edit-supplier-form">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons-20 icon-icon-pencil-24" />
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default SupplierToolBar;
