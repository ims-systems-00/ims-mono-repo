import React from "react";

const useExpense = () => {
  const isDecidedReport = (report) => {
    return (
      report.submission.status === "Approved" ||
      report.submission.status === "Rejected"
    );
  };
  return {
    isDecidedReport,
  };
};

export default useExpense;
