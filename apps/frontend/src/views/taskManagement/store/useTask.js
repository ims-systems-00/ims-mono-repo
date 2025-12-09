import { useContext } from "react";
import { TaskContext } from "./Context";
export default function useTask() {
  const { ...store } = useContext(TaskContext);
  return { ...store };
}
