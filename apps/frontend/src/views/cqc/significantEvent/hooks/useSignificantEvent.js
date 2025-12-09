import React from "react";

const useSignificantEvent = () => {
  let isClosedSignificantEvent = (significantEvent) => {
    return significantEvent.signed.status;
  };
  return {
    isClosedSignificantEvent,
  };
};

export default useSignificantEvent;
