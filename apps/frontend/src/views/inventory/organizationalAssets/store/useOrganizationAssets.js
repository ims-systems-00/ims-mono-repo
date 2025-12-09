import { useContext } from "react";
import { OrganizationAssetsContext } from "./Context";
export default function useOrganizationAssets() {
  const { ...store } = useContext(OrganizationAssetsContext);
  return { ...store };
}
