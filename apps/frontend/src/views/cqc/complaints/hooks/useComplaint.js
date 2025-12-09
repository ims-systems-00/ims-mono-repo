import React from "react";

const useComplaint = () => {
  const isClosedComplaint = (complaint) => {
    return complaint.signed.status;
  };
  return {
    isClosedComplaint,
  };
};

export default useComplaint;
