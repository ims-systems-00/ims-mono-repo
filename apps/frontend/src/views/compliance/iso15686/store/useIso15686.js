import { useContext } from "react";
import { ISO15686Context } from "./Context";
export default function useISO15686() {
  const { ...store } = useContext(ISO15686Context);
  return { ...store };
}
