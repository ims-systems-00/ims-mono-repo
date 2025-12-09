import React from "react";
import { Spinner } from "@ims-systems-00/ims-ui-kit";

export const LoadingSpinner = ({
  text = "Processing...",
  height = "100vh",
}) => {
  return (
    <div
      className="d-flex flex-column gap-2 align-items-center justify-content-center"
      style={{ height: height }}
    >
      <Spinner size={"sm"} />
      <p>{text}.</p>
    </div>
  );
};
