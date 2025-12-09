import { UiManagerProvider } from "../uiManager";
import Content from "./Content";
import { CreateOrganisationProvider } from "./store";
import { steps } from "./steps";
const CreateOrganisation = () => {
  return (
    <UiManagerProvider steps={steps}>
      <CreateOrganisationProvider>
        <Content />
      </CreateOrganisationProvider>
    </UiManagerProvider>
  );
};

export default CreateOrganisation;
