import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const CreateExpenseReport = () => {
  return (
    <React.Fragment>
      <DrawerOpener drawerId="create-expense-report">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>{" "}
          Claim
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default CreateExpenseReport;
