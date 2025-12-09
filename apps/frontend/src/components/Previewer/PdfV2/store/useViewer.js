import { useContext } from "react";
import { ViewerContext } from "./Context";
export default function useViewer() {
  const { ...store } = useContext(ViewerContext);
  return { ...store };
}
