import { useContext } from "react";
import { Context } from "./Context";
export default function useDocumentAnalytics() {
  const { ...store } = useContext(Context);
  return { ...store };
}
