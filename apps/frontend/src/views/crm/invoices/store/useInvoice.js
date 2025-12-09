import { useContext } from "react";
import { InvoiceContext } from "./Context";
export default function useInvoice() {
  const { ...store } = useContext(InvoiceContext);
  return { ...store };
}
