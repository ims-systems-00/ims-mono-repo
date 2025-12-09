import { useContext } from "react";
import { SupplierContext } from "./Context";

export default function useSupplier() {
  const { ...store } = useContext(SupplierContext);
  return { ...store };
}
