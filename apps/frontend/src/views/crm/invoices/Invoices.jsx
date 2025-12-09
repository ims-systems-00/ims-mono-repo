import { InvoiceContextProvider } from "./store";
import InvoiceTable from "./InvoiceTable";
import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";

const Invoices = ({ customer, ...props }) => {
  return (
    <DrawerContextProvider>
      <InvoiceContextProvider customer={customer} {...props}>
        <InvoiceTable {...props} />
      </InvoiceContextProvider>
    </DrawerContextProvider>
  );
};

export default Invoices;
