import React from "react";
import {
  INITIATIVE_STATUS,
  InitiativesContextProvider,
} from "./store/index.js";
import Initiatives from "./Initiatives.jsx";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { useInitiativeConfig } from "../store";

export * from "./store";

export default function ({ status = INITIATIVE_STATUS.COMPLETE }) {
  const { year } = useInitiativeConfig({ status });
  return (
    <DrawerContextProvider>
      <InitiativesContextProvider status={status}>
        <Initiatives />
      </InitiativesContextProvider>
    </DrawerContextProvider>
  );
}
