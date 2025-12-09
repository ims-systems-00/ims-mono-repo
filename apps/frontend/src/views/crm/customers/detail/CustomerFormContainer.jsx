import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import CustomerForm from "../CustomerForm";
import { useCRM } from "../store";

const CustomerFormContainer = () => {
  const { updateCustomer, visitingCustomer } = useCRM();
  let viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <CustomerForm
        visitingCustomer={visitingCustomer}
        customerLogo={updateCustomer?.logo?.src}
        onSubmit={async (data) => {
          await updateCustomer(data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default CustomerFormContainer;
