import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useAnalyticalAssistant } from "./store";

const ToolbarTop = ({}) => {
  const { clearAnalysis } = useAnalyticalAssistant();
  return (
    <React.Fragment>
      <DrawerOpener drawerId="analyise-report">
        <Button outline color="primary" onClick={clearAnalysis}>
          New +
        </Button>
      </DrawerOpener>
    </React.Fragment>
  );
};

export default ToolbarTop;
