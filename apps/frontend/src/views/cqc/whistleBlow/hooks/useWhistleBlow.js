import React from "react";

const useWhistleBlow = () => {
  const isClosedWhistleBlow = (whistleBlow) => {
    return whistleBlow.signed.status;
  };
  return {
    isClosedWhistleBlow,
  };
};

export default useWhistleBlow;
