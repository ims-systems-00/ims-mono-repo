import Loading from "@/components/Loader/Loading";
import React from "react";
import { USER_ACTIONS, useDeleteProcess } from "./store";

const FlagMessage = ({}) => {
  const { flaggedData, processing } = useDeleteProcess();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.CHECK_OWNERSHIP].status ? (
        <Loading text="Checking data ownership in multiple modules. Please stand by." />
      ) : (
        <React.Fragment>
          {!flaggedData?.canTransfer && (
            <h4 className="text-success">
              <i className="fa-solid fa-circle-check"></i> Data integrity checks
              complete
            </h4>
          )}
          {flaggedData?.canTransfer && (
            <h4 className="text-warning">
              <i className="fa-solid fa-circle-exclamation"></i> Data integrity
              checks. (Warning)
            </h4>
          )}
          <p>{flaggedData?.message}</p>
        </React.Fragment>
      )}
      <div className="border my-2"></div>
    </React.Fragment>
  );
};

export default FlagMessage;
