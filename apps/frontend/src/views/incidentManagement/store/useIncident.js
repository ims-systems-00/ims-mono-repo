import { useContext } from "react";
import { IncidentContext } from "./Context";

export default function useIncident() {
  const { ...store } = useContext(IncidentContext);
  return { ...store };
}
