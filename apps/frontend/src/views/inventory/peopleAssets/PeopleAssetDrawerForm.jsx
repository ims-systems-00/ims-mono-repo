import React from "react";
import { usePeopleAssets } from "./store";
import PeopleAssetForm from "./PeopleAssetForm";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const PeopleAssetDrawerForm = () => {
  let { people, processing, updatePeople } = usePeopleAssets();
  let { toggle } = useDrawer();
  return (
    <React.Fragment>
      <PeopleAssetForm
        drawerView={true}
        people={people}
        processing={processing}
        onSubmit={async (data) => {
          await updatePeople(people?._id, data);
          toggle("edit-people-form");
        }}
      />
    </React.Fragment>
  );
};

export default PeopleAssetDrawerForm;
