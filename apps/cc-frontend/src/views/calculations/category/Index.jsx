import React from "react";
import { CategoryCalculationContextProvider } from "./store/index.js";
import CategoryCalculation from "./CategoryCalculation.jsx";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { useCategory } from "../stores/categoryStore/index.js";

export default function Category() {
  const { category } = useCategory();
  if (!category) return null;
  return (
    <DrawerContextProvider >
      <CategoryCalculationContextProvider category={category}>
        <CategoryCalculation />
      </CategoryCalculationContextProvider>
    </DrawerContextProvider>
  );
}

