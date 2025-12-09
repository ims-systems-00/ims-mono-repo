import React from "react";

const useSafeguarding = () => {
  const isClosedSafeguarding = (safeguarding) => {
    return safeguarding.signed.status;
  };
  return {
    isClosedSafeguarding,
  };
};

export default useSafeguarding;
