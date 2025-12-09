import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useCRM } from "./store";
import CustomerDrawerActions from "./CustomerDrawerActions";

const CustomerToolBar = (props) => {
  const { visitingCustomer } = useCRM();
  return (
    <React.Fragment>
      <div className="">
        <CustomerDrawerActions />
      </div>

      <DrawerOpener drawerId="edit-customer-form">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons-20 icon-icon-pencil-24" />
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default CustomerToolBar;
