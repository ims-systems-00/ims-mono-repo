import { CampaignContextProvider } from "../store";
import CampaignDetail from "./CampaignDetail";

const Index = (props) => {
  return (
    <CampaignContextProvider {...props}>
      <CampaignDetail {...props} />
    </CampaignContextProvider>
  );
};

export default Index;
