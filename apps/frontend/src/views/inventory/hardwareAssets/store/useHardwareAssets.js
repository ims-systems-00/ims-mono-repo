import { useContext } from "react";
import { HardwareAssetsContext } from "./Context";
export default function useHardwareAssets() {
  const { ...store } = useContext(HardwareAssetsContext);
  return { ...store };
}
