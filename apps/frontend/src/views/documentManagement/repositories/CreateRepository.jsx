import Can from "@/components/Can/Can";
import { TourStep } from "@/components/Tour";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";

const CreateRepository = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.CREATE,
      }}
    >
      <DrawerOpener drawerId="create-repository">
        <TourStep stepId="create-repository-button">
          <Button color="primary" size="md" className="shadow-sm--hover">
            <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
            {"  "} Create
          </Button>
        </TourStep>
      </DrawerOpener>
    </Can>
  );
};

export default CreateRepository;
