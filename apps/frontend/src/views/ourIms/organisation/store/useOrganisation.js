import { useContext } from "react";
import { Context } from "./Context";
export default function useOrganisation() {
  const { ...store } = useContext(Context);
  return { ...store };
}
