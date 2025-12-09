import { useContext } from "react";
import { ESGContext } from "./Context";
export default function useESG() {
  const { ...store } = useContext(ESGContext);
  return { ...store };
}
