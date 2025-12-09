import { useContext } from "react";
import { BS9997Context } from "./Context";
export default function useBS9997() {
  const { ...store } = useContext(BS9997Context);
  return { ...store };
}
