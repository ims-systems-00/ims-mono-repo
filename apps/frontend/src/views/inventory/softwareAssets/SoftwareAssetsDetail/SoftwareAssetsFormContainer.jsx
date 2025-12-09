import React, { useContext } from "react";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { useSoftwareAssets } from "../store";
import SoftwareAssetForm from "../SoftwareAssetForm";

const SoftwareAssetsFormContainer = () => {
  const { software, processing, updateSoftwareAsset } = useSoftwareAssets();
  const viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <SoftwareAssetForm
        processing={processing}
        software={software}
        onSubmit={async (data) => {
          await updateSoftwareAsset(software?._id, data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default SoftwareAssetsFormContainer;
