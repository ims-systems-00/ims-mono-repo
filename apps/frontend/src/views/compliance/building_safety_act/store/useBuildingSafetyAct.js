import { useContext } from "react";
import { BuildingSafetyActContext } from "./Context";
export default function useBuildingSafetyAct() {
  const { ...store } = useContext(BuildingSafetyActContext);
  return { ...store };
}
