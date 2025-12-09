import { useContext } from "react";
import { DocumentContext } from "./Context";
export default function useDocument() {
  const { ...store } = useContext(DocumentContext);
  return { ...store };
}
