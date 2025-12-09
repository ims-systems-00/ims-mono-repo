import { useContext } from "react";
import { SoftwareAssetsContext } from "./Context";
export default function useSoftwareAssets() {
  const { ...store } = useContext(SoftwareAssetsContext);
  return { ...store };
}
