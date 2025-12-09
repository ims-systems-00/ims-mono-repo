import useAccess from "@/hooks/useAccess";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import SoftwareAssetForm from "./SoftwareAssetForm";
import SoftwareKeyForm from "./SoftwareKeyForm";
import SoftwareKeys from "./SoftwareKeys";
import { useSoftwareAssets } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const SoftwareAssetDrawerForm = () => {
  let {
    software,
    processing,
    updateSoftwareAsset,
    handleAddSoftwareKey,
    handleDeleteKey,
  } = useSoftwareAssets();
  const { toggle } = useDrawer();
  let { authUser } = useAccess();
  return (
    <React.Fragment>
      <SoftwareAssetForm
        drawerView={true}
        processing={processing}
        software={software}
        onSubmit={async (data) => {
          await updateSoftwareAsset(software?._id, data);
          toggle("edit-software-asset-form");
        }}
      />
      <SoftwareKeyForm
        drawerView={true}
        software={software}
        processing={processing}
        onSubmit={async (data) => {
          await handleAddSoftwareKey(software?._id, data);
        }}
      />
      {software.keys.length
        ? software.keys.map((softwareKey) => (
            <SoftwareKeys
              key={softwareKey._id}
              processing={processing}
              softwareKey={softwareKey}
              canDelete={authUser({
                service: IMS_SERVICES.INVENTORY,
                action: ACTIONS.CREATE,
                effect: EFFECTS.ALLOW,
              })}
              onSubmit={async () => {
                await handleDeleteKey(software._id, softwareKey._id);
              }}
            />
          ))
        : "None"}
    </React.Fragment>
  );
};

export default SoftwareAssetDrawerForm;
