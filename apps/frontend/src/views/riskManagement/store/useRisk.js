import { useContext } from "react";
import { RiskContext } from "./Context";
export default function useRisk() {
  const { ...store } = useContext(RiskContext);
  return { ...store };
}
