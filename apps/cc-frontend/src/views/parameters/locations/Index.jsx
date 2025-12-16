import React from "react";
import NoParamsGuard from "../NoParamsGuard";
import { LocationParameterContextProvider } from "./store";
import Locations from "./Locations";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

export default function () {
  return (
    <NoParamsGuard>
      <DrawerContextProvider>
        <LocationParameterContextProvider>
          <Locations />
        </LocationParameterContextProvider>
      </DrawerContextProvider>
    </NoParamsGuard>
  );
}
