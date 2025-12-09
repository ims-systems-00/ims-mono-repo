import { useContext } from "react";
import { LeaveContext } from "./Context";

export default function useLeave() {
  const { ...store } = useContext(LeaveContext);
  return { ...store };
}
