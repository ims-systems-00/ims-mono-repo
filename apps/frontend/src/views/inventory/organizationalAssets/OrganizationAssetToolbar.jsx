import Can from "@/components/Can/Can";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, IMS_SERVICES } from "@/rolesAndPermissions";

const OrganizationAssetToolBar = (props) => {
  return (
    <Can policy={{ service: IMS_SERVICES.INVENTORY, action: ACTIONS.DELETE }}>
      <DrawerOpener drawerId="edit-organization-asset-form">
        <Button outline size="sm" className="border-0 ">
          <i className="ims-icons-20 icon-icon-pencil-24" />
        </Button>
      </DrawerOpener>
    </Can>
  );
};

export default OrganizationAssetToolBar;
