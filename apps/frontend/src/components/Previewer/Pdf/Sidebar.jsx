import React from "react";
import Preview from "./Preview";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
const SideBar = ({ previewUrl, ...props }) => {
  return (
    <>
      <div className="pdf-viewer-sidebar d-none d-md-block">
        <Preview
          previewUrl={previewUrl}
          scale={0.3}
          showPageNumber={true}
          {...props}
        />
      </div>
    </>
  );
};
let MemoisedSideBar = React.memo(SideBar);
export default MemoisedSideBar;
