import React from "react";

const useLeaves = () => {
  const isDecidedLeave = (leave) => {
    return (
      leave.submission.status === "Approved" ||
      leave.submission.status === "Rejected"
    );
  };
  return {
    isDecidedLeave,
  };
};

export default useLeaves;
