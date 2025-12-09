import { useContext } from "react";
import { ISO20000Context } from "./Context";
export default function useISO20000() {
  const { ...store } = useContext(ISO20000Context);
  return { ...store };
}
