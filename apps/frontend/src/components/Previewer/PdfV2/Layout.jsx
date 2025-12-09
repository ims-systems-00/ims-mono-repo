import React from "react";
import Preview from "./Preview";
import ToolBar from "../ToolBar";
import useViewer from "./store/useViewer";
const Layout = ({}) => {
  const { fileDetails, jumpToPage, zoomIn, zoomOut, currentPage, totalPages } =
    useViewer();
  return (
    <div className="d-flex flex-column">
      <ToolBar
        fileDetails={fileDetails}
        onDownload={() => {}}
        onPageChange={({ pageNumber }) => {
          jumpToPage(pageNumber);
        }}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        page={{
          current: currentPage,
          total: totalPages,
        }}
      />
      <div className="pdf-wrapper flex-grow-1 d-flex">
        <div className="pdf-viewer-main-pannel w-100 mx-auto">
          <Preview />
        </div>
      </div>
    </div>
  );
};
export default Layout;
