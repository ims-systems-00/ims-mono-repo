import React, { useContext } from "react";
import { usePremiseAssets } from "../store";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import PremiseAssetForm from "../PremiseAssetForm";

const PremisesAssetsFormContainer = () => {
  const { premise, processing, updatePremiseAsset } = usePremiseAssets();
  const viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <PremiseAssetForm
        processing={processing}
        premise={premise}
        onSubmit={async (data) => {
          await updatePremiseAsset(premise?._id, data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default PremisesAssetsFormContainer;
