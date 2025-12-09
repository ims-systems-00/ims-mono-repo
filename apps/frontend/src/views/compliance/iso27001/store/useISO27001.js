import { useContext } from "react";
import { ISO27001Context } from "./Context";
export default function useISO27001() {
  const { ...store } = useContext(ISO27001Context);
  return { ...store };
}
