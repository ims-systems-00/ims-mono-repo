import { useContext } from "react";
import { DashboardContext } from "./Context";
export default function useDashboard() {
  const { ...store } = useContext(DashboardContext);
  return { ...store };
}
