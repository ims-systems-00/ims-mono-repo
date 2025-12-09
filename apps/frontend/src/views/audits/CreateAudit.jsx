import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";

const CreateAudit = () => {
  return (
    <Can
      policy={{
        service: IMS_SERVICES.AUDIT,
        action: ACTIONS.MANAGE,
      }}
    >
      <DrawerOpener drawerId="create-audit">
        <Button color="primary" size="md" className="shadow-sm--hover">
          <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0"></i>
          {"  "} Schedule
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default CreateAudit;
