import { useContext } from "react";
import { ISO45001Context } from "./Context";
export default function useISO45001() {
  const { ...store } = useContext(ISO45001Context);
  return { ...store };
}
