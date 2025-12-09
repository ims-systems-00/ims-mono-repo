import { useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import UserForm from "../UserForm";
import { useUserManager } from "../store";

const UserFormContainer = () => {
  const { visitingUser, updateUser } = useUserManager();
  const { closeDrawer } = useDrawer();
  return (
    <React.Fragment>
      <UserForm
        user={visitingUser}
        onSubmit={async (data) => {
          await updateUser(data);
          closeDrawer("edit-user-form");
        }}
      />
    </React.Fragment>
  );
};

export default UserFormContainer;
