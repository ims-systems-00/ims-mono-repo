import { useContext } from "react";
import { AuditContext } from "./Context";
export default function useAudits() {
  const { ...store } = useContext(AuditContext);
  return { ...store };
}
