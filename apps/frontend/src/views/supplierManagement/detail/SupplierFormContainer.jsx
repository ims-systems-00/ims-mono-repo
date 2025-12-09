import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import { useSupplier } from "../store";
import SupplierForm from "../SupplierForm";

const SupplierFormContainer = () => {
  const { updateSupplier, visitingSupplier } = useSupplier();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <SupplierForm
        visitingSupplier={visitingSupplier}
        onSubmit={async (data) => {
          await updateSupplier(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default SupplierFormContainer;
