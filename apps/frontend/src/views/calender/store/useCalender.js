import { useContext } from "react";
import { CalenderContext } from "./Context";
export default function useRepository() {
  const { ...store } = useContext(CalenderContext);
  return { ...store };
}
