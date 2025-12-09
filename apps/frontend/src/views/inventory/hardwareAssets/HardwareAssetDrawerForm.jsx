import { useHardwareAssets } from "./store";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import React from "react";
import HardwareAssetForm from "./HardwareAssetForm";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const HardwareAssetDrawerForm = () => {
  const { hardware, updateHardwareAsset, processing } = useHardwareAssets();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <DetailsDrawerHeader data={hardware} />
      <HardwareAssetForm
        hardware={hardware}
        drawerView
        processing={processing}
        onSubmit={async (data) => {
          await updateHardwareAsset(hardware?._id, data);
          closeDrawer("edit-hardware-asset-form");
        }}
      />
    </React.Fragment>
  );
};

export default HardwareAssetDrawerForm;
