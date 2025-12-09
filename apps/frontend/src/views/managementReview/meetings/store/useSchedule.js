import { useContext } from "react";
import { ScheduleContext } from "./Context";
export default function useSchedule() {
  const { ...store } = useContext(ScheduleContext);
  return { ...store };
}
