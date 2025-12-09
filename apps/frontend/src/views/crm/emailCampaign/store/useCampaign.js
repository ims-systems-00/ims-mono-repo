import { useContext } from "react";
import { CampaignContext } from "./Context";

export default function useCampaign() {
  const { ...store } = useContext(CampaignContext);
  return { ...store };
}
