import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import SupplierForm from "./SupplierForm";
import { useSupplier } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const SupplierDrawerForm = () => {
  let { visitingSupplier, updateSupplier } = useSupplier();
  const { closeDrawer, openDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingSupplier} />
      <SupplierForm
        visitingSupplier={visitingSupplier}
        drawerView
        onSubmit={async (data) => {
          await updateSupplier(data);
          closeDrawer("edit-supplier-form");
        }}
      />
    </React.Fragment>
  );
};

export default SupplierDrawerForm;
