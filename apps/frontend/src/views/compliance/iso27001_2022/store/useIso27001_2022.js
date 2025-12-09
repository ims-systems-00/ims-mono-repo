import { useContext } from "react";
import { ISO27001_2022Context } from "./Context";
export default function useISO27001_2022() {
  const { ...store } = useContext(ISO27001_2022Context);
  return { ...store };
}
