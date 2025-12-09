import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import React, { useContext } from "react";
import PeopleAssetForm from "../PeopleAssetForm";
import { usePeopleAssets } from "../store";

const PeopleAssetsFormContainer = () => {
  const { processing, people, updatePeople } = usePeopleAssets();
  const viewContextData = useContext(ViewContext);
  return (
    <React.Fragment>
      <PeopleAssetForm
        people={people}
        processing={processing}
        onSubmit={async (data) => {
          await updatePeople(people?._id, data);
          viewContextData.switchView && viewContextData.switchView();
        }}
      />
    </React.Fragment>
  );
};

export default PeopleAssetsFormContainer;
