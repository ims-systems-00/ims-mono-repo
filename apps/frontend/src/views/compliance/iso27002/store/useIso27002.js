import { useContext } from "react";
import { ISO27002Context } from "./Context";
export default function useISO27002() {
  const { ...store } = useContext(ISO27002Context);
  return { ...store };
}
