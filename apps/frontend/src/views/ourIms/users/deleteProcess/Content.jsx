import Transfering from "@/components/Loader/Transfering";
import React from "react";
import { useUserManager } from "../store";
import DeleteForm from "./DeleteForm";
import FlagMessage from "./FlagMessage";
import TransferForm from "./TransferForm";
import { USER_ACTIONS, useDeleteProcess } from "./store";

const Content = ({}) => {
  const { deleteUser, transferDataOwnership, flaggedData, processing } =
    useDeleteProcess();
  const { visitingUser } = useUserManager();
  if (!visitingUser) {
    return <p>Select a user to delete or transfer ownership.</p>;
  }
  if (processing[USER_ACTIONS.TRANSFER_OWNERSHIP].status)
    return (
      <React.Fragment>
        <Transfering />
        <p>Data transfer is in progress. Please standby.</p>
      </React.Fragment>
    );
  return (
    <React.Fragment>
      <FlagMessage />
      {flaggedData?.canTransfer &&
        !processing[USER_ACTIONS.CHECK_OWNERSHIP].status && (
          <TransferForm user={visitingUser} onSubmit={transferDataOwnership} />
        )}
      {visitingUser &&
        !processing[USER_ACTIONS.CHECK_OWNERSHIP].status &&
        !flaggedData?.canTransfer && (
          <DeleteForm user={visitingUser} onSubmit={deleteUser} />
        )}
    </React.Fragment>
  );
};

export default Content;
