import { useContext } from "react";
import { ISO27001_Annex_AContext } from "./Context";
export default function useISO27001_Annex_A() {
  const { ...store } = useContext(ISO27001_Annex_AContext);
  return { ...store };
}
