import { useContext } from "react";
import { CRMContext } from "./Context";

export default function useCRM() {
  const { ...store } = useContext(CRMContext);
  return { ...store };
}
