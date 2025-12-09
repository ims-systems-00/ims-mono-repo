import { UiManagerProvider } from "../uiManager";
import Content from "./Content";
import { PartnershipProvider } from "./store";
import { steps } from "./steps";
const Partnership = () => {
  return (
    <UiManagerProvider steps={steps}>
      <PartnershipProvider>
        <Content />
      </PartnershipProvider>
    </UiManagerProvider>
  );
};

export default Partnership;
