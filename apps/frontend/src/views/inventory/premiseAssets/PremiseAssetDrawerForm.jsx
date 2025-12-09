import { usePremiseAssets } from "./store";
import React from "react";
import PremiseAssetForm from "./PremiseAssetForm";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const PremiseAssetDrawerForm = () => {
  let { premise, processing, updatePremiseAsset } = usePremiseAssets();
  const { toggle } = useDrawer();
  return (
    <React.Fragment>
      <PremiseAssetForm
        drawerView={true}
        processing={processing}
        premise={premise}
        onSubmit={async (data) => {
          await updatePremiseAsset(premise?._id, data);
          toggle("edit-premise-asset-form");
        }}
      />
    </React.Fragment>
  );
};

export default PremiseAssetDrawerForm;
