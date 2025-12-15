import Contents from "./Contents";
import { PartnershipDBContextProvider } from "./store";
const Partnership = () => {
  return (
    <PartnershipDBContextProvider>
      <Contents />
    </PartnershipDBContextProvider>
  );
};

export default Partnership;
