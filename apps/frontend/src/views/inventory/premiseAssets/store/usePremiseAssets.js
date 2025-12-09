import { useContext } from "react";
import { PremiseAssetsContext } from "./Context";
export default function usePremiseAssets() {
  const { ...store } = useContext(PremiseAssetsContext);
  return { ...store };
}
