import React from "react";
import MembershipForm from "./MembershipForm";
import { useUserManager } from "../store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";

const MembershipFormContainer = () => {
  let { visitingUser, updateMembershipInfo } = useUserManager();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <MembershipForm
        membership={visitingUser.membership}
        onSubmit={async (data) => {
          await updateMembershipInfo(visitingUser.membership?._id, data);
          closeDrawer("edit-membership-form");
        }}
      />
    </React.Fragment>
  );
};

export default MembershipFormContainer;
