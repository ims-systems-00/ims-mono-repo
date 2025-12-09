import { useContext } from "react";
import { DSPTContext } from "./Context";
export default function useDSPT() {
  const { ...store } = useContext(DSPTContext);
  return { ...store };
}
