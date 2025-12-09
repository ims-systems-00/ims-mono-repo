import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import CustomerForm from "./CustomerForm";
import { useCRM } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const CustomerDrawerForm = () => {
  let { visitingCustomer, updateCustomer } = useCRM();
  const { closeDrawer, openDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={visitingCustomer} />
      <CustomerForm
        visitingCustomer={visitingCustomer}
        drawerView
        customerLogo={visitingCustomer?.logo?.src}
        onSubmit={async (data) => {
          await updateCustomer(data);
          closeDrawer("edit-customer-form");
        }}
      />
    </React.Fragment>
  );
};

export default CustomerDrawerForm;
