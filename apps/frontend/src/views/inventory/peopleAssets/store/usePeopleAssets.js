import { useContext } from "react";
import { PeopleAssetsContext } from "./Context";
export default function usePeopleAssets() {
  const { ...store } = useContext(PeopleAssetsContext);
  return { ...store };
}
