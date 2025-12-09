import React from "react";
import ToolBar from "./ToolBar";
const PreviewUnavailable = ({ toolBarProps }) => {
  return (
    <>
      <ToolBar {...toolBarProps} />
      <h4 className="m-5 text-danger text-center">
        To view this file please click download and open file to view.
      </h4>
    </>
  );
};

export default PreviewUnavailable;
