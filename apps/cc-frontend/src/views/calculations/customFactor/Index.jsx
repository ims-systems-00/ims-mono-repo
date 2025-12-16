import React from "react";
import { CustomFactorContextProvider } from "./store";
import CustomFactor from "./CustomFactor.jsx";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { useCategory } from "../stores/categoryStore/index.js";

export default function () {
  const { category } = useCategory();
  if (!category) return null;
  return (
    <DrawerContextProvider>
      <CustomFactorContextProvider>
        <CustomFactor />
      </CustomFactorContextProvider>
    </DrawerContextProvider>
  );
}
