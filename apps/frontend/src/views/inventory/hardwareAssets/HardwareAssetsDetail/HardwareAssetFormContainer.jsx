import React, { useContext } from "react";
import HardwareAssetForm from "../HardwareAssetForm";
import { useHardwareAssets } from "../store";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";

const HardwareAssetFormContainer = () => {
  let { processing, hardware, updateHardwareAsset } = useHardwareAssets();
  const viewContextData = useContext(ViewContext);
  return (
    <HardwareAssetForm
      processing={processing}
      hardware={hardware}
      onSubmit={async (data) => {
        await updateHardwareAsset(hardware?._id, data);
        viewContextData.switchView && viewContextData.switchView();
      }}
    />
  );
};

export default HardwareAssetFormContainer;
