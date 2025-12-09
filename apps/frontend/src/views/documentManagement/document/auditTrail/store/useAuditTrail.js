import { useContext } from "react";
import { AuditTrailContext } from "./Context";
export default function useAuditTrail() {
  const { ...store } = useContext(AuditTrailContext);
  return { ...store };
}
