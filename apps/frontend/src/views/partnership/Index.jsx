import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import Contents from "./Contents";
import { PartnershipDBContextProvider } from "./store";
const Partnership = () => {
  return (
    <PartnershipDBContextProvider>
      <DrawerContextProvider>
        <Contents />
      </DrawerContextProvider>
    </PartnershipDBContextProvider>
  );
};

export default Partnership;
