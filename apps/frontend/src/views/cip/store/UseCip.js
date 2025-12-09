import { useContext } from "react";
import { CipContext } from "./Context";
export default function useCip() {
  const { ...store } = useContext(CipContext);
  return { ...store };
}
