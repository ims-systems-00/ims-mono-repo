import { useContext } from "react";
import { ISO9001Context } from "./Context";
export default function useISO9001() {
  const { ...store } = useContext(ISO9001Context);
  return { ...store };
}
