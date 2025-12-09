import { useContext } from "react";
import { ISO14001Context } from "./Context";
export default function useISO14001() {
  const { ...store } = useContext(ISO14001Context);
  return { ...store };
}
