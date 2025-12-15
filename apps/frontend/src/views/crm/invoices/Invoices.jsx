import { InvoiceContextProvider } from "./store";
import InvoiceTable from "./InvoiceTable";

const Invoices = ({ customer, ...props }) => {
  return (
    <InvoiceContextProvider customer={customer} {...props}>
      <InvoiceTable {...props} />
    </InvoiceContextProvider>
  );
};

export default Invoices;
