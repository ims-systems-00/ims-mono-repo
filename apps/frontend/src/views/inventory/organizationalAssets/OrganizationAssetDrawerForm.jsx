import React from "react";
import OrganizationAssetForm from "./OrganisationAssetForm";
import { useOrganizationAssets } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const OrganizationAssetDrawerForm = () => {
  let { organization, processing, updateOrganization } =
    useOrganizationAssets();
  const { toggle } = useDrawer();
  return (
    <React.Fragment>
      <OrganizationAssetForm
        drawerView={true}
        processing={processing}
        organization={organization}
        onSubmit={async (data) => {
          await updateOrganization(organization?._id, data);
          toggle("edit-organization-asset-form");
        }}
      />
    </React.Fragment>
  );
};

export default OrganizationAssetDrawerForm;
