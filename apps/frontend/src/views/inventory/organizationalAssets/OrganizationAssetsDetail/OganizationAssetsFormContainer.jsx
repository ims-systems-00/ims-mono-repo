import React, { useContext } from "react";
import OrganizationAssetForm from "../OrganisationAssetForm";
import { useOrganizationAssets } from "../store";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";

const OrganizationAssetsFormContainer = () => {
  const { organization, processing, updateOrganization } =
    useOrganizationAssets();
  const viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <OrganizationAssetForm
        processing={processing}
        organization={organization}
        onSubmit={async (data) => {
          await updateOrganization(organization?._id, data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default OrganizationAssetsFormContainer;
